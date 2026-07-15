const WHATSAPP_PHONE = "5511992978145";
const VIMEO_AULAS_URL = "https://vimeo.com/user131484859";
const CAROUSEL_AUTOPLAY_INTERVAL_MS = 3000;
const DEFAULT_LANGUAGE = "pt";
const LANGUAGE_STORAGE_KEY = "nicholas-dieter-language";

const languageMeta = {
  pt: { htmlLang: "pt-BR", label: "Português" },
  es: { htmlLang: "es", label: "Español" },
  en: { htmlLang: "en", label: "English" },
};

const translations = {
  pt: {
    meta: {
      title: "Nicholas Dieter | Laboratórios de Teatro e Cinema",
      description:
        "Laboratórios de Teatro, Cinema, Pesquisa e Formação Artística conduzidos por Nicholas Dieter.",
    },
    aria: {
      header: "Cabeçalho",
      brand: "Nicholas Dieter, início",
      mainNav: "Navegação principal",
      languageSwitcher: "Selecionar idioma",
      pageIndex: "Índice da página",
      heroMenu: "Percursos da página",
      primaryActions: "Ações principais",
      monogram: "Monograma ND",
      carousel: "Registros de oficinas",
      previousImage: "Imagem anterior",
      nextImage: "Próxima imagem",
      selectImage: "Selecionar imagem",
      indicatorLabel: "Ir para imagem {number}: {caption}",
      workshopDetails: "Detalhes da oficina",
      workshopWhatsapp: "Abrir WhatsApp para saber mais sobre a oficina {title}",
    },
    nav: {
      workshop: "Oficina",
      records: "Registros",
      classes: "Aulas",
      about: "Sobre",
    },
    hero: {
      eyebrow: "Diretor • Dramaturgo • Pesquisador",
      statement: "Laboratórios de Teatro, Cinema, Pesquisa e Formação Artística",
    },
    heroMenu: {
      workshopTitle: "Subpersonalidades",
      workshopSubtitle: "Laboratório intensivo",
      recordsTitle: "Registros",
      recordsSubtitle: "Processos em sala",
      classesTitle: "Outras aulas",
      classesSubtitle: "Vídeo e continuidade",
    },
    buttons: {
      knowWorkshop: "Conhecer oficina",
      viewClasses: "Ver outras aulas",
      goWorkshop: "Ir para esta oficina",
    },
    featured: {
      kicker: "Oficina em destaque",
      posterAlt: "Cartaz do Laboratório Intensivo Subpersonalidades",
    },
    workshop: {
      title: "Subpersonalidades",
      titleLines: ["Sub", "personalidades"],
      label: "Laboratório Intensivo",
      description: "Preparação emocional, imaginação dramática e dinâmicas coletivas.",
      priceLabel: "Venha conhecer",
      whatsappMessage:
        "Olá, Nicholas! Tenho interesse na oficina Subpersonalidades. Gostaria de receber mais informações sobre datas, formato e inscrição.",
      details: [
        ["Foco", "presença, emoção e escuta cênica"],
        ["Prática", "imaginação dramática e dinâmica coletiva"],
        ["Formato", "turma reduzida e acompanhamento próximo"],
      ],
    },
    gallery: {
      kicker: "Arquivo vivo",
      title: "Registros de oficinas",
      summary:
        "Imagens de ensaios, leituras e composições coletivas. O arquivo fica pronto para crescer com novas turmas, encontros e processos.",
      items: {
        reading: {
          alt: "Participantes lendo textos em uma sala de ensaio com luzes de palco.",
          caption: "Leitura, escuta e composição em sala de ensaio.",
        },
        table: {
          alt: "Três participantes em exercício cênico ao redor de uma mesa de madeira.",
          caption: "Jogo dramático, relação e construção de presença.",
        },
        duo: {
          alt: "Dois participantes em exercício teatral sentados à mesa.",
          caption: "Cena, conflito e imaginação compartilhada.",
        },
        sofa: {
          alt: "Duas participantes em exercício físico sobre um sofá em cena.",
          caption: "Corpo, impulso e reação em composição.",
        },
        audience: {
          alt: "Participante em pé diante de uma mesa com público ao fundo.",
          caption: "Presença individual diante do grupo.",
        },
        red: {
          alt: "Participante sentada à mesa com figurino vermelho em exercício cênico.",
          caption: "Escuta, pausa e tensão dramática.",
        },
        stage: {
          alt: "Duas participantes em cena no palco diante da plateia.",
          caption: "Cena aberta, luz e relação com a plateia.",
        },
      },
    },
    lessons: {
      kicker: "Outras aulas",
      title: "Aulas, filmes e processos em vídeo.",
    },
    about: {
      kicker: "Sobre",
      title: "Pesquisa cênica com presença, escuta e composição.",
      body:
        "Nicholas Dieter conduz laboratórios de teatro, cinema e formação artística voltados à presença, imaginação dramática, pesquisa cênica e composição coletiva.",
      instagram: "Nicholas Dieter",
    },
    footer: {
      text: "Laboratórios de Teatro, Cinema, Pesquisa e Formação Artística.",
    },
  },
  es: {
    meta: {
      title: "Nicholas Dieter | Laboratorios de Teatro y Cine",
      description:
        "Laboratorios de Teatro, Cine, Investigación y Formación Artística conducidos por Nicholas Dieter.",
    },
    aria: {
      header: "Encabezado",
      brand: "Nicholas Dieter, inicio",
      mainNav: "Navegación principal",
      languageSwitcher: "Seleccionar idioma",
      pageIndex: "Índice de la página",
      heroMenu: "Recorridos de la página",
      primaryActions: "Acciones principales",
      monogram: "Monograma ND",
      carousel: "Registros de talleres",
      previousImage: "Imagen anterior",
      nextImage: "Siguiente imagen",
      selectImage: "Seleccionar imagen",
      indicatorLabel: "Ir a la imagen {number}: {caption}",
      workshopDetails: "Detalles del taller",
      workshopWhatsapp: "Abrir WhatsApp para saber más sobre el taller {title}",
    },
    nav: {
      workshop: "Taller",
      records: "Registros",
      classes: "Clases",
      about: "Sobre",
    },
    hero: {
      eyebrow: "Director • Dramaturgo • Investigador",
      statement: "Laboratorios de Teatro, Cine, Investigación y Formación Artística",
    },
    heroMenu: {
      workshopTitle: "Subpersonalidades",
      workshopSubtitle: "Laboratorio intensivo",
      recordsTitle: "Registros",
      recordsSubtitle: "Procesos en sala",
      classesTitle: "Otras clases",
      classesSubtitle: "Video y continuidad",
    },
    buttons: {
      knowWorkshop: "Conocer taller",
      viewClasses: "Ver otras clases",
      goWorkshop: "Ir a este taller",
    },
    featured: {
      kicker: "Taller destacado",
      posterAlt: "Cartel del Laboratorio Intensivo Subpersonalidades",
    },
    workshop: {
      title: "Subpersonalidades",
      titleLines: ["Sub", "personalidades"],
      label: "Laboratorio Intensivo",
      description: "Preparación emocional, imaginación dramática y dinámicas colectivas.",
      priceLabel: "Ven a conocer",
      whatsappMessage:
        "Hola, Nicholas! Me interesa el taller Subpersonalidades. Me gustaría recibir más información sobre fechas, formato e inscripción.",
      details: [
        ["Enfoque", "presencia, emoción y escucha escénica"],
        ["Práctica", "imaginación dramática y dinámica colectiva"],
        ["Formato", "grupo reducido y acompañamiento cercano"],
      ],
    },
    gallery: {
      kicker: "Archivo vivo",
      title: "Registros de talleres",
      summary:
        "Imágenes de ensayos, lecturas y composiciones colectivas. El archivo está listo para crecer con nuevas generaciones, encuentros y procesos.",
      items: {
        reading: {
          alt: "Participantes leyendo textos en una sala de ensayo con luces de escenario.",
          caption: "Lectura, escucha y composición en sala de ensayo.",
        },
        table: {
          alt: "Tres participantes en un ejercicio escénico alrededor de una mesa de madera.",
          caption: "Juego dramático, relación y construcción de presencia.",
        },
        duo: {
          alt: "Dos participantes en un ejercicio teatral sentados a la mesa.",
          caption: "Escena, conflicto e imaginación compartida.",
        },
        sofa: {
          alt: "Dos participantes en un ejercicio físico sobre un sofá en escena.",
          caption: "Cuerpo, impulso y reacción en composición.",
        },
        audience: {
          alt: "Participante de pie frente a una mesa con público al fondo.",
          caption: "Presencia individual frente al grupo.",
        },
        red: {
          alt: "Participante sentada a la mesa con vestuario rojo en ejercicio escénico.",
          caption: "Escucha, pausa y tensión dramática.",
        },
        stage: {
          alt: "Dos participantes en escena sobre el escenario frente al público.",
          caption: "Escena abierta, luz y relación con el público.",
        },
      },
    },
    lessons: {
      kicker: "Otras clases",
      title: "Clases, películas y procesos en video.",
    },
    about: {
      kicker: "Sobre",
      title: "Investigación escénica con presencia, escucha y composición.",
      body:
        "Nicholas Dieter conduce laboratorios de teatro, cine y formación artística orientados a la presencia, la imaginación dramática, la investigación escénica y la composición colectiva.",
      instagram: "Nicholas Dieter",
    },
    footer: {
      text: "Laboratorios de Teatro, Cine, Investigación y Formación Artística.",
    },
  },
  en: {
    meta: {
      title: "Nicholas Dieter | Theater and Film Labs",
      description:
        "Theater, Film, Research and Artistic Training Labs led by Nicholas Dieter.",
    },
    aria: {
      header: "Header",
      brand: "Nicholas Dieter, home",
      mainNav: "Main navigation",
      languageSwitcher: "Select language",
      pageIndex: "Page index",
      heroMenu: "Page paths",
      primaryActions: "Primary actions",
      monogram: "ND monogram",
      carousel: "Workshop records",
      previousImage: "Previous image",
      nextImage: "Next image",
      selectImage: "Select image",
      indicatorLabel: "Go to image {number}: {caption}",
      workshopDetails: "Workshop details",
      workshopWhatsapp: "Open WhatsApp to learn more about the {title} workshop",
    },
    nav: {
      workshop: "Workshop",
      records: "Records",
      classes: "Classes",
      about: "About",
    },
    hero: {
      eyebrow: "Director • Playwright • Researcher",
      statement: "Theater, Film, Research and Artistic Training Labs",
    },
    heroMenu: {
      workshopTitle: "Subpersonalities",
      workshopSubtitle: "Intensive lab",
      recordsTitle: "Records",
      recordsSubtitle: "Studio processes",
      classesTitle: "Other classes",
      classesSubtitle: "Video and continuity",
    },
    buttons: {
      knowWorkshop: "Explore workshop",
      viewClasses: "View other classes",
      goWorkshop: "Go to this workshop",
    },
    featured: {
      kicker: "Featured workshop",
      posterAlt: "Poster for the Subpersonalities Intensive Lab",
    },
    workshop: {
      title: "Subpersonalities",
      titleLines: ["Sub", "personalities"],
      label: "Intensive Lab",
      description: "Emotional preparation, dramatic imagination and collective dynamics.",
      priceLabel: "Come learn more",
      whatsappMessage:
        "Hello, Nicholas! I am interested in the Subpersonalities workshop. I would like to receive more information about dates, format and registration.",
      details: [
        ["Focus", "presence, emotion and scenic listening"],
        ["Practice", "dramatic imagination and collective dynamics"],
        ["Format", "small group and close guidance"],
      ],
    },
    gallery: {
      kicker: "Living archive",
      title: "Workshop records",
      summary:
        "Images from rehearsals, readings and collective compositions. The archive is ready to grow with new groups, encounters and processes.",
      items: {
        reading: {
          alt: "Participants reading texts in a rehearsal room with stage lights.",
          caption: "Reading, listening and composition in the rehearsal room.",
        },
        table: {
          alt: "Three participants in a scenic exercise around a wooden table.",
          caption: "Dramatic play, relationship and presence-building.",
        },
        duo: {
          alt: "Two participants in a theater exercise seated at a table.",
          caption: "Scene, conflict and shared imagination.",
        },
        sofa: {
          alt: "Two participants in a physical exercise on a sofa in scene.",
          caption: "Body, impulse and reaction in composition.",
        },
        audience: {
          alt: "Participant standing at a table with an audience in the background.",
          caption: "Individual presence before the group.",
        },
        red: {
          alt: "Participant seated at a table in red costume during a scenic exercise.",
          caption: "Listening, pause and dramatic tension.",
        },
        stage: {
          alt: "Two participants on stage in front of the audience.",
          caption: "Open scene, light and relationship with the audience.",
        },
      },
    },
    lessons: {
      kicker: "Other classes",
      title: "Classes, films and processes on video.",
    },
    about: {
      kicker: "About",
      title: "Scenic research through presence, listening and composition.",
      body:
        "Nicholas Dieter leads theater, film and artistic training labs centered on presence, dramatic imagination, scenic research and collective composition.",
      instagram: "Nicholas Dieter",
    },
    footer: {
      text: "Theater, Film, Research and Artistic Training Labs.",
    },
  },
};

