(function () {
  const STORAGE_KEY = "nicholas-dieter-workshops";
  const SETTINGS_KEY = "nicholas-dieter-site-settings";
  const LANGUAGE_KEY = "nicholas-dieter-language";
  const DEFAULT_LANGUAGE = "pt";
  const PHONE = "5511992978145";
  const VIMEO_URL = "https://vimeo.com/user131484859";
  const CLEAN_ROUTE_SLUGS = new Set(["subpersonalidades"]);

  const ui = {
    pt: {
      nav: { workshops: "Oficinas", faq: "FAQ", about: "Sobre" },
      home: {
        title: "Nicholas Dieter",
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
        faqKicker: "FAQ",
        faqTitle: "Perguntas frequentes",
        aboutKicker: "Sobre",
        aboutTitle: "Pesquisa cênica com presença, escuta e composição.",
        aboutText:
          "Nicholas Dieter conduz laboratórios de teatro, cinema e formação artística voltados à presença, imaginação dramática, pesquisa cênica e composição coletiva.",
        aboutInstagramLabel: "Nicholas Dieter",
        footer: "Laboratórios de Teatro, Cinema, Pesquisa e Formação Artística.",
        openWorkshop: "Abrir oficina",
        nextClass: "Próxima turma",
      },
      whatsapp: { eyebrow: "Falar no", label: "WhatsApp" },
      workshop: {
        navProgram: "Programa",
        navEnrollment: "Inscrição",
        about: "Sobre a oficina",
        program: "Conteúdo programático",
        coordinator: "Coordenação",
        nextClasses: "Próximas turmas",
        investment: "Investimento",
        paymentAction: "Pagar pelo Mercado Pago",
        paymentHint: "Pagamento online opcional",
        enrollment: "Inscrição",
        languages: "Idiomas da oficina",
        languagesIntro: "A turma pode ser conduzida nos idiomas indicados abaixo, de acordo com o grupo.",
        formIntro: "Preencha os dados e envie sua inscrição por e-mail.",
        firstName: "Nome",
        lastName: "Sobrenome",
        email: "Email",
        phone: "Telefone",
        trajectory: "Fale um pouco de sua trajetória",
        firstNamePlaceholder: "Seu nome",
        lastNamePlaceholder: "Seu sobrenome",
        emailPlaceholder: "seuemail@exemplo.com",
        phonePlaceholder: "(11) 99999-9999",
        trajectoryPlaceholder: "Conte brevemente sua relação com teatro, cinema, atuação ou pesquisa artística.",
        videos: "Vídeos",
        videoTitle: "Fragmentos e depoimentos",
        videoIntro:
          "Registros em vídeo de cenas, processos e recomendações relacionados à oficina.",
        videoScene: "Fragmento de cena",
        videoTestimonial: "Depoimento / recomendação",
        videoProcess: "Bastidor de processo",
        videoFallbackTitle: "Vídeo da oficina",
        watchVideo: "Assistir vídeo",
        submit: "Enviar inscrição",
        back: "Voltar para oficinas",
        unavailable: "Oficina não encontrada.",
      },
    },
    es: {
      nav: { workshops: "Talleres", faq: "FAQ", about: "Sobre" },
      home: {
        title: "Nicholas Dieter",
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
        faqKicker: "FAQ",
        faqTitle: "Preguntas frecuentes",
        aboutKicker: "Sobre",
        aboutTitle: "Investigación escénica con presencia, escucha y composición.",
        aboutText:
          "Nicholas Dieter conduce laboratorios de teatro, cine y formación artística orientados a la presencia, la imaginación dramática, la investigación escénica y la composición colectiva.",
        aboutInstagramLabel: "Nicholas Dieter",
        footer: "Laboratorios de Teatro, Cine, Investigación y Formación Artística.",
        openWorkshop: "Abrir taller",
        nextClass: "Próxima fecha",
      },
      whatsapp: { eyebrow: "Hablar por", label: "WhatsApp" },
      workshop: {
        navProgram: "Programa",
        navEnrollment: "Inscripción",
        about: "Sobre el taller",
        program: "Contenido programático",
        coordinator: "Coordinación",
        nextClasses: "Próximas fechas",
        investment: "Inversión",
        paymentAction: "Pagar por Mercado Pago",
        paymentHint: "Pago online opcional",
        enrollment: "Inscripción",
        languages: "Idiomas del taller",
        languagesIntro: "El grupo puede ser conducido en los idiomas indicados abajo, según la composición del grupo.",
        formIntro: "Completa tus datos y envía la inscripción por e-mail.",
        firstName: "Nombre",
        lastName: "Apellido",
        email: "Email",
        phone: "Teléfono",
        trajectory: "Cuéntanos un poco sobre tu trayectoria",
        firstNamePlaceholder: "Tu nombre",
        lastNamePlaceholder: "Tu apellido",
        emailPlaceholder: "tuemail@ejemplo.com",
        phonePlaceholder: "+55 11 99999-9999",
        trajectoryPlaceholder: "Cuenta brevemente tu relación con teatro, cine, actuación o investigación artística.",
        videos: "Videos",
        videoTitle: "Fragmentos y testimonios",
        videoIntro:
          "Registros en video de escenas, procesos y recomendaciones relacionados con el taller.",
        videoScene: "Fragmento de escena",
        videoTestimonial: "Testimonio / recomendación",
        videoProcess: "Bastidor de proceso",
        videoFallbackTitle: "Video del taller",
        watchVideo: "Ver video",
        submit: "Enviar inscripción",
        back: "Volver a talleres",
        unavailable: "Taller no encontrado.",
      },
    },
    en: {
      nav: { workshops: "Workshops", faq: "FAQ", about: "About" },
      home: {
        title: "Nicholas Dieter",
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
        faqKicker: "FAQ",
        faqTitle: "Frequently asked questions",
        aboutKicker: "About",
        aboutTitle: "Scenic research through presence, listening and composition.",
        aboutText:
          "Nicholas Dieter leads theater, film and artistic training labs centered on presence, dramatic imagination, scenic research and collective composition.",
        aboutInstagramLabel: "Nicholas Dieter",
        footer: "Theater, Film, Research and Artistic Training Labs.",
        openWorkshop: "Open workshop",
        nextClass: "Next group",
      },
      whatsapp: { eyebrow: "Talk on", label: "WhatsApp" },
      workshop: {
        navProgram: "Program",
        navEnrollment: "Enrollment",
        about: "About the workshop",
        program: "Program content",
        coordinator: "Coordination",
        nextClasses: "Upcoming groups",
        investment: "Investment",
        paymentAction: "Pay with Mercado Pago",
        paymentHint: "Optional online payment",
        enrollment: "Enrollment",
        languages: "Workshop languages",
        languagesIntro: "The group can be conducted in the languages listed below, according to the participants.",
        formIntro: "Fill in your details and send your enrollment by email.",
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        trajectory: "Tell us a little about your trajectory",
        firstNamePlaceholder: "Your first name",
        lastNamePlaceholder: "Your last name",
        emailPlaceholder: "you@example.com",
        phonePlaceholder: "+55 11 99999-9999",
        trajectoryPlaceholder: "Briefly describe your relationship with theater, film, acting or artistic research.",
        videos: "Videos",
        videoTitle: "Fragments and testimonials",
        videoIntro:
          "Video records of scenes, processes and recommendations related to the workshop.",
        videoScene: "Scene fragment",
        videoTestimonial: "Testimonial / recommendation",
        videoProcess: "Process behind the scenes",
        videoFallbackTitle: "Workshop video",
        watchVideo: "Watch video",
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
          "A inscrição começa pelo formulário da página da oficina. Os dados chegam por e-mail para confirmação de disponibilidade e próximos passos.",
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
          "La inscripción comienza en el formulario de la página del taller. Los datos llegan por e-mail para confirmar disponibilidad y próximos pasos.",
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
          "Enrollment starts with the form on the workshop page. The details arrive by email for availability and next steps.",
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
      coordinatorPhoto: "assets/nicholas-dieter-nevoa.png",
      paymentLink: "",
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

  const mergeDeep = (base, override) => {
    if (Array.isArray(base) || Array.isArray(override)) {
      return Array.isArray(override) ? clone(override) : clone(base || []);
    }

    if (!base || typeof base !== "object" || !override || typeof override !== "object") {
      return override === undefined ? base : override;
    }

    const result = { ...base };
    Object.keys(override).forEach((key) => {
      result[key] = mergeDeep(base[key], override[key]);
    });
    return result;
  };

  const defaultSiteSettings = {
    homeHeroImage: "assets/nicholas-dieter-nevoa.png",
    instagramUrl: "https://www.instagram.com/nicholas.dieter/",
    vimeoUrl: VIMEO_URL,
    whatsappPhone: PHONE,
    whatsappMessage: "Olá, Nicholas! Vim pelo site e gostaria de falar no WhatsApp.",
    recordsImages: [],
    copy: ui,
    globalFaq,
  };

  const publishedData =
    window.ND_PUBLISHED_DATA && typeof window.ND_PUBLISHED_DATA === "object" ? window.ND_PUBLISHED_DATA : {};

  const normalizeWorkshops = (workshops) =>
    (workshops || []).map((workshop) => ({
      ...workshop,
      coordinatorPhoto: workshop.coordinatorPhoto || workshop.copy?.pt?.coordinator?.photo || "",
      paymentLink: workshop.paymentLink || workshop.investment?.paymentLink || workshop.investment?.paymentUrl || "",
      gallery: workshop.gallery || [],
      languages: {
        ...defaultLanguages,
        ...(workshop.languages || {}),
      },
    }));

  const normalizeSiteSettings = (settings = {}) => {
    const normalized = mergeDeep(defaultSiteSettings, settings || {});
    normalized.recordsImages = Array.isArray(normalized.recordsImages) ? normalized.recordsImages : [];
    normalized.copy = normalized.copy && typeof normalized.copy === "object" ? normalized.copy : clone(ui);
    normalized.globalFaq =
      normalized.globalFaq && typeof normalized.globalFaq === "object" ? normalized.globalFaq : clone(globalFaq);

    Object.keys(ui).forEach((language) => {
      normalized.copy[language] = mergeDeep(ui[language], normalized.copy?.[language] || {});
      normalized.globalFaq[language] = Array.isArray(normalized.globalFaq?.[language])
        ? normalized.globalFaq[language]
        : clone(globalFaq[language] || []);
    });

    return normalized;
  };

  const getPublishedWorkshops = () =>
    Array.isArray(publishedData.workshops) && publishedData.workshops.length
      ? normalizeWorkshops(publishedData.workshops)
      : normalizeWorkshops(defaultWorkshops);

  const getPublishedSiteSettings = () =>
    publishedData.siteSettings && typeof publishedData.siteSettings === "object"
      ? normalizeSiteSettings(publishedData.siteSettings)
      : normalizeSiteSettings(defaultSiteSettings);

  const isAdminPage = () => document.body?.dataset.page === "admin";

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
    if (!isAdminPage()) return clone(getPublishedWorkshops());

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? normalizeWorkshops(JSON.parse(saved)) : clone(getPublishedWorkshops());
    } catch {
      return clone(getPublishedWorkshops());
    }
  };

  const saveWorkshops = (workshops) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workshops));
  };

  const loadSiteSettings = () => {
    if (!isAdminPage()) return clone(getPublishedSiteSettings());

    try {
      const saved = window.localStorage.getItem(SETTINGS_KEY);
      return saved ? normalizeSiteSettings(JSON.parse(saved)) : clone(getPublishedSiteSettings());
    } catch {
      return clone(getPublishedSiteSettings());
    }
  };

  const saveSiteSettings = (settings) => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(normalizeSiteSettings(settings)));
  };

  const getWorkshopCopy = (workshop, language) =>
    workshop.copy?.[language] || workshop.copy?.pt || Object.values(workshop.copy || {})[0] || {};

  const getWorkshopLanguages = (workshop, language) =>
    workshop.languages?.[language] || workshop.languages?.pt || defaultLanguages[language] || defaultLanguages.pt;

  const getSiteCopy = (language, settings) => {
    const normalized = settings ? normalizeSiteSettings(settings) : loadSiteSettings();
    return normalized.copy?.[language] || normalized.copy?.pt || ui[language] || ui.pt;
  };

  const getGlobalFaq = (language, settings) => {
    const normalized = settings ? normalizeSiteSettings(settings) : loadSiteSettings();
    return normalized.globalFaq?.[language] || normalized.globalFaq?.pt || globalFaq[language] || globalFaq.pt;
  };

  const getRootPath = () => (window.location.pathname.includes("/oficinas/") ? "../../" : "");

  const resolveAsset = (path = "") => {
    const value = String(path || "").trim().replace(/\\/g, "/");
    if (!value || /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith("/") || value.startsWith("#")) {
      return value;
    }

    const normalized = value.replace(/^\.?\//, "").replace(/^(\.\.\/)+/, "");
    if (window.location.protocol === "file:") return `${getRootPath()}${normalized}`;
    return `/${normalized}`;
  };

  const getWorkshopUrl = (slug, language, options = {}) => {
    const clean = options.clean !== false && CLEAN_ROUTE_SLUGS.has(slug);
    const encodedSlug = encodeURIComponent(slug);

    if (clean) {
      const query = language && language !== DEFAULT_LANGUAGE ? `?lang=${language}` : "";
      if (window.location.protocol === "file:") {
        return `${getRootPath()}oficinas/${encodedSlug}/index.html${query}`;
      }
      return `${getRootPath()}oficinas/${encodedSlug}/${query}`;
    }

    const params = new URLSearchParams({ slug });
    if (language && language !== DEFAULT_LANGUAGE) params.set("lang", language);
    return `${getRootPath()}oficina.html?${params.toString()}`;
  };

  const getWhatsAppPhone = (phone) => String(phone || PHONE).replace(/\D/g, "") || PHONE;

  const createWhatsAppUrl = (message, extra = "", phone) => {
    const settings = loadSiteSettings();
    const targetPhone = getWhatsAppPhone(phone || settings.whatsappPhone);
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(`${message}${extra}`)}`;
  };

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const enableFloatingWhatsApp = () => {
    if (document.body.dataset.page === "admin" || document.querySelector(".floating-whatsapp")) return;

    const settings = loadSiteSettings();
    const copy = getSiteCopy(getLanguage(), settings);
    const whatsappCopy = copy.whatsapp || ui.pt.whatsapp;
    const eyebrow = whatsappCopy.eyebrow || "Falar no";
    const label = whatsappCopy.label || "WhatsApp";

    const link = document.createElement("a");
    link.className = "floating-whatsapp";
    link.href = createWhatsAppUrl(settings.whatsappMessage, "", settings.whatsappPhone);
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", `${eyebrow} ${label}`);
    link.innerHTML = `
      <span class="floating-whatsapp__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L4 20.3l1.1-4A8.4 8.4 0 1 1 20.5 11.8Z"></path>
          <path d="M9.3 8.2c-.2-.5-.4-.5-.7-.5H8c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.2 4.9 4.3 2.4 1 2.9.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4 0-.1-.2-.2-.5-.4l-1.8-.9c-.3-.1-.5-.2-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6L9.3 8.2Z"></path>
        </svg>
      </span>
      <span class="floating-whatsapp__copy">
        <span class="floating-whatsapp__eyebrow">${escapeHtml(eyebrow)}</span>
        <span class="floating-whatsapp__label">${escapeHtml(label)}</span>
      </span>
    `;

    document.body.append(link);
  };

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
    defaultWorkshops: clone(getPublishedWorkshops()),
    defaultSiteSettings: clone(getPublishedSiteSettings()),
    globalFaq,
    ui,
    clone,
    normalizeWorkshops,
    normalizeSiteSettings,
    getRootPath,
    getLanguage,
    setLanguage,
    loadWorkshops,
    saveWorkshops,
    loadSiteSettings,
    saveSiteSettings,
    getSiteCopy,
    getGlobalFaq,
    getWorkshopCopy,
    getWorkshopLanguages,
    getWorkshopUrl,
    resolveAsset,
    createWhatsAppUrl,
    enableImageLightbox,
    enableFloatingWhatsApp,
  };

  document.addEventListener("DOMContentLoaded", enableImageLightbox);
  document.addEventListener("DOMContentLoaded", enableFloatingWhatsApp);
})();
