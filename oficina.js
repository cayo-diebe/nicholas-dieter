(function () {
  const workshops = window.ND.loadWorkshops();
  const siteSettings = window.ND.loadSiteSettings();
  let language = window.ND.getLanguage();
  const params = new URLSearchParams(window.location.search);
  const slugFromQuery = params.get("slug");
  const slugFromPath = window.location.pathname.match(/\/oficinas\/([^/]+)/)?.[1];
  const slug = slugFromQuery || slugFromPath || workshops[0]?.slug;
  const workshop = workshops.find((item) => item.slug === slug);
  const homeUrl = `${window.ND.getRootPath()}index.html`;

  const t = (path) =>
    path.split(".").reduce((value, key) => value?.[key], window.ND.getSiteCopy(language, siteSettings)) || "";

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const getVideoEmbedUrl = (url = "") => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "");

      if (host.includes("vimeo.com")) {
        const id = parsed.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part));
        return id ? `https://player.vimeo.com/video/${id}` : "";
      }

      if (host === "youtu.be") {
        const id = parsed.pathname.split("/").filter(Boolean)[0];
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      if (host.includes("youtube.com")) {
        const id = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }
    } catch {
      return "";
    }

    return "";
  };

  const getSafeVideoUrl = (url = "") => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
    } catch {
      return "";
    }
  };

  const getVideoTypeLabel = (type) =>
    ({
      testimonial: t("workshop.videoTestimonial"),
      process: t("workshop.videoProcess"),
      scene: t("workshop.videoScene"),
    })[type] || t("workshop.videoScene");

  const applyLanguage = () => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : language;
    window.ND.setLanguage(language);

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll("[data-language-option]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.languageOption === language));
    });

    document.querySelectorAll('[data-site-link="instagram"]').forEach((link) => {
      link.href = siteSettings.instagramUrl || window.ND.defaultSiteSettings.instagramUrl;
    });
  };

  const renderProgram = (program = []) =>
    program
      .map(
        (module, index) => `
          <article class="program-item">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <h3>${module.title}</h3>
            <ul>
              ${(module.items || []).map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </article>
        `,
      )
      .join("");

  const renderFaq = (items = []) =>
    items
      .map(
        (item) => `
          <details class="faq-item">
            <summary>${escapeHtml(item.question)}</summary>
            <p>${escapeHtml(item.answer)}</p>
          </details>
        `,
      )
      .join("");

  const renderGallery = (gallery = []) =>
    gallery.map((src) => `<img src="${escapeHtml(window.ND.resolveAsset(src))}" alt="">`).join("");

  const renderVideos = (videos = []) => {
    const items = videos
      .filter((video) => video.url)
      .map((video) => {
        const embedUrl = getVideoEmbedUrl(video.url);
        const safeUrl = getSafeVideoUrl(video.url);
        const title = escapeHtml(video.title || t("workshop.videoFallbackTitle"));
        const description = escapeHtml(video.description || "");
        const type = escapeHtml(getVideoTypeLabel(video.type));

        if (!embedUrl && !safeUrl) return "";

        return `
          <article class="video-card">
            ${
              embedUrl
                ? `<iframe src="${embedUrl}" title="${title}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
                : `<a class="video-card__fallback" href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener">${t("workshop.watchVideo")}</a>`
            }
            <div>
              <p class="eyebrow">${type}</p>
              <h3>${title}</h3>
              ${description ? `<p>${description}</p>` : ""}
            </div>
          </article>
        `;
      })
      .join("");

    if (!items) return "";

    return `
      <section class="section section--videos" id="videos">
        <div class="section__intro">
          <p class="eyebrow">${t("workshop.videos")}</p>
          <h2>${t("workshop.videoTitle")}</h2>
          <p>${t("workshop.videoIntro")}</p>
        </div>
        <div class="video-grid">${items}</div>
      </section>
    `;
  };

  const render = () => {
    applyLanguage();
    const root = document.querySelector("#workshop-root");
    if (!root) return;

    if (!workshop) {
      root.innerHTML = `
        <section class="section">
          <h1>${t("workshop.unavailable")}</h1>
          <a class="button button--primary" href="${homeUrl}#oficinas">${t("workshop.back")}</a>
        </section>
      `;
      return;
    }

    const copy = window.ND.getWorkshopCopy(workshop, language);
    const next = copy.nextClass || {};
    const investment = workshop.investment || copy.investment || {};
    const coordinator = copy.coordinator || {};
    const registration = copy.registration || {};
    const faq = [...(copy.faq || []), ...window.ND.getGlobalFaq(language, siteSettings)];
    const videos = copy.videos || workshop.videos || [];
    const workshopLanguages = window.ND.getWorkshopLanguages(workshop, language);

    document.title = `${copy.title} | Nicholas Dieter`;
    document.querySelector("meta[name='description']").content = copy.summary || copy.headline;

    root.innerHTML = `
      <section class="course-hero">
        <div class="course-hero__image">
          <img src="${window.ND.resolveAsset(workshop.heroImage)}" alt="${copy.title}">
        </div>
        <div class="course-hero__copy">
          <a class="back-link" href="${homeUrl}#oficinas">← ${t("workshop.back")}</a>
          <p class="eyebrow">${copy.label}</p>
          <h1>${copy.title}</h1>
          <p>${copy.headline}</p>
          <div class="action-row">
            <a class="button button--primary" href="#turmas">${t("workshop.navEnrollment")}</a>
            <a class="button button--ghost" href="#programa">${t("workshop.navProgram")}</a>
          </div>
        </div>
      </section>

      <section class="course-about section">
        <div>
          <p class="eyebrow">${t("workshop.about")}</p>
          <h2>${copy.summary}</h2>
        </div>
        <div class="rich-copy">
          ${(copy.about || []).map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
      </section>

      <section class="section language-section">
        <div>
          <p class="eyebrow">${t("workshop.languages")}</p>
          <h2>${workshopLanguages}</h2>
        </div>
        <p>${t("workshop.languagesIntro")}</p>
      </section>

      <section class="section section--program" id="programa">
        <div class="section__intro">
          <p class="eyebrow">${t("workshop.program")}</p>
          <h2>${copy.title}</h2>
        </div>
        <div class="program-grid">${renderProgram(copy.program)}</div>
      </section>

      <section class="section course-gallery">
        ${renderGallery(workshop.gallery || [])}
      </section>

      ${renderVideos(videos)}

      <section class="section coordinator-section">
        <div>
          <p class="eyebrow">${t("workshop.coordinator")}</p>
          <h2>${coordinator.name || "Nicholas Dieter"}</h2>
          <p>${coordinator.role || ""}</p>
        </div>
        <p>${coordinator.bio || ""}</p>
      </section>

      <section class="course-commerce" id="turmas">
        <article class="commerce-panel commerce-panel--dark">
          <h2>${t("workshop.nextClasses")}</h2>
          <span class="divider"></span>
          <strong>${next.dates || "-"}</strong>
          <p>${next.schedule || ""}</p>
          <p>${next.workload || ""}</p>
          <p class="accent-text">${next.statusText || ""}</p>
          <p>${next.location || ""}</p>
        </article>

        <article class="commerce-panel commerce-panel--mid">
          <h2>${t("workshop.investment")}</h2>
          <span class="divider"></span>
          <strong>${investment.cash || "-"}</strong>
          <p>${investment.installments || ""}</p>
          <small>${investment.notes || ""}</small>
        </article>

        <article class="commerce-panel commerce-panel--form">
          <h2>${t("workshop.enrollment")}</h2>
          <span class="divider"></span>
          <p>${t("workshop.formIntro")}</p>
          <form class="signup-form" id="signup-form">
            <label>${t("workshop.firstName")} *<input name="firstName" required placeholder="${t("workshop.firstNamePlaceholder")}"></label>
            <label>${t("workshop.lastName")} *<input name="lastName" required placeholder="${t("workshop.lastNamePlaceholder")}"></label>
            <label>${t("workshop.email")} *<input type="email" name="email" required placeholder="${t("workshop.emailPlaceholder")}"></label>
            <label>${t("workshop.phone")} *<input name="phone" required placeholder="${t("workshop.phonePlaceholder")}"></label>
            <label>${t("workshop.trajectory")}<textarea name="trajectory" rows="4" placeholder="${t("workshop.trajectoryPlaceholder")}"></textarea></label>
            <button class="button button--primary" type="submit">${t("workshop.submit")}</button>
          </form>
        </article>
      </section>

      <section class="section section--faq" id="faq">
        <div class="section__intro">
          <p class="eyebrow">${t("home.faqKicker")}</p>
          <h2>${t("home.faqTitle")}</h2>
        </div>
        <div class="faq-list">${renderFaq(faq)}</div>
      </section>
    `;

    document.querySelector("#signup-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const extra = `

Nome: ${data.get("firstName")} ${data.get("lastName")}
Email: ${data.get("email")}
Telefone: ${data.get("phone")}
Trajetória: ${data.get("trajectory") || "-"}`;
      window.open(window.ND.createWhatsAppUrl(registration.message || "", extra), "_blank", "noopener");
    });
  };

  document.querySelectorAll("[data-language-option]").forEach((button) => {
    button.addEventListener("click", () => {
      language = button.dataset.languageOption;
      render();
    });
  });

  render();
})();
