(function () {
  const workshops = window.ND.loadWorkshops();
  const siteSettings = window.ND.loadSiteSettings();
  let language = window.ND.getLanguage();

  const t = (path) =>
    path.split(".").reduce((value, key) => value?.[key], window.ND.getSiteCopy(language, siteSettings)) || "";

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const applyLanguage = () => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : language;
    window.ND.setLanguage(language);

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll("[data-language-option]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.languageOption === language));
    });
  };

  const applySiteLinks = () => {
    document.querySelectorAll('[data-site-link="instagram"]').forEach((link) => {
      link.href = siteSettings.instagramUrl || window.ND.defaultSiteSettings.instagramUrl;
    });

    document.querySelectorAll('[data-site-link="vimeo"]').forEach((link) => {
      link.href = siteSettings.vimeoUrl || window.ND.defaultSiteSettings.vimeoUrl;
    });
  };

  const applyHomeHero = () => {
    const media = document.querySelector(".home-hero__media");
    if (!media) return;

    const image = siteSettings.homeHeroImage || window.ND.defaultSiteSettings.homeHeroImage;
    media.style.setProperty("--home-hero-image", `url("${window.ND.resolveAsset(image)}")`);
  };

  const renderWorkshops = () => {
    const list = document.querySelector("#workshop-list");
    if (!list) return;

    list.innerHTML = workshops
      .map((workshop) => {
        const copy = window.ND.getWorkshopCopy(workshop, language);
        const next = copy.nextClass || {};

        return `
          <article class="workshop-card">
            <a class="workshop-card__image" href="${window.ND.getWorkshopUrl(workshop.slug, language)}">
              <img src="${window.ND.resolveAsset(workshop.cardImage)}" alt="${copy.title}">
            </a>
            <div class="workshop-card__content">
              <p class="eyebrow">${copy.label}</p>
              <h3>${copy.title}</h3>
              <p>${copy.summary}</p>
              <dl>
                <div>
                  <dt>${t("home.nextClass")}</dt>
                  <dd>${next.dates || "-"}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>${next.statusText || "-"}</dd>
                </div>
              </dl>
              <a class="button button--primary" href="${window.ND.getWorkshopUrl(workshop.slug, language)}">
                ${t("home.openWorkshop")}
              </a>
            </div>
          </article>
        `;
      })
      .join("");
  };

  const renderRecords = () => {
    const strip = document.querySelector("#records-strip");
    if (!strip) return;

    const recordImages = (siteSettings.recordsImages || []).map((src) => String(src || "").trim()).filter(Boolean);
    const fallbackImages = workshops.flatMap((workshop) => workshop.gallery || []).filter(Boolean);
    const images = (recordImages.length ? recordImages : fallbackImages).slice(0, 10);
    strip.innerHTML = images
      .map((src) => `<img src="${escapeHtml(window.ND.resolveAsset(src))}" alt="" loading="lazy" decoding="async">`)
      .join("");
  };

  const renderFaq = () => {
    const list = document.querySelector("#faq-list");
    if (!list) return;

    list.innerHTML = window.ND.getGlobalFaq(language, siteSettings)
      .map(
        (item) => `
          <details class="faq-item">
            <summary>${escapeHtml(item.question)}</summary>
            <p>${escapeHtml(item.answer)}</p>
          </details>
        `,
      )
      .join("");
  };

  const render = () => {
    applyLanguage();
    applySiteLinks();
    applyHomeHero();
    renderWorkshops();
    renderRecords();
    renderFaq();
  };

  document.querySelectorAll("[data-language-option]").forEach((button) => {
    button.addEventListener("click", () => {
      language = button.dataset.languageOption;
      render();
    });
  });

  render();
})();
