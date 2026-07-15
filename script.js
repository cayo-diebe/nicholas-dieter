const WHATSAPP_PHONE = "5511992978145";
const VIMEO_AULAS_URL = "https://vimeo.com/user131484859";
const CAROUSEL_AUTOPLAY_INTERVAL_MS = 3000;

const workshops = [
  {
    title: "Subpersonalidades",
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
];

const galleryImages = [
  {
    src: "assets/oficina-leitura-palco.png",
    alt: "Participantes lendo textos em uma sala de ensaio com luzes de palco.",
    caption: "Leitura, escuta e composição em sala de ensaio.",
    layout: "wide",
    position: "center center",
  },
  {
    src: "assets/oficina-mesa-cena.png",
    alt: "Três participantes em exercício cênico ao redor de uma mesa de madeira.",
    caption: "Jogo dramático, relação e construção de presença.",
    layout: "portrait",
    position: "center center",
  },
  {
    src: "assets/oficina-dupla-mesa.png",
    alt: "Dois participantes em exercício teatral sentados à mesa.",
    caption: "Cena, conflito e imaginação compartilhada.",
    layout: "wide",
    position: "center center",
  },
  {
    src: "assets/oficina-sofa-movimento.png",
    alt: "Duas participantes em exercício físico sobre um sofá em cena.",
    caption: "Corpo, impulso e reação em composição.",
    layout: "portrait",
    position: "center center",
  },
  {
    src: "assets/oficina-mesa-publico.png",
    alt: "Participante em pé diante de uma mesa com público ao fundo.",
    caption: "Presença individual diante do grupo.",
    layout: "portrait",
    position: "center center",
  },
  {
    src: "assets/oficina-figura-vermelho.png",
    alt: "Participante sentada à mesa com figurino vermelho em exercício cênico.",
    caption: "Escuta, pausa e tensão dramática.",
    layout: "portrait",
    position: "center center",
  },
  {
    src: "assets/oficina-palco-aberto.png",
    alt: "Duas participantes em cena no palco diante da plateia.",
    caption: "Cena aberta, luz e relação com a plateia.",
    layout: "portrait",
    position: "center center",
  },
];

const formatWorkshopTitle = (title) => {
  if (title === "Subpersonalidades") {
    return `
      <span class="workshop-title__line">Sub</span>
      <span class="workshop-title__line">personalidades</span>
    `;
  }

  return title;
};

const createWhatsAppUrl = (message) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

const setVimeoLinks = () => {
  document.querySelectorAll("[data-vimeo-link]").forEach((link) => {
    link.href = VIMEO_AULAS_URL;
  });
};

const renderFeaturedWorkshop = () => {
  const container = document.querySelector("#featured-workshop");
  const [workshop] = workshops;

  if (!container || !workshop) {
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
      ${formatWorkshopTitle(workshop.title)}
    </h2>
    <p class="featured__description">${workshop.description}</p>
    <span class="featured__status">${workshop.priceLabel}</span>
    <div class="workshop-meta" aria-label="Detalhes da oficina">
      ${details}
    </div>
    <div class="featured__actions">
      <a
        class="button button--primary"
        href="${createWhatsAppUrl(workshop.whatsappMessage)}"
        target="_blank"
        rel="noopener"
        aria-label="Abrir WhatsApp para saber mais sobre a oficina ${workshop.title}"
      >
        Ir para esta oficina
      </a>
    </div>
  `;
};

const renderGallery = () => {
  const track = document.querySelector("#gallery-track");
  const indicators = document.querySelector("#gallery-indicators");
  const viewport = document.querySelector(".carousel__viewport");
  const caption = document.querySelector("#gallery-current-caption");
  const counter = document.querySelector("#gallery-current-counter");
  const previousButton = document.querySelector("[data-carousel-prev]");
  const nextButton = document.querySelector("[data-carousel-next]");

  if (!track || !indicators || !viewport || !previousButton || !nextButton) {
    return;
  }

  let activeIndex = 0;
  let touchStartX = 0;
  let autoplayTimer;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  track.innerHTML = galleryImages
    .map(
      (image, index) => `
        <figure class="carousel__slide carousel__slide--${image.layout}" aria-hidden="${index === 0 ? "false" : "true"}">
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

  indicators.innerHTML = galleryImages
    .map(
      (image, index) => `
        <button
          class="carousel__indicator${index === 0 ? " is-active" : ""}"
          type="button"
          aria-label="Ir para imagem ${index + 1}: ${image.caption}"
          aria-current="${index === 0 ? "true" : "false"}"
          data-carousel-indicator="${index}"
        >
          <img src="${image.src}" alt="" loading="lazy" style="object-position: ${image.position};">
        </button>
      `,
    )
    .join("");

  const slides = [...track.querySelectorAll(".carousel__slide")];
  const indicatorButtons = [...indicators.querySelectorAll(".carousel__indicator")];

  const updateCarousel = (nextIndex) => {
    activeIndex = (nextIndex + galleryImages.length) % galleryImages.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", String(index !== activeIndex));
    });

    indicatorButtons.forEach((button, index) => {
      button.classList.toggle("is-active", index === activeIndex);
      button.setAttribute("aria-current", String(index === activeIndex));
    });

    if (caption) {
      caption.textContent = galleryImages[activeIndex].caption;
    }

    if (counter) {
      counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(galleryImages.length).padStart(2, "0")}`;
    }
  };

  const restartAutoplay = () => {
    if (reducedMotion) {
      return;
    }

    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(() => {
      updateCarousel(activeIndex + 1);
    }, CAROUSEL_AUTOPLAY_INTERVAL_MS);
  };

  previousButton.addEventListener("click", () => {
    updateCarousel(activeIndex - 1);
    restartAutoplay();
  });

  nextButton.addEventListener("click", () => {
    updateCarousel(activeIndex + 1);
    restartAutoplay();
  });

  indicatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateCarousel(Number(button.dataset.carouselIndicator));
      restartAutoplay();
    });
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      updateCarousel(activeIndex - 1);
      restartAutoplay();
    }

    if (event.key === "ArrowRight") {
      updateCarousel(activeIndex + 1);
      restartAutoplay();
    }
  });

  viewport.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true },
  );

  viewport.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const distance = touchEndX - touchStartX;

      if (Math.abs(distance) < 48) {
        return;
      }

      updateCarousel(activeIndex + (distance < 0 ? 1 : -1));
      restartAutoplay();
    },
    { passive: true },
  );

  updateCarousel(0);
  restartAutoplay();
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

setVimeoLinks();
renderFeaturedWorkshop();
renderGallery();
setupReveal();
setupSectionIndex();
setupHeroMotion();
