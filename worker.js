const GITHUB_OWNER = "cayo-diebe";
const GITHUB_REPO = "nicholas-dieter";
const DEFAULT_PRIMARY_BRANCH = "main";
const DEFAULT_MIRROR_BRANCHES = "";
const SESSION_COOKIE = "nd_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

const textEncoder = new TextEncoder();

class HttpError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

const getEnvValue = (env, key) => env?.[key] || globalThis.process?.env?.[key] || "";

const jsonResponse = (payload, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });

const parseCookies = (header = "") =>
  Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf("=");
        return separator >= 0
          ? [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))]
          : [part, ""];
      }),
  );

const toBase64Url = (value) => {
  const bytes = typeof value === "string" ? textEncoder.encode(value) : value;
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
};

const toBase64 = (value) => {
  const bytes = typeof value === "string" ? textEncoder.encode(value) : value;
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

const fromBase64UrlJson = (value) => {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
};

const getSessionSecret = (env) =>
  getEnvValue(env, "SESSION_SECRET") ||
  getEnvValue(env, "GITHUB_TOKEN") ||
  getEnvValue(env, "ADMIN_PASSWORD") ||
  "nicholas-dieter-admin";

const signValue = async (value, secret) => {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
};

const createSession = async (env) => {
  const payload = toBase64Url(
    JSON.stringify({
      sub: "admin",
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    }),
  );
  const signature = await signValue(payload, getSessionSecret(env));
  return `${payload}.${signature}`;
};

const verifySession = async (request, env) => {
  const cookies = parseCookies(request.headers.get("Cookie") || "");
  const session = cookies[SESSION_COOKIE];
  if (!session) return false;

  const [payload, signature] = session.split(".");
  if (!payload || !signature) return false;

  const expected = await signValue(payload, getSessionSecret(env));
  if (signature !== expected) return false;

  try {
    const parsed = fromBase64UrlJson(payload);
    return parsed.sub === "admin" && Number(parsed.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

const getLoginConfig = (env) => ({
  username: getEnvValue(env, "ADMIN_USER") || "admin",
  password: getEnvValue(env, "ADMIN_PASSWORD") || "123",
});

const handleLogin = async (request, env) => {
  const body = await request.json().catch(() => ({}));
  const config = getLoginConfig(env);

  if (body.username !== config.username || body.password !== config.password) {
    return jsonResponse({ message: "Usuario ou senha invalidos." }, 401);
  }

  const session = await createSession(env);
  return jsonResponse(
    { authenticated: true },
    200,
    {
      "Set-Cookie": `${SESSION_COOKIE}=${encodeURIComponent(session)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`,
    },
  );
};

const handleLogout = () =>
  jsonResponse(
    { authenticated: false },
    200,
    {
      "Set-Cookie": `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    },
  );

const encodeBranchPath = (branch) => branch.split("/").map(encodeURIComponent).join("/");

const getMirrorBranches = (env, primaryBranch) =>
  (getEnvValue(env, "GITHUB_MIRROR_BRANCHES") || DEFAULT_MIRROR_BRANCHES)
    .split(",")
    .map((branch) => branch.trim())
    .filter((branch) => branch && branch !== primaryBranch);

const githubRequest = async (env, endpoint, options = {}) => {
  const token = getEnvValue(env, "GITHUB_TOKEN");

  if (!token) {
    throw new HttpError(
      "GITHUB_TOKEN nao esta disponivel no runtime do Worker. Configure em Settings > Variables & Secrets, nao em Build.",
      503,
    );
  }

  const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "nicholas-dieter-admin",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new HttpError(payload.message || `GitHub respondeu com erro ${response.status}.`, response.status);
  }

  return payload;
};

const encodeContentPath = (path) => path.split("/").map(encodeURIComponent).join("/");

const validatePublication = (body) => {
  if (!body || typeof body.content !== "string" || !body.content.includes("window.ND_PUBLISHED_DATA")) {
    throw new Error("Publicacao invalida.");
  }

  const uploads = Array.isArray(body.uploads) ? body.uploads : [];
  uploads.forEach((upload) => {
    if (!upload || typeof upload.path !== "string" || typeof upload.content !== "string") {
      throw new Error("Upload invalido.");
    }
    if (upload.path.startsWith("/") || upload.path.includes("..")) {
      throw new Error("Caminho de upload invalido.");
    }
  });

  return {
    content: body.content,
    uploads,
  };
};

const getExistingContentSha = async (env, path, branch) => {
  try {
    const file = await githubRequest(env, `contents/${encodeContentPath(path)}?ref=${encodeURIComponent(branch)}`);
    return file.sha || null;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
};

const putContentFile = async (env, file, branch, index) => {
  const existingSha = await getExistingContentSha(env, file.path, branch);
  const content = file.encoding === "base64" ? file.content : toBase64(file.content);
  const body = {
    message: `Publish site content from admin (${new Date().toLocaleString("pt-BR")})`,
    content,
    branch,
    ...(existingSha ? { sha: existingSha } : {}),
  };

  try {
    const result = await githubRequest(env, `contents/${encodeContentPath(file.path)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return result.commit?.sha || null;
  } catch (error) {
    if (error.status === 422 && /content is unchanged/i.test(error.message || "")) {
      return null;
    }
    throw new HttpError(`Falha ao publicar ${file.path}: ${error.message}`, error.status || 500);
  }
};

const createPublicationCommit = async (env, publication, branch) => {
  const files = [
    ...publication.uploads,
    { path: "published-data.js", content: publication.content, encoding: "utf-8" },
  ];
  let lastCommitSha = null;

  for (let index = 0; index < files.length; index += 1) {
    const commitSha = await putContentFile(env, files[index], branch, index);
    if (commitSha) lastCommitSha = commitSha;
  }

  return lastCommitSha;
};

const mirrorCommit = async (env, commitSha, branch) =>
  githubRequest(env, `git/refs/heads/${encodeBranchPath(branch)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commitSha, force: false }),
  });

const handlePublish = async (request, env) => {
  if (!(await verifySession(request, env))) {
    return jsonResponse({ message: "Sessao expirada. Entre novamente no admin." }, 401);
  }

  const body = await request.json().catch(() => ({}));
  const publication = validatePublication(body);
  const primaryBranch = getEnvValue(env, "GITHUB_BRANCH") || DEFAULT_PRIMARY_BRANCH;
  const commitSha = await createPublicationCommit(env, publication, primaryBranch);
  const mirroredBranches = [];
  const mirrorFailures = [];

  if (commitSha) {
    for (const branch of getMirrorBranches(env, primaryBranch)) {
      try {
        await mirrorCommit(env, commitSha, branch);
        mirroredBranches.push(branch);
      } catch (error) {
        mirrorFailures.push({ branch, message: error.message || "Falha ao espelhar branch." });
      }
    }
  }

  return jsonResponse({ commitSha, branch: primaryBranch, mirroredBranches, mirrorFailures });
};

const handleApi = async (request, env) => {
  const url = new URL(request.url);

  try {
    if (url.pathname === "/api/session" && request.method === "GET") {
      return jsonResponse({ authenticated: await verifySession(request, env) });
    }
    if (url.pathname === "/api/login" && request.method === "POST") {
      return await handleLogin(request, env);
    }
    if (url.pathname === "/api/logout" && request.method === "POST") {
      return handleLogout();
    }
    if (url.pathname === "/api/publish" && request.method === "POST") {
      return await handlePublish(request, env);
    }
    return jsonResponse({ message: "Endpoint nao encontrado." }, 404);
  } catch (error) {
    return jsonResponse({ message: error.message || "Erro no servidor." }, error.status || 500);
  }
};

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      if (url.pathname.startsWith("/api/")) {
        return await handleApi(request, env);
      }

      return await env.ASSETS.fetch(request);
    } catch (error) {
      return jsonResponse({ message: error.message || "Erro no servidor." }, error.status || 500);
    }
  },
};