const galleryImages = [
  {
    src: "assets/oficina-leitura-palco.png",
    key: "reading",
    layout: "wide",
    position: "center center",
  },
  {
    src: "assets/oficina-mesa-cena.png",
    key: "table",
    layout: "portrait",
    position: "center center",
  },
  {
    src: "assets/oficina-dupla-mesa.png",
    key: "duo",
    layout: "wide",
    position: "center center",
  },
  {
    src: "assets/oficina-sofa-movimento.png",
    key: "sofa",
    layout: "portrait",
    position: "center center",
  },
  {
    src: "assets/oficina-mesa-publico.png",
    key: "audience",
    layout: "portrait",
    position: "center center",
  },
  {
    src: "assets/oficina-figura-vermelho.png",
    key: "red",
    layout: "portrait",
    position: "center center",
  },
  {
    src: "assets/oficina-palco-aberto.png",
    key: "stage",
    layout: "portrait",
    position: "center center",
  },
];

let currentLanguage = DEFAULT_LANGUAGE;

const carouselState = {
  activeIndex: 0,
  autoplayTimer: undefined,
  indicatorButtons: [],
  initialized: false,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  slides: [],
  touchStartX: 0,
};

const getInitialLanguage = () => {
  const params = new URLSearchParams(window.location.search);
  const queryLanguage = params.get("lang");

  if (queryLanguage && languageMeta[queryLanguage]) {
    return queryLanguage;
  }

  try {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (savedLanguage && languageMeta[savedLanguage]) {
      return savedLanguage;
    }
  } catch {
    // Local storage can be unavailable in some privacy contexts.
  }

  const browserLanguage = navigator.language?.slice(0, 2);
  return languageMeta[browserLanguage] ? browserLanguage : DEFAULT_LANGUAGE;
};

