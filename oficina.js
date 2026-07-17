(function () {
  const workshops = window.ND.loadWorkshops();
  let language = window.ND.getLanguage();
  const params = new URLSearchParams(window.location.search);
  const slugFromQuery = params.get("slug");
  const slugFromPath = window.location.pathname.match(/\/oficinas\/([^/]+)/)?.[1];
  const slug = slugFromQuery || slugFromPath || workshops[0]?.slug;
  const workshop = workshops.find((item) => item.slug === slug);
  const homeUrl = `${window.ND.getRootPath()}index.html`;

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
            <summary>${item.question}</summary>
            <p>${item.answer}</p>
          </details>
        `,
      )
      .join("");

  const renderGallery = (gallery = []) =>
    gallery.map((src) => `<img src="${window.ND.resolveAsset(src)}" alt="">`).join("");

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
    const investment = copy.investment || {};
    const coordinator = copy.coordinator || {};
    const registration = copy.registration || {};
    const faq = [...(copy.faq || []), ...(window.ND.globalFaq[language] || [])];

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
            <label>${t("workshop.firstName")} *<input name="firstName" required></label>
            <label>${t("workshop.lastName")} *<input name="lastName" required></label>
            <label>${t("workshop.email")} *<input type="email" name="email" required></label>
            <label>${t("workshop.phone")} *<input name="phone" required></label>
            <label>${t("workshop.trajectory")}<textarea name="trajectory" rows="4"></textarea></label>
            <button class="button button--primary" type="submit">${t("workshop.submit")}</button>
          </form>
        </article>
      </section>

      <section class="section section--faq" id="faq">
        <div class="section__intro">
          <p class="eyebrow">FAQ</p>
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
