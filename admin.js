(function () {
  const AUTH_KEY = "nicholas-dieter-admin-auth";
  const GITHUB_TOKEN_KEY = "nicholas-dieter-github-token";
  const GITHUB_OWNER = "cayo-diebe";
  const GITHUB_REPO = "nicholas-dieter";
  const GITHUB_DEFAULT_BRANCH = "main";
  const ADMIN_USER = "admin";
  const ADMIN_PASSWORD = "123";

  let workshops = window.ND.loadWorkshops();
  let siteSettings = window.ND.loadSiteSettings();
  let selectedSlug = workshops[0]?.slug || "";

  const loginSection = document.querySelector("#admin-login");
  const adminApp = document.querySelector("#admin-app");
  const loginForm = document.querySelector("#login-form");
  const loginError = document.querySelector("#login-error");
  const form = document.querySelector("#admin-form");
  const settingsForm = document.querySelector("#site-settings-form");
  const siteSettingsStatus = document.querySelector("#site-settings-status");
  const siteContentLanguage = document.querySelector("#site-content-language");
  const siteFaqEditor = document.querySelector("#site-faq-editor");
  const recordsPreview = document.querySelector("#records-preview");
  const list = document.querySelector("#admin-list");
  const exportBox = document.querySelector("#export-box");
  const publicationExportBox = document.querySelector("#publication-export-box");
  const workshopSaveStatus = document.querySelector("#workshop-save-status");
  const githubTokenInput = document.querySelector("#github-token");
  const githubBranchInput = document.querySelector("#github-branch");
  const publishServerButton = document.querySelector("#publish-server");
  const publishStatus = document.querySelector("#publish-status");
  const campaignUrl = document.querySelector("#campaign-url");
  const programEditor = document.querySelector("#program-editor");
  const videoEditor = document.querySelector("#video-editor");
  const faqEditor = document.querySelector("#faq-editor");
  const galleryPreview = document.querySelector("#gallery-preview");
  const stepCards = Array.from(document.querySelectorAll("[data-admin-step]"));
  const stepLinks = Array.from(document.querySelectorAll("[data-admin-step-target]"));
  const stepCurrent = document.querySelector("#admin-step-current");
  const stepTitle = document.querySelector("#admin-step-title");
  const stepStatus = document.querySelector("#admin-step-status");
  const prevStepButton = document.querySelector("#admin-prev-step");
  const nextStepButton = document.querySelector("#admin-next-step");
  const adminRouteLinks = Array.from(document.querySelectorAll("[data-admin-route-link]"));
  const adminRoutePanels = Array.from(document.querySelectorAll("[data-admin-route-panel]"));
  const adminRoutes = new Set(adminRouteLinks.map((link) => link.dataset.adminRouteLink));

  let activeStepIndex = 0;
  let activeSiteLanguage = "pt";
  let activeAdminRoute = "site-visual";

  const getSelected = () => workshops.find((workshop) => workshop.slug === selectedSlug);
  const getCopy = (workshop) => window.ND.getWorkshopCopy(workshop, "pt");
  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const isAuthenticated = () => window.sessionStorage.getItem(AUTH_KEY) === "true";

  const setAuthenticated = (value) => {
    if (value) {
      window.sessionStorage.setItem(AUTH_KEY, "true");
    } else {
      window.sessionStorage.removeItem(AUTH_KEY);
    }
  };

  if (githubTokenInput) {
    githubTokenInput.value = window.sessionStorage.getItem(GITHUB_TOKEN_KEY) || "";
  }

  if (githubBranchInput && !githubBranchInput.value) {
    githubBranchInput.value = GITHUB_DEFAULT_BRANCH;
  }

  const showAdmin = () => {
    loginSection.hidden = true;
    adminApp.hidden = false;
    fillSiteSettingsForm();
    renderList();
    fillForm();
    setActiveStep(0);
    setAdminRoute(getAdminRouteFromHash());
  };

  const showLogin = () => {
    loginSection.hidden = false;
    adminApp.hidden = true;
  };

  const slugify = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const splitLines = (value) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const getNestedValue = (source, path) =>
    path.split(".").reduce((value, key) => value?.[key], source) || "";

  const setNestedValue = (target, path, value) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const parent = keys.reduce((current, key) => {
      current[key] = current[key] || {};
      return current[key];
    }, target);
    parent[lastKey] = value;
    return target;
  };

  const getAdminRouteFromHash = () => {
    const hash = window.location.hash.replace("#", "");
    return adminRoutes.has(hash) ? hash : activeAdminRoute;
  };

  const setAdminRoute = (route) => {
    const nextRoute = adminRoutes.has(route) ? route : "site-visual";
    activeAdminRoute = nextRoute;

    adminRouteLinks.forEach((link) => {
      const isActive = link.dataset.adminRouteLink === nextRoute;
      link.classList.toggle("is-active", isActive);
      link.setAttribute("aria-current", isActive ? "page" : "false");
    });

    adminRoutePanels.forEach((panel) => {
      const routes = panel.dataset.adminRoutePanel.split(/\s+/);
      panel.hidden = !routes.includes(nextRoute);
    });

    if (nextRoute === "oficinas") {
      setActiveStep(activeStepIndex);
    }
  };

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const formatMoney = (value = "") => {
    const digits = String(value).replace(/\D/g, "");
    if (!digits) return "";
    return currencyFormatter.format(Number(digits) / 100).replace(/\u00a0/g, " ");
  };

  const normalizeCashValue = (value = "") => {
    const trimmed = String(value).trim();
    return /\d/.test(trimmed) ? formatMoney(trimmed) : trimmed;
  };

  const applyMoneyMask = (input) => {
    input.value = formatMoney(input.value);
  };

  const setActiveStep = (index) => {
    if (!stepCards.length) return;

    activeStepIndex = Math.max(0, Math.min(index, stepCards.length - 1));
    const activeCard = stepCards[activeStepIndex];
    const label = activeCard.dataset.adminStepLabel || "";
    const counter = `Etapa ${activeStepIndex + 1} de ${stepCards.length}`;

    stepCards.forEach((card, cardIndex) => {
      const isActive = cardIndex === activeStepIndex;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-hidden", String(!isActive));
    });

    stepLinks.forEach((link) => {
      const isActive = link.dataset.adminStepTarget === activeCard.dataset.adminStep;
      link.classList.toggle("is-active", isActive);
      link.setAttribute("aria-current", isActive ? "step" : "false");
    });

    if (stepCurrent) stepCurrent.textContent = counter;
    if (stepStatus) stepStatus.textContent = counter;
    if (stepTitle) stepTitle.textContent = label;
    if (prevStepButton) prevStepButton.disabled = activeStepIndex === 0;
    if (nextStepButton) {
      nextStepButton.disabled = activeStepIndex === stepCards.length - 1;
      nextStepButton.textContent =
        activeStepIndex === stepCards.length - 1 ? "Última etapa" : "Próxima etapa";
    }
  };

  const imageLabel = (value = "") =>
    value.startsWith("data:image") ? "Imagem enviada pelo navegador" : value;

  const videoTypeOptions = [
    { value: "scene", label: "Fragmento de cena" },
    { value: "testimonial", label: "Depoimento / recomendação" },
    { value: "process", label: "Bastidor de processo" },
  ];

  const emptyVideo = { title: "", type: "scene", url: "", description: "" };

  const renderVideoTypeOptions = (selected = "scene") =>
    videoTypeOptions
      .map(
        (option) =>
          `<option value="${option.value}"${option.value === selected ? " selected" : ""}>${option.label}</option>`,
      )
      .join("");

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", reject);
      reader.readAsDataURL(file);
    });

  const prepareImageFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Arquivo inválido. Envie apenas imagens.");
    }

    const original = await readFileAsDataUrl(file);
    if (file.type === "image/svg+xml" || file.type === "image/gif") return original;

    return new Promise((resolve) => {
      const image = new Image();
      image.addEventListener("load", () => {
        const maxSize = 1500;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.fillStyle = "#070608";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.74));
      });
      image.addEventListener("error", () => resolve(original));
      image.src = original;
    });
  };

  const renderSingleImagePreview = (fieldName, sourceForm = form) => {
    const preview = document.querySelector(`[data-image-preview="${fieldName}"]`);
    if (!preview) return;

    const field = sourceForm?.elements?.[fieldName];
    const value = field?.value.trim() || "";
    if (!value) {
      preview.innerHTML = "<span>Sem imagem</span>";
      return;
    }

    preview.innerHTML = `
      <img src="${escapeHtml(window.ND.resolveAsset(value))}" alt="">
      <small>${escapeHtml(imageLabel(value))}</small>
    `;
  };

  const renderGalleryPreview = () => {
    const images = splitLines(form.gallery.value);
    if (!images.length) {
      galleryPreview.innerHTML = '<p class="empty-gallery">Nenhuma imagem adicionada.</p>';
      return;
    }

    galleryPreview.innerHTML = images
      .map(
        (src, index) => `
          <figure class="admin-gallery-item">
            <img src="${escapeHtml(window.ND.resolveAsset(src))}" alt="">
            <figcaption>${escapeHtml(imageLabel(src))}</figcaption>
            <button class="admin-mini-button" type="button" data-remove-gallery="${index}">Remover</button>
          </figure>
        `,
      )
      .join("");
  };

  const renderRecordsPreview = () => {
    const images = splitLines(settingsForm.recordsImages.value);
    if (!images.length) {
      recordsPreview.innerHTML = '<p class="empty-gallery">Sem imagens próprias. A home usará as galerias das oficinas.</p>';
      return;
    }

    recordsPreview.innerHTML = images
      .map(
        (src, index) => `
          <figure class="admin-gallery-item">
            <img src="${escapeHtml(window.ND.resolveAsset(src))}" alt="">
            <figcaption>${escapeHtml(imageLabel(src))}</figcaption>
            <button class="admin-mini-button" type="button" data-remove-record="${index}">Remover</button>
          </figure>
        `,
      )
      .join("");
  };

  const fillSiteCopyFields = () => {
    const copy = window.ND.getSiteCopy(activeSiteLanguage, siteSettings);
    settingsForm.querySelectorAll("[data-site-copy-field]").forEach((field) => {
      field.value = getNestedValue(copy, field.dataset.siteCopyField);
    });
  };

  const readSiteCopyFields = () => {
    const copy = {};
    settingsForm.querySelectorAll("[data-site-copy-field]").forEach((field) => {
      setNestedValue(copy, field.dataset.siteCopyField, field.value.trim());
    });
    return copy;
  };

  const renderSiteFaqEditor = (faq = []) => {
    siteFaqEditor.innerHTML = faq
      .map(
        (item, index) => `
          <article class="admin-repeater-item" data-site-faq-item>
            <div class="admin-repeater-heading">
              <strong>Pergunta global ${index + 1}</strong>
              <button class="admin-mini-button" type="button" data-remove-site-faq>Remover</button>
            </div>
            <label>
              Pergunta
              <input data-site-faq-question placeholder="As oficinas são presenciais ou online?" value="${escapeHtml(item.question || "")}">
            </label>
            <label>
              Resposta
              <textarea data-site-faq-answer rows="3" placeholder="Explique de forma curta e clara.">${escapeHtml(item.answer || "")}</textarea>
            </label>
          </article>
        `,
      )
      .join("");

    siteFaqEditor.querySelectorAll("[data-remove-site-faq]").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest("[data-site-faq-item]").remove();
        if (!siteFaqEditor.children.length) renderSiteFaqEditor([{ question: "", answer: "" }]);
      });
    });
  };

  const readSiteFaqEditor = () =>
    Array.from(siteFaqEditor.querySelectorAll("[data-site-faq-item]"))
      .map((item) => ({
        question: item.querySelector("[data-site-faq-question]").value.trim(),
        answer: item.querySelector("[data-site-faq-answer]").value.trim(),
      }))
      .filter((item) => item.question || item.answer);

  const storeActiveSiteLanguageDraft = () => {
    siteSettings.copy = {
      ...(siteSettings.copy || {}),
      [activeSiteLanguage]: {
        ...(siteSettings.copy?.[activeSiteLanguage] || {}),
        ...readSiteCopyFields(),
      },
    };
    siteSettings.globalFaq = {
      ...(siteSettings.globalFaq || {}),
      [activeSiteLanguage]: readSiteFaqEditor(),
    };
  };

  const readCurrentSiteSettings = () => {
    storeActiveSiteLanguageDraft();
    return window.ND.normalizeSiteSettings({
      ...siteSettings,
      homeHeroImage: settingsForm.homeHeroImage.value.trim() || window.ND.defaultSiteSettings.homeHeroImage,
      instagramUrl: settingsForm.instagramUrl.value.trim() || window.ND.defaultSiteSettings.instagramUrl,
      vimeoUrl: settingsForm.vimeoUrl.value.trim() || window.ND.defaultSiteSettings.vimeoUrl,
      whatsappPhone: settingsForm.whatsappPhone.value.trim() || window.ND.defaultSiteSettings.whatsappPhone,
      whatsappMessage: settingsForm.whatsappMessage.value.trim() || window.ND.defaultSiteSettings.whatsappMessage,
      recordsImages: splitLines(settingsForm.recordsImages.value),
    });
  };

  const buildPublicationFileContent = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      siteSettings: readCurrentSiteSettings(),
      workshops: window.ND.normalizeWorkshops(workshops),
    };
    return `window.ND_PUBLISHED_DATA = ${JSON.stringify(payload, null, 2)};\n`;
  };

  const showPublicationExport = (targetBox = exportBox) => {
    if (!targetBox) return;
    const content = buildPublicationFileContent();
    targetBox.value = content;
    targetBox.classList.add("is-visible");
    targetBox.select();
    navigator.clipboard?.writeText(content).catch(() => {});
  };

  const setPublishStatus = (message, isError = false) => {
    if (!publishStatus) return;
    publishStatus.textContent = message;
    publishStatus.classList.toggle("is-error", isError);
  };

  const getGitHubToken = () => githubTokenInput?.value.trim() || window.sessionStorage.getItem(GITHUB_TOKEN_KEY) || "";

  const rememberGitHubToken = (token) => {
    if (!token) return;
    window.sessionStorage.setItem(GITHUB_TOKEN_KEY, token);
    if (githubTokenInput) githubTokenInput.value = token;
  };

  const getGitHubBranch = () => githubBranchInput?.value.trim() || GITHUB_DEFAULT_BRANCH;

  const githubRequest = async (endpoint, options = {}, token = getGitHubToken()) => {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${endpoint}`, {
      ...options,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(options.headers || {}),
      },
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || `GitHub respondeu com erro ${response.status}.`);
    }

    return payload;
  };

  const parseImageDataUrl = (value = "") => {
    const match = String(value).match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
    return match ? { mime: match[1].toLowerCase(), base64: match[2] } : null;
  };

  const getImageExtension = (mime) =>
    ({
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/svg+xml": "svg",
      "image/avif": "avif",
    })[mime] || "jpg";

  const hashValue = async (value) => {
    if (window.crypto?.subtle && window.TextEncoder) {
      const hash = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
      return Array.from(new Uint8Array(hash))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    }

    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    return `${Date.now().toString(16)}-${hash.toString(16)}`;
  };

  const prepareServerPublication = async () => {
    const uploads = [];
    const uploadCache = new Map();
    const uploadFolder = new Date().toISOString().slice(0, 10);

    const moveImageToUpload = async (value) => {
      const parsed = parseImageDataUrl(value);
      if (!parsed) return value;
      if (uploadCache.has(value)) return uploadCache.get(value).path;

      const hash = await hashValue(value);
      const path = `assets/uploads/${uploadFolder}/${hash.slice(0, 24)}.${getImageExtension(parsed.mime)}`;
      const upload = { path, content: parsed.base64, encoding: "base64" };
      uploadCache.set(value, upload);
      uploads.push(upload);
      return path;
    };

    const nextSettings = window.ND.clone(readCurrentSiteSettings());
    nextSettings.homeHeroImage = await moveImageToUpload(nextSettings.homeHeroImage);
    nextSettings.recordsImages = await Promise.all((nextSettings.recordsImages || []).map(moveImageToUpload));

    const nextWorkshops = await Promise.all(
      window.ND.normalizeWorkshops(workshops).map(async (workshop) => ({
        ...workshop,
        cardImage: await moveImageToUpload(workshop.cardImage),
        heroImage: await moveImageToUpload(workshop.heroImage),
        gallery: await Promise.all((workshop.gallery || []).map(moveImageToUpload)),
      })),
    );

    const payload = {
      exportedAt: new Date().toISOString(),
      siteSettings: nextSettings,
      workshops: nextWorkshops,
    };

    return {
      payload,
      uploads,
      content: `window.ND_PUBLISHED_DATA = ${JSON.stringify(payload, null, 2)};\n`,
    };
  };

  const publishToGitHub = async (successMessage = "Conteudo publicado no servidor.") => {
    const token = getGitHubToken();
    const branch = getGitHubBranch();

    if (!token) {
      setPublishStatus("Informe um token do GitHub com permissao de Contents read/write.", true);
      return false;
    }

    rememberGitHubToken(token);
    if (publishServerButton) publishServerButton.disabled = true;
    setPublishStatus("Preparando imagens e conteudo para o servidor...");

    try {
      const publication = await prepareServerPublication();
      setPublishStatus("Criando commit no GitHub...");

      const ref = await githubRequest(`git/ref/heads/${encodeURIComponent(branch)}`, undefined, token);
      const baseCommit = await githubRequest(`git/commits/${ref.object.sha}`, undefined, token);
      const files = [
        { path: "published-data.js", content: publication.content, encoding: "utf-8" },
        ...publication.uploads,
      ];
      const treeEntries = [];

      for (const file of files) {
        const blob = await githubRequest(
          "git/blobs",
          {
            method: "POST",
            body: JSON.stringify({ content: file.content, encoding: file.encoding }),
          },
          token,
        );
        treeEntries.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
      }

      const tree = await githubRequest(
        "git/trees",
        {
          method: "POST",
          body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: treeEntries }),
        },
        token,
      );
      const commit = await githubRequest(
        "git/commits",
        {
          method: "POST",
          body: JSON.stringify({
            message: `Publish site content from admin (${new Date().toLocaleString("pt-BR")})`,
            tree: tree.sha,
            parents: [ref.object.sha],
          }),
        },
        token,
      );

      await githubRequest(
        `git/refs/heads/${encodeURIComponent(branch)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ sha: commit.sha, force: false }),
        },
        token,
      );

      siteSettings = publication.payload.siteSettings;
      workshops = publication.payload.workshops;
      selectedSlug = workshops.find((workshop) => workshop.slug === selectedSlug)?.slug || workshops[0]?.slug || "";

      try {
        window.ND.saveSiteSettings(siteSettings);
        window.ND.saveWorkshops(workshops);
      } catch {
        // The server already has the published content. Local cache is only a convenience.
      }

      if (publicationExportBox) {
        publicationExportBox.value = publication.content;
        publicationExportBox.classList.add("is-visible");
      }

      fillSiteSettingsForm({ keepCurrent: true });
      renderList();
      fillForm();
      setPublishStatus(`${successMessage} Commit ${commit.sha.slice(0, 7)}. Pode levar alguns segundos para aparecer.`);
      return true;
    } catch (error) {
      setPublishStatus(error.message || "Nao foi possivel publicar no servidor.", true);
      return false;
    } finally {
      if (publishServerButton) publishServerButton.disabled = false;
    }
  };

  const publishAfterSaveIfPossible = (onSuccess, onMissingToken) => {
    if (!getGitHubToken()) {
      onMissingToken?.();
      return;
    }

    publishToGitHub(onSuccess).then((published) => {
      if (!published) return;
      setWorkshopStatus(onSuccess);
      if (siteSettingsStatus) siteSettingsStatus.textContent = onSuccess;
    });
  };

  const setWorkshopStatus = (message) => {
    if (workshopSaveStatus) workshopSaveStatus.textContent = message;
  };

  const syncImagePreviews = () => {
    renderSingleImagePreview("homeHeroImage", settingsForm);
    renderRecordsPreview();
    renderSingleImagePreview("cardImage");
    renderSingleImagePreview("heroImage");
    renderGalleryPreview();
  };

  const fillSiteSettingsForm = (options = {}) => {
    if (!options.keepCurrent) siteSettings = window.ND.loadSiteSettings();
    settingsForm.homeHeroImage.value = siteSettings.homeHeroImage || window.ND.defaultSiteSettings.homeHeroImage;
    settingsForm.instagramUrl.value = siteSettings.instagramUrl || "";
    settingsForm.vimeoUrl.value = siteSettings.vimeoUrl || "";
    settingsForm.whatsappPhone.value = siteSettings.whatsappPhone || "";
    settingsForm.whatsappMessage.value = siteSettings.whatsappMessage || "";
    settingsForm.recordsImages.value = (siteSettings.recordsImages || []).join("\n");
    siteContentLanguage.value = activeSiteLanguage;
    fillSiteCopyFields();
    renderSiteFaqEditor(window.ND.getGlobalFaq(activeSiteLanguage, siteSettings));
    renderSingleImagePreview("homeHeroImage", settingsForm);
    renderRecordsPreview();
  };

  const renderList = () => {
    list.innerHTML = workshops
      .map((workshop) => {
        const copy = getCopy(workshop);
        return `
          <button type="button" class="${workshop.slug === selectedSlug ? "is-active" : ""}" data-admin-slug="${workshop.slug}">
            <strong>${escapeHtml(copy.title || workshop.slug)}</strong>
            <span>${window.ND.getWorkshopUrl(workshop.slug)}</span>
          </button>
        `;
      })
      .join("");

    list.querySelectorAll("[data-admin-slug]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedSlug = button.dataset.adminSlug;
        fillForm();
        setActiveStep(0);
        renderList();
      });
    });
  };

  const renderProgramEditor = (program = []) => {
    programEditor.innerHTML = program
      .map(
        (module, index) => `
          <article class="admin-repeater-item" data-program-item>
            <div class="admin-repeater-heading">
              <strong>Módulo ${index + 1}</strong>
              <button class="admin-mini-button" type="button" data-remove-program>Remover</button>
            </div>
            <label>
              Título do módulo
              <input data-program-title placeholder="Presença e escuta" value="${escapeHtml(module.title || "")}">
            </label>
            <label>
              Itens do módulo
              <textarea data-program-items rows="4" placeholder="Um item por linha. Ex: aquecimento cênico">${escapeHtml((module.items || []).join("\n"))}</textarea>
            </label>
          </article>
        `,
      )
      .join("");

    programEditor.querySelectorAll("[data-remove-program]").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest("[data-program-item]").remove();
        if (!programEditor.children.length) renderProgramEditor([{ title: "", items: [] }]);
      });
    });
  };

  const renderVideoEditor = (videos = []) => {
    videoEditor.innerHTML = videos
      .map(
        (video, index) => `
          <article class="admin-repeater-item" data-video-item>
            <div class="admin-repeater-heading">
              <strong>Vídeo ${index + 1}</strong>
              <button class="admin-mini-button" type="button" data-remove-video>Remover</button>
            </div>
            <div class="form-row form-row--two">
              <label>
                Título do vídeo
                <input data-video-title placeholder="Fragmento de cena: jogo de presença" value="${escapeHtml(video.title || "")}">
              </label>
              <label>
                Tipo
                <select data-video-type>
                  ${renderVideoTypeOptions(video.type || "scene")}
                </select>
              </label>
            </div>
            <label>
              Link do vídeo
              <input data-video-url placeholder="https://vimeo.com/123456789" value="${escapeHtml(video.url || "")}">
            </label>
            <label>
              Descrição
              <textarea data-video-description rows="3" placeholder="Breve contexto do fragmento, bastidor ou depoimento.">${escapeHtml(video.description || "")}</textarea>
            </label>
          </article>
        `,
      )
      .join("");

    videoEditor.querySelectorAll("[data-remove-video]").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest("[data-video-item]").remove();
        if (!videoEditor.children.length) renderVideoEditor([emptyVideo]);
      });
    });
  };

  const renderFaqEditor = (faq = []) => {
    faqEditor.innerHTML = faq
      .map(
        (item, index) => `
          <article class="admin-repeater-item" data-faq-item>
            <div class="admin-repeater-heading">
              <strong>Pergunta ${index + 1}</strong>
              <button class="admin-mini-button" type="button" data-remove-faq>Remover</button>
            </div>
            <label>
              Pergunta
              <input data-faq-question placeholder="Preciso ter experiência prévia?" value="${escapeHtml(item.question || "")}">
            </label>
            <label>
              Resposta
              <textarea data-faq-answer rows="3" placeholder="Resposta curta, direta e acolhedora.">${escapeHtml(item.answer || "")}</textarea>
            </label>
          </article>
        `,
      )
      .join("");

    faqEditor.querySelectorAll("[data-remove-faq]").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest("[data-faq-item]").remove();
        if (!faqEditor.children.length) renderFaqEditor([{ question: "", answer: "" }]);
      });
    });
  };

  const readProgramEditor = () =>
    Array.from(programEditor.querySelectorAll("[data-program-item]"))
      .map((item) => ({
        title: item.querySelector("[data-program-title]").value.trim(),
        items: splitLines(item.querySelector("[data-program-items]").value),
      }))
      .filter((module) => module.title || module.items.length);

  const readVideoEditor = () =>
    Array.from(videoEditor.querySelectorAll("[data-video-item]"))
      .map((item) => ({
        title: item.querySelector("[data-video-title]").value.trim(),
        type: item.querySelector("[data-video-type]").value,
        url: item.querySelector("[data-video-url]").value.trim(),
        description: item.querySelector("[data-video-description]").value.trim(),
      }))
      .filter((video) => video.title || video.url || video.description);

  const readFaqEditor = () =>
    Array.from(faqEditor.querySelectorAll("[data-faq-item]"))
      .map((item) => ({
        question: item.querySelector("[data-faq-question]").value.trim(),
        answer: item.querySelector("[data-faq-answer]").value.trim(),
      }))
      .filter((item) => item.question || item.answer);

  const fillForm = () => {
    const workshop = getSelected();
    if (!workshop) {
      form.reset();
      renderProgramEditor([{ title: "", items: [] }]);
      renderVideoEditor([emptyVideo]);
      renderFaqEditor([{ question: "", answer: "" }]);
      syncImagePreviews();
      campaignUrl.textContent = "Nenhuma oficina cadastrada.";
      return;
    }

    const copy = getCopy(workshop);
    const next = copy.nextClass || {};
    const investment = workshop.investment || copy.investment || {};
    const coordinator = copy.coordinator || {};

    form.slug.value = workshop.slug;
    form.status.value = workshop.status || "open";
    form.title.value = copy.title || "";
    form.label.value = copy.label || "";
    form.headline.value = copy.headline || "";
    form.summary.value = copy.summary || "";
    form.about.value = (copy.about || []).join("\n");
    form.languagePt.value = workshop.languages?.pt || "";
    form.languageEs.value = workshop.languages?.es || "";
    form.languageEn.value = workshop.languages?.en || "";
    form.cardImage.value = workshop.cardImage || "";
    form.heroImage.value = workshop.heroImage || "";
    form.gallery.value = (workshop.gallery || []).join("\n");
    form.dates.value = next.dates || "";
    form.schedule.value = next.schedule || "";
    form.workload.value = next.workload || "";
    form.location.value = next.location || "";
    form.cash.value = normalizeCashValue(investment.cash || "");
    form.installments.value = investment.installments || "";
    form.investmentNotes.value = investment.notes || "";
    form.coordinatorName.value = coordinator.name || "";
    form.coordinatorRole.value = coordinator.role || "";
    form.coordinatorBio.value = coordinator.bio || "";
    renderProgramEditor(copy.program?.length ? copy.program : [{ title: "", items: [] }]);
    renderVideoEditor(copy.videos?.length ? copy.videos : [emptyVideo]);
    renderFaqEditor(copy.faq?.length ? copy.faq : [{ question: "", answer: "" }]);
    syncImagePreviews();

    const cleanUrl = window.ND.getWorkshopUrl(workshop.slug);
    const dynamicUrl = window.ND.getWorkshopUrl(workshop.slug, undefined, { clean: false });
    campaignUrl.innerHTML = `
      URL de campanha: <a href="${cleanUrl}">${cleanUrl}</a><br>
      URL dinâmica: <a href="${dynamicUrl}">${dynamicUrl}</a>
    `;
  };

  const getStatusText = () => form.status.options[form.status.selectedIndex].text;

  const validateRequiredFields = () => {
    const invalidField = Array.from(form.querySelectorAll("[required]")).find(
      (field) => !field.value.trim(),
    );

    if (!invalidField) return true;

    const card = invalidField.closest("[data-admin-step]");
    const index = stepCards.indexOf(card);
    if (index >= 0) setActiveStep(index);
    invalidField.focus();
    invalidField.reportValidity();
    return false;
  };

  adminRouteLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const route = link.dataset.adminRouteLink;
      window.history.pushState(null, "", `#${route}`);
      setAdminRoute(route);
    });
  });

  window.addEventListener("hashchange", () => {
    const route = getAdminRouteFromHash();
    if (route !== activeAdminRoute) setAdminRoute(route);
  });

  window.addEventListener("popstate", () => {
    setAdminRoute(getAdminRouteFromHash());
  });

  stepLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const index = stepCards.findIndex(
        (card) => card.dataset.adminStep === link.dataset.adminStepTarget,
      );
      setActiveStep(index);
    });
  });

  prevStepButton?.addEventListener("click", () => {
    setActiveStep(activeStepIndex - 1);
  });

  nextStepButton?.addEventListener("click", () => {
    setActiveStep(activeStepIndex + 1);
  });

  form.cash.addEventListener("input", () => {
    applyMoneyMask(form.cash);
  });

  form.cash.addEventListener("blur", () => {
    if (form.cash.value.trim()) applyMoneyMask(form.cash);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateRequiredFields()) return;

    const currentSlug = selectedSlug;
    const nextSlug = slugify(form.slug.value || form.title.value);
    const existing = workshops.find((workshop) => workshop.slug === currentSlug);

    const copy = {
      title: form.title.value.trim(),
      label: form.label.value.trim(),
      headline: form.headline.value.trim(),
      summary: form.summary.value.trim(),
      about: splitLines(form.about.value),
      program: readProgramEditor(),
      videos: readVideoEditor(),
      coordinator: {
        name: form.coordinatorName.value.trim(),
        role: form.coordinatorRole.value.trim(),
        bio: form.coordinatorBio.value.trim(),
      },
      nextClass: {
        dates: form.dates.value.trim(),
        schedule: form.schedule.value.trim(),
        workload: form.workload.value.trim(),
        location: form.location.value.trim(),
        statusText: getStatusText(),
      },
      investment: {
        cash: normalizeCashValue(form.cash.value),
        installments: form.installments.value.trim(),
        notes: form.investmentNotes.value.trim(),
      },
      registration: {
        message: `Olá, Nicholas! Tenho interesse na oficina ${form.title.value.trim()}. Gostaria de receber mais informações.`,
      },
      faq: readFaqEditor(),
    };

    const nextWorkshop = {
      ...(existing || {}),
      slug: nextSlug,
      status: form.status.value,
      cardImage: form.cardImage.value.trim(),
      heroImage: form.heroImage.value.trim(),
      accent: existing?.accent || "#76d8e6",
      investment: copy.investment,
      languages: {
        pt: form.languagePt.value.trim() || "Português",
        es: form.languageEs.value.trim() || form.languagePt.value.trim() || "Portugués",
        en: form.languageEn.value.trim() || form.languagePt.value.trim() || "Portuguese",
      },
      gallery: splitLines(form.gallery.value),
      copy: {
        ...(existing?.copy || {}),
        pt: copy,
        es: { ...(existing?.copy?.es || copy), investment: copy.investment, videos: copy.videos },
        en: { ...(existing?.copy?.en || copy), investment: copy.investment, videos: copy.videos },
      },
    };

    workshops = workshops.filter((workshop) => workshop.slug !== currentSlug);
    workshops.push(nextWorkshop);
    selectedSlug = nextSlug;

    try {
      window.ND.saveWorkshops(workshops);
      publishAfterSaveIfPossible(
        "Oficina salva e publicada no servidor.",
        () => setWorkshopStatus("Oficina salva neste navegador. Informe o token no painel Publicacao e clique em Salvar no servidor."),
      );
    } catch {
      setWorkshopStatus(
        "Nao foi possivel salvar no navegador. Tentando publicar direto no servidor...",
      );
      if (getGitHubToken()) {
        publishToGitHub("Oficina publicada no servidor.").then((published) => {
          if (published) setWorkshopStatus("Oficina publicada no servidor.");
        });
      } else {
        setWorkshopStatus(
          "Nao foi possivel salvar no navegador. Informe o token no painel Publicacao e clique em Salvar no servidor.",
        );
        showPublicationExport(exportBox);
      }
    }

    renderList();
    fillForm();
  });

  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    siteSettings = readCurrentSiteSettings();

    try {
      window.ND.saveSiteSettings(siteSettings);
      publishAfterSaveIfPossible(
        "Configuracoes salvas e publicadas no servidor.",
        () => {
          siteSettingsStatus.textContent =
            "Configuracoes salvas neste navegador. Informe o token no painel Publicacao e clique em Salvar no servidor.";
        },
      );
    } catch {
      siteSettingsStatus.textContent =
        "Nao foi possivel salvar no navegador. Tentando publicar direto no servidor...";
      if (getGitHubToken()) {
        publishToGitHub("Configuracoes publicadas no servidor.").then((published) => {
          if (published) siteSettingsStatus.textContent = "Configuracoes publicadas no servidor.";
        });
      } else {
        siteSettingsStatus.textContent =
          "Nao foi possivel salvar no navegador. Informe o token no painel Publicacao e clique em Salvar no servidor.";
        showPublicationExport(publicationExportBox);
      }
    }

    fillSiteSettingsForm({ keepCurrent: true });
  });

  document.querySelector("#add-program").addEventListener("click", () => {
    programEditor.insertAdjacentHTML(
      "beforeend",
      `
        <article class="admin-repeater-item" data-program-item>
          <div class="admin-repeater-heading">
            <strong>Novo módulo</strong>
            <button class="admin-mini-button" type="button" data-remove-program>Remover</button>
          </div>
          <label>Título do módulo <input data-program-title placeholder="Presença e escuta"></label>
          <label>Itens do módulo <textarea data-program-items rows="4" placeholder="Um item por linha. Ex: aquecimento cênico"></textarea></label>
        </article>
      `,
    );
    renderProgramEditor(readProgramEditor().concat({ title: "", items: [] }));
  });

  document.querySelector("#add-video").addEventListener("click", () => {
    renderVideoEditor(readVideoEditor().concat(emptyVideo));
  });

  document.querySelector("#add-faq").addEventListener("click", () => {
    renderFaqEditor(readFaqEditor().concat({ question: "", answer: "" }));
  });

  document.querySelector("#add-site-faq").addEventListener("click", () => {
    renderSiteFaqEditor(readSiteFaqEditor().concat({ question: "", answer: "" }));
  });

  siteContentLanguage.addEventListener("change", () => {
    storeActiveSiteLanguageDraft();
    activeSiteLanguage = siteContentLanguage.value;
    fillSiteCopyFields();
    renderSiteFaqEditor(window.ND.getGlobalFaq(activeSiteLanguage, siteSettings));
    siteSettingsStatus.textContent = "";
  });

  document.querySelectorAll("[data-image-upload]").forEach((input) => {
    input.addEventListener("change", async () => {
      const files = Array.from(input.files || []);
      if (!files.length) return;

      const target = input.dataset.imageUpload;
      const uploadButton = input.closest(".upload-button");
      uploadButton?.classList.add("is-loading");

      try {
        const images = await Promise.all(files.map(prepareImageFile));
        const targetForm = input.closest("form") || form;
        if (target === "gallery" && targetForm === form) {
          form.gallery.value = splitLines(form.gallery.value).concat(images).join("\n");
        } else if (target === "recordsImages" && targetForm === settingsForm) {
          settingsForm.recordsImages.value = splitLines(settingsForm.recordsImages.value).concat(images).join("\n");
        } else if (targetForm.elements[target]) {
          targetForm.elements[target].value = images[0];
        }
        syncImagePreviews();
      } catch (error) {
        alert(error.message || "Não foi possível carregar a imagem.");
      } finally {
        uploadButton?.classList.remove("is-loading");
        input.value = "";
      }
    });
  });

  document.querySelectorAll("[data-clear-image]").forEach((button) => {
    button.addEventListener("click", () => {
      const field = button.dataset.clearImage;
      const targetForm = button.closest("form") || form;
      if (targetForm.elements[field]) targetForm.elements[field].value = "";
      syncImagePreviews();
    });
  });

  settingsForm.homeHeroImage.addEventListener("input", syncImagePreviews);
  settingsForm.recordsImages.addEventListener("input", syncImagePreviews);
  form.cardImage.addEventListener("input", syncImagePreviews);
  form.heroImage.addEventListener("input", syncImagePreviews);
  form.gallery.addEventListener("input", syncImagePreviews);

  galleryPreview.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-gallery]");
    if (!button) return;

    const images = splitLines(form.gallery.value);
    images.splice(Number(button.dataset.removeGallery), 1);
    form.gallery.value = images.join("\n");
    syncImagePreviews();
  });

  recordsPreview.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-record]");
    if (!button) return;

    const images = splitLines(settingsForm.recordsImages.value);
    images.splice(Number(button.dataset.removeRecord), 1);
    settingsForm.recordsImages.value = images.join("\n");
    syncImagePreviews();
  });

  document.querySelector("#new-workshop").addEventListener("click", () => {
    const slug = `nova-oficina-${workshops.length + 1}`;
    workshops.push({
      slug,
      status: "soon",
      cardImage: "assets/subpersonalidades-cartaz.png",
      heroImage: "assets/nicholas-dieter-nevoa.png",
      languages: {
        pt: "Português",
        es: "Portugués",
        en: "Portuguese",
      },
      gallery: [],
      copy: {
        pt: {
          title: "Nova oficina",
          label: "Laboratório",
          headline: "Chamada da oficina",
          summary: "Descrição curta da oficina.",
          about: [],
          program: [],
          videos: [],
          coordinator: {},
          nextClass: {},
          investment: {},
          registration: { message: "Olá, Nicholas! Tenho interesse nesta oficina." },
          faq: [],
        },
      },
    });
    selectedSlug = slug;
    renderList();
    fillForm();
    setActiveStep(0);
  });

  document.querySelector("#delete-workshop").addEventListener("click", () => {
    if (!selectedSlug || !confirm("Excluir esta oficina do navegador?")) return;
    workshops = workshops.filter((workshop) => workshop.slug !== selectedSlug);
    selectedSlug = workshops[0]?.slug || "";
    window.ND.saveWorkshops(workshops);
    renderList();
    fillForm();
    setActiveStep(0);
  });

  document.querySelector("#reset-workshops").addEventListener("click", () => {
    if (!confirm("Restaurar dados padrão e apagar alterações locais?")) return;
    workshops = window.ND.clone(window.ND.defaultWorkshops);
    selectedSlug = workshops[0]?.slug || "";
    window.ND.saveWorkshops(workshops);
    renderList();
    fillForm();
    setActiveStep(0);
  });

  document.querySelector("#reset-site-settings").addEventListener("click", () => {
    siteSettings = window.ND.clone(window.ND.defaultSiteSettings);
    window.ND.saveSiteSettings(siteSettings);
    fillSiteSettingsForm();
    siteSettingsStatus.textContent = "Configurações padrão restauradas.";
  });

  document.querySelector("#export-workshops").addEventListener("click", () => {
    showPublicationExport(exportBox);
  });

  document.querySelector("#export-publication").addEventListener("click", () => {
    showPublicationExport(publicationExportBox);
  });

  publishServerButton?.addEventListener("click", () => {
    publishToGitHub("Conteudo salvo no servidor.");
  });

  document.querySelector("#logout-admin").addEventListener("click", () => {
    setAuthenticated(false);
    showLogin();
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const valid = data.get("username") === ADMIN_USER && data.get("password") === ADMIN_PASSWORD;

    if (!valid) {
      loginError.hidden = false;
      return;
    }

    loginError.hidden = true;
    setAuthenticated(true);
    showAdmin();
  });

  if (isAuthenticated()) {
    showAdmin();
  } else {
    showLogin();
  }
})();