const getTranslation = (key) =>
  key.split(".").reduce((value, part) => value?.[part], translations[currentLanguage]);

const interpolate = (template, values = {}) =>
  Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );

const createWhatsAppUrl = (message) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

const setVimeoLinks = () => {
  document.querySelectorAll("[data-vimeo-link]").forEach((link) => {
    link.href = VIMEO_AULAS_URL;
  });
};

const getLocalizedGalleryImage = (image) => ({
  ...image,
  ...translations[currentLanguage].gallery.items[image.key],
});

const updateLanguageButtons = () => {
  document.querySelectorAll("[data-language-option]").forEach((button) => {
    const isActive = button.dataset.languageOption === currentLanguage;
    const language = languageMeta[button.dataset.languageOption];

    button.setAttribute("aria-pressed", String(isActive));
    button.setAttribute("aria-label", language.label);
    button.title = language.label;
  });
};

const translateStaticContent = () => {
  document.documentElement.lang = languageMeta[currentLanguage].htmlLang;
  document.title = translations[currentLanguage].meta.title;

  const metaDescription = document.querySelector("meta[name='description']");
  if (metaDescription) {
    metaDescription.content = translations[currentLanguage].meta.description;
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getTranslation(element.dataset.i18n);

    if (typeof value === "string") {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const value = getTranslation(element.dataset.i18nAria);

    if (typeof value === "string") {
      element.setAttribute("aria-label", value);
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const value = getTranslation(element.dataset.i18nAlt);

    if (typeof value === "string") {
      element.setAttribute("alt", value);
    }
  });
};

const renderWorkshopTitle = (titleLines) =>
  titleLines.map((line) => `<span class="workshop-title__line">${line}</span>`).join("");

const renderFeaturedWorkshop = () => {
  const container = document.querySelector("#featured-workshop");
  const workshop = translations[currentLanguage].workshop;

  if (!container) {
    return;
  }

  const details = workshop.details
    .map(
      ([label, value]) => `
        <p>
          <span>${label}</span>
          ${value}
        </p>
      `,
    )
    .join("");

  container.innerHTML = `
    <p class="featured__label">${workshop.label}</p>
    <h2 class="workshop-title" id="featured-title" aria-label="${workshop.title}">
      ${renderWorkshopTitle(workshop.titleLines)}
    </h2>
    <p class="featured__description">${workshop.description}</p>
    <span class="featured__status">${workshop.priceLabel}</span>
    <div class="workshop-meta" aria-label="${translations[currentLanguage].aria.workshopDetails}">
      ${details}
    </div>
    <div class="featured__actions">
      <a
        class="button button--primary"
        href="${createWhatsAppUrl(workshop.whatsappMessage)}"
        target="_blank"
        rel="noopener"
        aria-label="${interpolate(translations[currentLanguage].aria.workshopWhatsapp, { title: workshop.title })}"
      >
        ${translations[currentLanguage].buttons.goWorkshop}
      </a>
    </div>
  `;
};

const updateCarousel = (nextIndex, shouldRestartAutoplay = false) => {
  const caption = document.querySelector("#gallery-current-caption");
  const counter = document.querySelector("#gallery-current-counter");
  const track = document.querySelector("#gallery-track");
  const galleryLength = galleryImages.length;

  if (!track || !carouselState.slides.length) {
    return;
  }

  carouselState.activeIndex = (nextIndex + galleryLength) % galleryLength;
  track.style.transform = `translateX(-${carouselState.activeIndex * 100}%)`;

  carouselState.slides.forEach((slide, index) => {
    slide.setAttribute("aria-hidden", String(index !== carouselState.activeIndex));
  });

  carouselState.indicatorButtons.forEach((button, index) => {
    const image = getLocalizedGalleryImage(galleryImages[index]);
    button.classList.toggle("is-active", index === carouselState.activeIndex);
    button.setAttribute("aria-current", String(index === carouselState.activeIndex));
    button.setAttribute(
      "aria-label",
      interpolate(translations[currentLanguage].aria.indicatorLabel, {
        number: index + 1,
        caption: image.caption,
      }),
    );
  });

  if (caption) {
    caption.textContent = getLocalizedGalleryImage(galleryImages[carouselState.activeIndex]).caption;
  }

  if (counter) {
    counter.textContent = `${String(carouselState.activeIndex + 1).padStart(2, "0")} / ${String(galleryLength).padStart(2, "0")}`;
  }

  if (shouldRestartAutoplay) {
    restartAutoplay();
  }
};

const restartAutoplay = () => {
  if (carouselState.reducedMotion) {
    return;
  }

  window.clearInterval(carouselState.autoplayTimer);
  carouselState.autoplayTimer = window.setInterval(() => {
    updateCarousel(carouselState.activeIndex + 1);
  }, CAROUSEL_AUTOPLAY_INTERVAL_MS);
};

const renderGallery = () => {
  const track = document.querySelector("#gallery-track");
  const indicators = document.querySelector("#gallery-indicators");

  if (!track || !indicators) {
    return;
  }

  const localizedImages = galleryImages.map(getLocalizedGalleryImage);

  track.innerHTML = localizedImages
    .map(
      (image, index) => `
        <figure class="carousel__slide carousel__slide--${image.layout}" aria-hidden="${index === carouselState.activeIndex ? "false" : "true"}">
          <span
            class="carousel__backdrop"
            aria-hidden="true"
            style="background-image: url('${image.src}'); background-position: ${image.position};"
          ></span>
          <img
            src="${image.src}"
            alt="${image.alt}"
            loading="${index === 0 ? "eager" : "lazy"}"
            style="object-position: ${image.position};"
          >
          <figcaption class="carousel__caption">${image.caption}</figcaption>
        </figure>
      `,
    )
    .join("");

  indicators.innerHTML = localizedImages
    .map(
      (image, index) => `
        <button
          class="carousel__indicator${index === carouselState.activeIndex ? " is-active" : ""}"
          type="button"
          aria-label="${interpolate(translations[currentLanguage].aria.indicatorLabel, {
            number: index + 1,
            caption: image.caption,
          })}"
          aria-current="${index === carouselState.activeIndex ? "true" : "false"}"
          data-carousel-indicator="${index}"
        >
          <img src="${image.src}" alt="" loading="lazy" style="object-position: ${image.position};">
        </button>
      `,
    )
    .join("");

  carouselState.slides = [...track.querySelectorAll(".carousel__slide")];
  carouselState.indicatorButtons = [...indicators.querySelectorAll(".carousel__indicator")];

  carouselState.indicatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateCarousel(Number(button.dataset.carouselIndicator), true);
    });
  });

  updateCarousel(carouselState.activeIndex);
  restartAutoplay();
};

