(function () {
  const AUTH_KEY = "nicholas-dieter-admin-auth";
  const ADMIN_USER = "admin";
  const ADMIN_PASSWORD = "123";

  let workshops = window.ND.loadWorkshops();
  let selectedSlug = workshops[0]?.slug || "";

  const loginSection = document.querySelector("#admin-login");
  const adminApp = document.querySelector("#admin-app");
  const loginForm = document.querySelector("#login-form");
  const loginError = document.querySelector("#login-error");
  const form = document.querySelector("#admin-form");
  const list = document.querySelector("#admin-list");
  const exportBox = document.querySelector("#export-box");
  const campaignUrl = document.querySelector("#campaign-url");
  const programEditor = document.querySelector("#program-editor");
  const faqEditor = document.querySelector("#faq-editor");

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

  const showAdmin = () => {
    loginSection.hidden = true;
    adminApp.hidden = false;
    renderList();
    fillForm();
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
              <input data-program-title value="${escapeHtml(module.title || "")}">
            </label>
            <label>
              Itens do módulo
              <textarea data-program-items rows="4" placeholder="Um item por linha">${escapeHtml((module.items || []).join("\n"))}</textarea>
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
              <input data-faq-question value="${escapeHtml(item.question || "")}">
            </label>
            <label>
              Resposta
              <textarea data-faq-answer rows="3">${escapeHtml(item.answer || "")}</textarea>
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
      renderFaqEditor([{ question: "", answer: "" }]);
      campaignUrl.textContent = "Nenhuma oficina cadastrada.";
      return;
    }

    const copy = getCopy(workshop);
    const next = copy.nextClass || {};
    const investment = copy.investment || {};
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
    form.cash.value = investment.cash || "";
    form.installments.value = investment.installments || "";
    form.investmentNotes.value = investment.notes || "";
    form.coordinatorName.value = coordinator.name || "";
    form.coordinatorRole.value = coordinator.role || "";
    form.coordinatorBio.value = coordinator.bio || "";
    renderProgramEditor(copy.program?.length ? copy.program : [{ title: "", items: [] }]);
    renderFaqEditor(copy.faq?.length ? copy.faq : [{ question: "", answer: "" }]);

    const cleanUrl = window.ND.getWorkshopUrl(workshop.slug);
    const dynamicUrl = window.ND.getWorkshopUrl(workshop.slug, undefined, { clean: false });
    campaignUrl.innerHTML = `
      URL de campanha: <a href="${cleanUrl}">${cleanUrl}</a><br>
      URL dinâmica: <a href="${dynamicUrl}">${dynamicUrl}</a>
    `;
  };

  const getStatusText = () => form.status.options[form.status.selectedIndex].text;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
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
        cash: form.cash.value.trim(),
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
      languages: {
        pt: form.languagePt.value.trim() || "Português",
        es: form.languageEs.value.trim() || form.languagePt.value.trim() || "Portugués",
        en: form.languageEn.value.trim() || form.languagePt.value.trim() || "Portuguese",
      },
      gallery: splitLines(form.gallery.value),
      copy: {
        ...(existing?.copy || {}),
        pt: copy,
        es: existing?.copy?.es || copy,
        en: existing?.copy?.en || copy,
      },
    };

    workshops = workshops.filter((workshop) => workshop.slug !== currentSlug);
    workshops.push(nextWorkshop);
    selectedSlug = nextSlug;
    window.ND.saveWorkshops(workshops);
    renderList();
    fillForm();
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
          <label>Título do módulo <input data-program-title></label>
          <label>Itens do módulo <textarea data-program-items rows="4" placeholder="Um item por linha"></textarea></label>
        </article>
      `,
    );
    renderProgramEditor(readProgramEditor().concat({ title: "", items: [] }));
  });

  document.querySelector("#add-faq").addEventListener("click", () => {
    renderFaqEditor(readFaqEditor().concat({ question: "", answer: "" }));
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
  });

  document.querySelector("#delete-workshop").addEventListener("click", () => {
    if (!selectedSlug || !confirm("Excluir esta oficina do navegador?")) return;
    workshops = workshops.filter((workshop) => workshop.slug !== selectedSlug);
    selectedSlug = workshops[0]?.slug || "";
    window.ND.saveWorkshops(workshops);
    renderList();
    fillForm();
  });

  document.querySelector("#reset-workshops").addEventListener("click", () => {
    if (!confirm("Restaurar dados padrão e apagar alterações locais?")) return;
    workshops = window.ND.clone(window.ND.defaultWorkshops);
    selectedSlug = workshops[0]?.slug || "";
    window.ND.saveWorkshops(workshops);
    renderList();
    fillForm();
  });

  document.querySelector("#export-workshops").addEventListener("click", () => {
    exportBox.value = JSON.stringify(workshops, null, 2);
    exportBox.classList.add("is-visible");
    exportBox.select();
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
