(function () {
  const STORAGE_KEY = "nicholas-dieter-workshops";
  const LANGUAGE_KEY = "nicholas-dieter-language";
  const DEFAULT_LANGUAGE = "pt";
  const PHONE = "5511992978145";
  const VIMEO_URL = "https://vimeo.com/user131484859";
  const CLEAN_ROUTE_SLUGS = new Set(["subpersonalidades"]);

  const ui = {
    pt: {
      nav: { workshops: "Oficinas", faq: "FAQ", about: "Sobre" },
      home: {
        eyebrow: "Diretor • Dramaturgo • Pesquisador",
        statement: "Laboratórios de teatro, cinema, pesquisa e formação artística.",
        primaryCta: "Ver oficinas",
        secondaryCta: "Ver outras aulas",
        workshopsKicker: "Campanhas e inscrições",
        workshopsTitle: "OFICINAS",
        workshopsText:
          "Cada oficina tem uma página de campanha com programação, próximas turmas, investimento e formulário de inscrição.",
        recordsKicker: "Arquivo vivo",
        recordsTitle: "Registros de processos",
        faqTitle: "Perguntas frequentes",
        aboutKicker: "Sobre",
        aboutTitle: "Pesquisa cênica com presença, escuta e composição.",
        aboutText:
          "Nicholas Dieter conduz laboratórios de teatro, cinema e formação artística voltados à presença, imaginação dramática, pesquisa cênica e composição coletiva.",
        footer: "Laboratórios de Teatro, Cinema, Pesquisa e Formação Artística.",
        openWorkshop: "Abrir oficina",
        nextClass: "Próxima turma",
      },
      workshop: {
        navProgram: "Programa",
        navEnrollment: "Inscrição",
        about: "Sobre a oficina",
        program: "Conteúdo programático",
        coordinator: "Coordenação",
        nextClasses: "Próximas turmas",
        investment: "Investimento",
        enrollment: "Inscrição",
        languages: "Idiomas da oficina",
        languagesIntro: "A turma pode ser conduzida nos idiomas indicados abaixo, de acordo com o grupo.",
        formIntro: "Preencha os dados e envie sua inscrição pelo WhatsApp.",
        firstName: "Nome",
        lastName: "Sobrenome",
        email: "Email",
        phone: "Telefone",
        trajectory: "Fale um pouco de sua trajetória",
        submit: "Enviar inscrição",
        back: "Voltar para oficinas",
        unavailable: "Oficina não encontrada.",
      },
    },
    es: {
      nav: { workshops: "Talleres", faq: "FAQ", about: "Sobre" },
      home: {
        eyebrow: "Director • Dramaturgo • Investigador",
        statement: "Laboratorios de teatro, cine, investigación y formación artística.",
        primaryCta: "Ver talleres",
        secondaryCta: "Ver otras clases",
        workshopsKicker: "Campañas e inscripciones",
        workshopsTitle: "TALLERES",
        workshopsText:
          "Cada taller tiene una página de campaña con programa, próximas fechas, inversión y formulario de inscripción.",
        recordsKicker: "Archivo vivo",
        recordsTitle: "Registros de procesos",
        faqTitle: "Preguntas frecuentes",
        aboutKicker: "Sobre",
        aboutTitle: "Investigación escénica con presencia, escucha y composición.",
        aboutText:
          "Nicholas Dieter conduce laboratorios de teatro, cine y formación artística orientados a la presencia, la imaginación dramática, la investigación escénica y la composición colectiva.",
        footer: "Laboratorios de Teatro, Cine, Investigación y Formación Artística.",
        openWorkshop: "Abrir taller",
        nextClass: "Próxima fecha",
      },
      workshop: {
        navProgram: "Programa",
        navEnrollment: "Inscripción",
        about: "Sobre el taller",
        program: "Contenido programático",
        coordinator: "Coordinación",
        nextClasses: "Próximas fechas",
        investment: "Inversión",
        enrollment: "Inscripción",
        languages: "Idiomas del taller",
        languagesIntro: "El grupo puede ser conducido en los idiomas indicados abajo, según la composición del grupo.",
        formIntro: "Completa tus datos y envía la inscripción por WhatsApp.",
        firstName: "Nombre",
        lastName: "Apellido",
        email: "Email",
        phone: "Teléfono",
        trajectory: "Cuéntanos un poco sobre tu trayectoria",
        submit: "Enviar inscripción",
        back: "Volver a talleres",
        unavailable: "Taller no encontrado.",
      },
    },
    en: {
      nav: { workshops: "Workshops", faq: "FAQ", about: "About" },
      home: {
        eyebrow: "Director • Playwright • Researcher",
        statement: "Theater, film, research and artistic training labs.",
        primaryCta: "View workshops",
        secondaryCta: "View other classes",
        workshopsKicker: "Campaigns and enrollment",
        workshopsTitle: "WORKSHOPS",
        workshopsText:
          "Each workshop has a campaign page with program, upcoming groups, investment and an enrollment form.",
        recordsKicker: "Living archive",
        recordsTitle: "Process records",
        faqTitle: "Frequently asked questions",
        aboutKicker: "About",
        aboutTitle: "Scenic research through presence, listening and composition.",
        aboutText:
          "Nicholas Dieter leads theater, film and artistic training labs centered on presence, dramatic imagination, scenic research and collective composition.",
        footer: "Theater, Film, Research and Artistic Training Labs.",
        openWorkshop: "Open workshop",
        nextClass: "Next group",
      },
      workshop: {
        navProgram: "Program",
        navEnrollment: "Enrollment",
        about: "About the workshop",
        program: "Program content",
        coordinator: "Coordination",
        nextClasses: "Upcoming groups",
        investment: "Investment",
        enrollment: "Enrollment",
        languages: "Workshop languages",
        languagesIntro: "The group can be conducted in the languages listed below, according to the participants.",
        formIntro: "Fill in your details and send your enrollment via WhatsApp.",
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        trajectory: "Tell us a little about your trajectory",
        submit: "Send enrollment",
        back: "Back to workshops",
        unavailable: "Workshop not found.",
      },
    },
  };

  const globalFaq = {
    pt: [
      {
        question: "As oficinas são presenciais ou online?",
        answer:
          "Cada oficina informa seu formato na seção Próximas turmas. Subpersonalidades começa online ao vivo pelo Meet.",
      },
      {
        question: "Como funciona a inscrição?",
        answer:
          "A inscrição começa pelo formulário da página da oficina. Ele abre uma mensagem organizada no WhatsApp para confirmar disponibilidade e próximos passos.",
      },
      {
        question: "Posso divulgar uma oficina específica em campanha?",
        answer:
          "Sim. Cada oficina tem uma URL própria, como oficinas/subpersonalidades/.",
      },
    ],
    es: [
      {
        question: "¿Los talleres son presenciales u online?",
        answer:
          "Cada taller informa su formato en Próximas fechas. Subpersonalidades empieza online en vivo por Meet.",
      },
      {
        question: "¿Cómo funciona la inscripción?",
        answer:
          "La inscripción comienza en el formulario de la página del taller y abre un mensaje organizado en WhatsApp.",
      },
      {
        question: "¿Puedo divulgar un taller específico en campaña?",
        answer:
          "Sí. Cada taller tiene una URL propia, como oficinas/subpersonalidades/.",
      },
    ],
    en: [
      {
        question: "Are the workshops in person or online?",
        answer:
          "Each workshop states its format in Upcoming groups. Subpersonalities starts live online via Meet.",
      },
      {
        question: "How does enrollment work?",
        answer:
          "Enrollment starts with the form on the workshop page and opens a structured WhatsApp message.",
      },
      {
        question: "Can I promote a specific workshop in a campaign?",
        answer:
          "Yes. Each workshop has its own URL, such as oficinas/subpersonalidades/.",
      },
    ],
  };

  const defaultWorkshops = [
    {
      slug: "subpersonalidades",
      status: "open",
      cardImage: "assets/subpersonalidades-cartaz.png",
      heroImage: "assets/nicholas-dieter-nevoa.png",
      accent: "#76d8e6",
      languages: {
        pt: "Português e espanhol",
        es: "Portugués y español",
        en: "Portuguese and Spanish",
      },
      gallery: [
        "assets/oficina-leitura-palco.png",
        "assets/oficina-mesa-cena.png",
        "assets/oficina-dupla-mesa.png",
        "assets/oficina-sofa-movimento.png",
        "assets/oficina-mesa-publico.png",
        "assets/oficina-figura-vermelho.png",
        "assets/oficina-palco-aberto.png",
      ],
      copy: {
        pt: {
          title: "Subpersonalidades",
          label: "Laboratório Intensivo",
          headline: "Preparação emocional, imaginação dramática e dinâmicas coletivas.",
          summary:
            "Um laboratório de criação para investigar camadas internas, presença e composição coletiva em cena.",
          about: [
            "Subpersonalidades propõe uma investigação prática sobre as forças, máscaras, impulsos e vozes que compõem uma presença cênica.",
            "A oficina combina preparação emocional, imaginação dramática, exercícios de escuta e dinâmicas coletivas para desenvolver material de cena com rigor e liberdade.",
            "O trabalho é indicado para artistas, estudantes e pessoas interessadas em processos de teatro, cinema e criação performativa.",
          ],
          program: [
            {
              title: "Presença e escuta",
              items: ["aquecimento cênico", "atenção ao corpo", "disponibilidade e relação"],
            },
            {
              title: "Mapeamento das subpersonalidades",
              items: ["impulsos internos", "contradições", "figuras emocionais e composição"],
            },
            {
              title: "Imaginação dramática",
              items: ["situação", "conflito", "imagem, memória e ação"],
            },
            {
              title: "Dinâmicas coletivas",
              items: ["jogo", "contracena", "cena curta e partilha"],
            },
          ],
          coordinator: {
            name: "Nicholas Dieter",
            role: "Diretor • Dramaturgo • Pesquisador",
            bio:
              "Nicholas conduz laboratórios de teatro, cinema e formação artística voltados à presença, imaginação dramática, pesquisa cênica e composição coletiva.",
          },
          nextClass: {
            dates: "8 • 15 • 22 • 29 de agosto",
            schedule: "Sábados, 14h às 17h",
            workload: "Carga horária: 12 horas",
            location: "Ao vivo, online pelo Meet",
            statusText: "Inscrições abertas",
          },
          investment: {
            cash: "Venha conhecer",
            installments: "Valores e condições por WhatsApp",
            notes:
              "Turma reduzida a 12 participantes. A inscrição é confirmada após contato e disponibilidade de vaga.",
          },
          registration: {
            message:
              "Olá, Nicholas! Tenho interesse na oficina Subpersonalidades. Gostaria de receber mais informações sobre datas, formato e inscrição.",
          },
          faq: [
            {
              question: "Preciso ter experiência prévia?",
              answer:
                "Não necessariamente. A oficina acolhe diferentes trajetórias, desde que exista disponibilidade para jogo, escuta e prática coletiva.",
            },
            {
              question: "A turma é realmente reduzida?",
              answer:
                "Sim. O limite proposto é de 12 participantes para preservar acompanhamento e qualidade de troca.",
            },
          ],
        },
        es: {
          title: "Subpersonalidades",
          label: "Laboratorio Intensivo",
          headline: "Preparación emocional, imaginación dramática y dinámicas colectivas.",
          summary:
            "Un laboratorio de creación para investigar capas internas, presencia y composición colectiva en escena.",
          about: [
            "Subpersonalidades propone una investigación práctica sobre fuerzas, máscaras, impulsos y voces que componen una presencia escénica.",
            "El taller combina preparación emocional, imaginación dramática, ejercicios de escucha y dinámicas colectivas para desarrollar material de escena.",
            "Está dirigido a artistas, estudiantes y personas interesadas en procesos de teatro, cine y creación performativa.",
          ],
          program: [
            {
              title: "Presencia y escucha",
              items: ["calentamiento escénico", "atención al cuerpo", "disponibilidad y relación"],
            },
            {
              title: "Mapeo de subpersonalidades",
              items: ["impulsos internos", "contradicciones", "figuras emocionales y composición"],
            },
            {
              title: "Imaginación dramática",
              items: ["situación", "conflicto", "imagen, memoria y acción"],
            },
            {
              title: "Dinámicas colectivas",
              items: ["juego", "contracena", "escena breve y puesta en común"],
            },
          ],
          coordinator: {
            name: "Nicholas Dieter",
            role: "Director • Dramaturgo • Investigador",
            bio:
              "Nicholas conduce laboratorios de teatro, cine y formación artística orientados a presencia, imaginación dramática, investigación escénica y composición colectiva.",
          },
          nextClass: {
            dates: "8 • 15 • 22 • 29 de agosto",
            schedule: "Sábados, 14h a 17h",
            workload: "Carga horaria: 12 horas",
            location: "En vivo, online por Meet",
            statusText: "Inscripciones abiertas",
          },
          investment: {
            cash: "Ven a conocer",
            installments: "Valores y condiciones por WhatsApp",
            notes:
              "Grupo reducido a 12 participantes. La inscripción se confirma después del contacto y disponibilidad.",
          },
          registration: {
            message:
              "Hola, Nicholas! Me interesa el taller Subpersonalidades. Me gustaría recibir más información sobre fechas, formato e inscripción.",
          },
          faq: [
            {
              question: "¿Necesito experiencia previa?",
              answer:
                "No necesariamente. El taller recibe diferentes trayectorias, siempre que exista disponibilidad para jugar, escuchar y practicar en grupo.",
            },
            {
              question: "¿El grupo es realmente reducido?",
              answer:
                "Sí. El límite propuesto es de 12 participantes para preservar el acompañamiento y la calidad del intercambio.",
            },
          ],
        },
        en: {
          title: "Subpersonalities",
          label: "Intensive Lab",
          headline: "Emotional preparation, dramatic imagination and collective dynamics.",
          summary:
            "A creation lab for investigating inner layers, presence and collective composition on stage.",
          about: [
            "Subpersonalities proposes a practical investigation into the forces, masks, impulses and voices that shape scenic presence.",
            "The workshop combines emotional preparation, dramatic imagination, listening exercises and collective dynamics to develop scene material.",
            "It is designed for artists, students and people interested in theater, film and performative creation processes.",
          ],
          program: [
            {
              title: "Presence and listening",
              items: ["scenic warm-up", "attention to the body", "availability and relationship"],
            },
            {
              title: "Mapping subpersonalities",
              items: ["inner impulses", "contradictions", "emotional figures and composition"],
            },
            {
              title: "Dramatic imagination",
              items: ["situation", "conflict", "image, memory and action"],
            },
            {
              title: "Collective dynamics",
              items: ["play", "partner work", "short scene and sharing"],
            },
          ],
          coordinator: {
            name: "Nicholas Dieter",
            role: "Director • Playwright • Researcher",
            bio:
              "Nicholas leads theater, film and artistic training labs centered on presence, dramatic imagination, scenic research and collective composition.",
          },
          nextClass: {
            dates: "August 8 • 15 • 22 • 29",
            schedule: "Saturdays, 2pm to 5pm",
            workload: "Workload: 12 hours",
            location: "Live online via Meet",
            statusText: "Enrollment open",
          },
          investment: {
            cash: "Come learn more",
            installments: "Prices and conditions via WhatsApp",
            notes:
              "Small group limited to 12 participants. Enrollment is confirmed after contact and seat availability.",
          },
          registration: {
            message:
              "Hello, Nicholas! I am interested in the Subpersonalities workshop. I would like to receive more information about dates, format and enrollment.",
          },
          faq: [
            {
              question: "Do I need previous experience?",
              answer:
                "Not necessarily. The workshop welcomes different backgrounds, as long as there is openness to play, listen and practice collectively.",
            },
            {
              question: "Is the group really small?",
              answer:
                "Yes. The proposed limit is 12 participants to preserve guidance and quality of exchange.",
            },
          ],
        },
      },
    },
  ];

  const defaultLanguages = {
    pt: "Português",
    es: "Portugués",
    en: "Portuguese",
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const normalizeWorkshops = (workshops) =>
    (workshops || []).map((workshop) => ({
      ...workshop,
      gallery: workshop.gallery || [],
      languages: {
        ...defaultLanguages,
        ...(workshop.languages || {}),
      },
    }));

  const getLanguage = () => {
    const params = new URLSearchParams(window.location.search);
    const queryLanguage = params.get("lang");
    if (ui[queryLanguage]) return queryLanguage;

    try {
      const saved = window.localStorage.getItem(LANGUAGE_KEY);
      if (ui[saved]) return saved;
    } catch {
      // localStorage may be blocked.
    }

    const browserLanguage = navigator.language?.slice(0, 2);
    return ui[browserLanguage] ? browserLanguage : DEFAULT_LANGUAGE;
  };

  const setLanguage = (language) => {
    if (!ui[language]) return;
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // localStorage may be blocked.
    }
  };

  const loadWorkshops = () => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? normalizeWorkshops(JSON.parse(saved)) : clone(defaultWorkshops);
    } catch {
      return clone(defaultWorkshops);
    }
  };

  const saveWorkshops = (workshops) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workshops));
  };

  const getWorkshopCopy = (workshop, language) =>
    workshop.copy?.[language] || workshop.copy?.pt || Object.values(workshop.copy || {})[0] || {};

  const getWorkshopLanguages = (workshop, language) =>
    workshop.languages?.[language] || workshop.languages?.pt || defaultLanguages[language] || defaultLanguages.pt;

  const getRootPath = () => (window.location.pathname.includes("/oficinas/") ? "../../" : "");

  const resolveAsset = (path = "") => {
    if (!path || /^(https?:|data:|\/)/.test(path)) return path;
    return `${getRootPath()}${path}`;
  };

  const getWorkshopUrl = (slug, language, options = {}) => {
    const clean = options.clean !== false && CLEAN_ROUTE_SLUGS.has(slug);
    const encodedSlug = encodeURIComponent(slug);

    if (clean) {
      const query = language && language !== DEFAULT_LANGUAGE ? `?lang=${language}` : "";
      return `${getRootPath()}oficinas/${encodedSlug}/${query}`;
    }

    const params = new URLSearchParams({ slug });
    if (language && language !== DEFAULT_LANGUAGE) params.set("lang", language);
    return `${getRootPath()}oficina.html?${params.toString()}`;
  };

  const createWhatsAppUrl = (message, extra = "") =>
    `https://wa.me/${PHONE}?text=${encodeURIComponent(`${message}${extra}`)}`;

  const enableImageLightbox = () => {
    if (document.documentElement.dataset.lightboxReady === "true") return;
    document.documentElement.dataset.lightboxReady = "true";

    const close = () => {
      document.querySelector(".image-lightbox")?.remove();
      document.body.classList.remove("has-lightbox");
    };

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    document.addEventListener("click", (event) => {
      const closeButton = event.target.closest("[data-lightbox-close]");
      if (closeButton) {
        close();
        return;
      }

      const image = event.target.closest("img");
      if (
        !image ||
        image.closest(".image-lightbox") ||
        image.closest(".brand") ||
        image.closest(".workshop-card__image")
      ) {
        return;
      }

      const src = image.currentSrc || image.src;
      if (!src) return;
      event.preventDefault();

      const overlay = document.createElement("div");
      overlay.className = "image-lightbox";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.innerHTML = `
        <button class="image-lightbox__close" type="button" data-lightbox-close aria-label="Fechar imagem">Fechar</button>
        <button class="image-lightbox__backdrop" type="button" data-lightbox-close aria-label="Fechar imagem"></button>
        <figure class="image-lightbox__frame">
          <img src="${src}" alt="${image.alt || ""}">
        </figure>
      `;

      document.body.append(overlay);
      document.body.classList.add("has-lightbox");
      overlay.querySelector("[data-lightbox-close]")?.focus();
    });
  };

  window.ND = {
    PHONE,
    VIMEO_URL,
    defaultWorkshops,
    globalFaq,
    ui,
    clone,
    normalizeWorkshops,
    getRootPath,
    getLanguage,
    setLanguage,
    loadWorkshops,
    saveWorkshops,
    getWorkshopCopy,
    getWorkshopLanguages,
    getWorkshopUrl,
    resolveAsset,
    createWhatsAppUrl,
    enableImageLightbox,
  };

  document.addEventListener("DOMContentLoaded", enableImageLightbox);
})();