const setupGalleryControls = () => {
  const viewport = document.querySelector(".carousel__viewport");
  const previousButton = document.querySelector("[data-carousel-prev]");
  const nextButton = document.querySelector("[data-carousel-next]");

  if (!viewport || !previousButton || !nextButton || carouselState.initialized) {
    return;
  }

  previousButton.addEventListener("click", () => updateCarousel(carouselState.activeIndex - 1, true));
  nextButton.addEventListener("click", () => updateCarousel(carouselState.activeIndex + 1, true));

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      updateCarousel(carouselState.activeIndex - 1, true);
    }

    if (event.key === "ArrowRight") {
      updateCarousel(carouselState.activeIndex + 1, true);
    }
  });

  viewport.addEventListener(
    "touchstart",
    (event) => {
      carouselState.touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true },
  );

  viewport.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const distance = touchEndX - carouselState.touchStartX;

      if (Math.abs(distance) < 48) {
        return;
      }

      updateCarousel(carouselState.activeIndex + (distance < 0 ? 1 : -1), true);
    },
    { passive: true },
  );

  carouselState.initialized = true;
};

const applyLanguage = (language) => {
  currentLanguage = languageMeta[language] ? language : DEFAULT_LANGUAGE;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  } catch {
    // Local storage can be unavailable in some privacy contexts.
  }

  translateStaticContent();
  updateLanguageButtons();
  setVimeoLinks();
  renderFeaturedWorkshop();
  renderGallery();
};

