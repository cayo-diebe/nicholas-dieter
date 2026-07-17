(function () {
  let workshops = window.ND.loadWorkshops();
  let selectedSlug = workshops[0]?.slug || "";

  const form = document.querySelector("#admin-form");
  const list = document.querySelector("#admin-list");
  const exportBox = document.querySelector("#export-box");
  const campaignUrl = document.querySelector("#campaign-url");

  const getSelected = () => workshops.find((workshop) => workshop.slug === selectedSlug);
  const getCopy = (workshop) => window.ND.getWorkshopCopy(workshop, "pt");

  const slugify = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const renderList = () => {
    list.innerHTML = workshops
      .map((workshop) => {
        const copy = getCopy(workshop);
        return `
          <button type="button" class="${workshop.slug === selectedSlug ? "is-active" : ""}" data-admin-slug="${workshop.slug}">
            <strong>${copy.title || workshop.slug}</strong>
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

  const fillForm = () => {
    const workshop = getSelected();
    if (!workshop) return;

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
    form.cardImage.value = workshop.cardImage || "";
    form.heroImage.value = workshop.heroImage || "";
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
    form.program.value = JSON.stringify(copy.program || [], null, 2);
    form.faq.value = JSON.stringify(copy.faq || [], null, 2);
    const cleanUrl = window.ND.getWorkshopUrl(workshop.slug);
    const dynamicUrl = window.ND.getWorkshopUrl(workshop.slug, undefined, { clean: false });
    campaignUrl.innerHTML = `
      URL de campanha: <a href="${cleanUrl}">${cleanUrl}</a><br>
      URL dinâmica: <a href="${dynamicUrl}">${dynamicUrl}</a>
    `;
  };

  const parseJsonField = (field, fallback) => {
    try {
      return JSON.parse(field.value || "[]");
    } catch {
      alert(`JSON inválido em ${field.name}.`);
      return fallback;
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentSlug = selectedSlug;
    const nextSlug = slugify(form.slug.value || form.title.value);
    const existing = workshops.find((workshop) => workshop.slug === currentSlug);
    const program = parseJsonField(form.program, []);
    const faq = parseJsonField(form.faq, []);

    const copy = {
      title: form.title.value,
      label: form.label.value,
      headline: form.headline.value,
      summary: form.summary.value,
      about: form.about.value.split("\n").filter(Boolean),
      program,
      coordinator: {
        name: form.coordinatorName.value,
        role: form.coordinatorRole.value,
        bio: form.coordinatorBio.value,
      },
      nextClass: {
        dates: form.dates.value,
        schedule: form.schedule.value,
        workload: form.workload.value,
        location: form.location.value,
        statusText: form.status.options[form.status.selectedIndex].text,
      },
      investment: {
        cash: form.cash.value,
        installments: form.installments.value,
        notes: form.investmentNotes.value,
      },
      registration: {
        message: `Olá, Nicholas! Tenho interesse na oficina ${form.title.value}. Gostaria de receber mais informações.`,
      },
      faq,
    };

    const nextWorkshop = {
      ...(existing || {}),
      slug: nextSlug,
      status: form.status.value,
      cardImage: form.cardImage.value,
      heroImage: form.heroImage.value,
      accent: existing?.accent || "#76d8e6",
      gallery: existing?.gallery || [],
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

  document.querySelector("#new-workshop").addEventListener("click", () => {
    const slug = `nova-oficina-${workshops.length + 1}`;
    workshops.push({
      slug,
      status: "soon",
      cardImage: "assets/subpersonalidades-cartaz.png",
      heroImage: "assets/nicholas-dieter-nevoa.png",
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
    if (!confirm("Excluir esta oficina do navegador?")) return;
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

  renderList();
  fillForm();
})();
