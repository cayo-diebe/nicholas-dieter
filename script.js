(function () {
  const workshops = window.ND.loadWorkshops();
  let language = window.ND.getLanguage();

  const t = (path) =>
    path.split(".").reduce((value, key) => value?.[key], window.ND.ui[language]) || "";

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

    const images = workshops.flatMap((workshop) => workshop.gallery || []).slice(0, 8);
    strip.innerHTML = images
      .map((src) => `<img src="${window.ND.resolveAsset(src)}" alt="">`)
      .join("");
  };

  const renderFaq = () => {
    const list = document.querySelector("#faq-list");
    if (!list) return;

    list.innerHTML = (window.ND.globalFaq[language] || window.ND.globalFaq.pt)
      .map(
        (item) => `
          <details class="faq-item">
            <summary>${item.question}</summary>
            <p>${item.answer}</p>
          </details>
        `,
      )
      .join("");
  };

  const render = () => {
    applyLanguage();
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