const setupLanguageSwitcher = () => {
  document.querySelectorAll("[data-language-option]").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.languageOption);
    });
  });
};

const setupReveal = () => {
  const elements = document.querySelectorAll("[data-reveal]");
  document.body.classList.add("reveal-ready");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  elements.forEach((element) => observer.observe(element));
};

const setupSectionIndex = () => {
  const sections = document.querySelectorAll("[data-section]");
  const links = document.querySelectorAll("[data-section-link]");

  if (!("IntersectionObserver" in window) || !sections.length || !links.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        links.forEach((link) => {
          link.classList.toggle("is-active", link.dataset.sectionLink === entry.target.dataset.section);
        });
      });
    },
    {
      rootMargin: "-42% 0px -46% 0px",
      threshold: 0,
    },
  );

  sections.forEach((section) => observer.observe(section));
};

const setupHeroMotion = () => {
  const hero = document.querySelector(".hero");

  if (!hero) {
    return;
  }

  const updateScrollShift = () => {
    const shift = Math.min(window.scrollY * 0.08, 62);
    document.documentElement.style.setProperty("--scroll-shift", `${shift}px`);
  };

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    document.documentElement.style.setProperty("--hero-shift-x", `${x * -22}px`);
    document.documentElement.style.setProperty("--hero-shift-y", `${y * -12}px`);
    document.documentElement.style.setProperty("--hero-mark-shift-x", `${x * 8}px`);
  });

  window.addEventListener("scroll", updateScrollShift, { passive: true });
  updateScrollShift();
};

currentLanguage = getInitialLanguage();
setupLanguageSwitcher();
setupGalleryControls();
applyLanguage(currentLanguage);
setupReveal();
setupSectionIndex();
setupHeroMotion();
