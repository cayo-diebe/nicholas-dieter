const GITHUB_OWNER = "cayo-diebe";
const GITHUB_REPO = "nicholas-dieter";
const DEFAULT_PRIMARY_BRANCH = "main";
const DEFAULT_MIRROR_BRANCHES = "";
const DEFAULT_SIGNUP_EMAIL_TO = "cayodiebe@gmail.com,nicholasdieter@gmail.com";
const DEFAULT_SIGNUP_EMAIL_FROM = "Nicholas Dieter <site@nicholasdieter.com>";
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

const cleanText = (value = "", maxLength = 1200) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const cleanMultiline = (value = "", maxLength = 3000) =>
  String(value || "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, maxLength);

const parseEmailList = (value = "") =>
  String(value || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

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

const validateSignup = (body = {}) => {
  const firstName = cleanText(body.firstName, 120);
  const lastName = cleanText(body.lastName, 120);
  const email = cleanText(body.email, 240);
  const phone = cleanText(body.phone, 80);

  if (cleanText(body.website, 200)) {
    return { spam: true };
  }

  if (!firstName || !lastName || !email || !phone) {
    throw new HttpError("Preencha nome, sobrenome, e-mail e telefone.", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError("Informe um e-mail valido.", 400);
  }

  return {
    firstName,
    lastName,
    email,
    phone,
    trajectory: cleanMultiline(body.trajectory, 3000),
    workshopTitle: cleanText(body.workshopTitle, 180) || "Oficina",
    workshopSlug: cleanText(body.workshopSlug, 120),
    language: cleanText(body.language, 20) || "pt",
    pageUrl: cleanText(body.pageUrl, 500),
  };
};

const getSignupEmailConfig = (env) => ({
  apiKey: getEnvValue(env, "RESEND_API_KEY"),
  to: Array.from(
    new Set([
      ...parseEmailList(DEFAULT_SIGNUP_EMAIL_TO),
      ...parseEmailList(getEnvValue(env, "SIGNUP_EMAIL_TO")),
    ]),
  ),
  from: getEnvValue(env, "SIGNUP_EMAIL_FROM") || DEFAULT_SIGNUP_EMAIL_FROM,
});

const buildSignupEmail = (signup, request) => {
  const fullName = `${signup.firstName} ${signup.lastName}`.trim();
  const receivedAt = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const userAgent = cleanText(request.headers.get("User-Agent") || "", 500);
  const lines = [
    `Nova inscricao no site Nicholas Dieter`,
    ``,
    `Oficina: ${signup.workshopTitle}${signup.workshopSlug ? ` (${signup.workshopSlug})` : ""}`,
    `Nome: ${fullName}`,
    `E-mail: ${signup.email}`,
    `Telefone: ${signup.phone}`,
    `Idioma da pagina: ${signup.language}`,
    `Pagina: ${signup.pageUrl || "-"}`,
    `Recebido em: ${receivedAt}`,
    ``,
    `Trajetoria / mensagem:`,
    signup.trajectory || "-",
    ``,
    `Navegador: ${userAgent || "-"}`,
  ];

  const rows = [
    ["Oficina", `${signup.workshopTitle}${signup.workshopSlug ? ` (${signup.workshopSlug})` : ""}`],
    ["Nome", fullName],
    ["E-mail", signup.email],
    ["Telefone", signup.phone],
    ["Idioma da pagina", signup.language],
    ["Pagina", signup.pageUrl || "-"],
    ["Recebido em", receivedAt],
  ];

  return {
    subject: `Nova inscricao: ${signup.workshopTitle} - ${fullName}`,
    text: lines.join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#171717;line-height:1.5">
        <h1 style="font-size:20px;margin:0 0 16px">Nova inscricao no site Nicholas Dieter</h1>
        <table style="border-collapse:collapse;width:100%;max-width:720px">
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <th style="border:1px solid #ddd;padding:8px;text-align:left;background:#f6f1df;width:170px">${escapeHtml(label)}</th>
                  <td style="border:1px solid #ddd;padding:8px">${escapeHtml(value)}</td>
                </tr>
              `,
            )
            .join("")}
        </table>
        <h2 style="font-size:16px;margin:20px 0 8px">Trajetoria / mensagem</h2>
        <p style="white-space:pre-wrap;border:1px solid #ddd;padding:12px;background:#fafafa">${escapeHtml(signup.trajectory || "-")}</p>
        <p style="color:#666;font-size:12px;margin-top:20px">Navegador: ${escapeHtml(userAgent || "-")}</p>
      </div>
    `,
  };
};

const handleSignup = async (request, env) => {
  const body = await request.json().catch(() => ({}));
  const signup = validateSignup(body);

  if (signup.spam) {
    return jsonResponse({ sent: true });
  }

  const config = getSignupEmailConfig(env);
  if (!config.apiKey) {
    throw new HttpError(
      "Envio de e-mail ainda nao configurado.",
      503,
    );
  }

  const email = buildSignupEmail(signup, request);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: config.to,
      reply_to: signup.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new HttpError(payload.message || "Nao foi possivel enviar o e-mail agora.", 502);
  }

  return jsonResponse({ sent: true, to: config.to });
};

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

const getBranchRef = async (env, branch) => {
  try {
    return await githubRequest(env, `git/ref/heads/${encodeBranchPath(branch)}`);
  } catch (error) {
    if (error.status === 404) {
      throw new HttpError(
        `Nao encontrei o repositorio ${GITHUB_OWNER}/${GITHUB_REPO} ou a branch ${branch}. Verifique se o token tem acesso a este repo e permissao Contents read/write.`,
        404,
      );
    }
    throw error;
  }
};

const getPublicationFiles = (publication) => {
  const filesByPath = new Map();

  publication.uploads.forEach((upload) => {
    filesByPath.set(upload.path, {
      path: upload.path,
      content: upload.content,
      encoding: "base64",
    });
  });

  filesByPath.set("published-data.js", {
    path: "published-data.js",
    content: publication.content,
    encoding: "utf-8",
  });

  return Array.from(filesByPath.values());
};

const createPublicationCommit = async (env, publication, branch) => {
  const ref = await getBranchRef(env, branch);
  const baseCommit = await githubRequest(env, `git/commits/${ref.object.sha}`);
  const treeEntries = [];

  for (const file of getPublicationFiles(publication)) {
    const blob = await githubRequest(env, "git/blobs", {
      method: "POST",
      body: JSON.stringify({ content: file.content, encoding: file.encoding }),
    });
    treeEntries.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
  }

  const tree = await githubRequest(env, "git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: treeEntries }),
  });
  const commit = await githubRequest(env, "git/commits", {
    method: "POST",
    body: JSON.stringify({
      message: `Publish site content from admin (${new Date().toLocaleString("pt-BR")})`,
      tree: tree.sha,
      parents: [ref.object.sha],
    }),
  });

  await githubRequest(env, `git/refs/heads/${encodeBranchPath(branch)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return commit.sha;
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
    if (url.pathname === "/api/signup" && request.method === "POST") {
      return await handleSignup(request, env);
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
