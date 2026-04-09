const MODELS = [
  {
    title: "Oval",
    img: "assets/Oval.png",
    description:
      "Same brilliance pattern as a round with 58 facets. With a more elongated, flattering silhouette, this cut has more visible presence. The first oval diamond in recorded history is the Koh-i-Noor Diamond.",
    note: "Looks larger for the same carat",
  },
  {
    title: "Half Moon",
    img: "assets/half-moon.png",
    description:
      "Soft brilliance with 18-22 facets. Half-moons were designed to frame centre stones while maintaining light flow and balance. It is also called D-cut, because it's literally half a circle. They are quite revealing and so any inconsistency in facet alignment is visible.",
    note: "Flat edge & Curved pavilion alignment is visible.",
  },
  {
    title: "Heart",
    img: "assets/heart.png",
    description:
      "High brilliance with 56-58 facets. It mirrors the universally recognised symbol of the heart - two rounded lobes meeting at a cleft, tapering to a point with protective V-prongs. The heart shape prioritises emotional impact over maximum face-up size.",
    note: "A symbolic variation of the pear",
  },
  {
    title: "Emerald",
    img: "assets/emerald.png",
    description:
      "50-58 step-cut facets arranged in parallel planes. Emerald cut chooses clarity and color over sparkle. It needs higher clarity grades than brilliant cuts as inclusions are not hidden. The large, open facets make it ideal for larger carat diamonds.",
    note: '"Hall of Mirrors" effect',
  },
  {
    title: "Princess",
    img: "assets/princess.png",
    description:
      "Maximum brilliance in a square shape with 58 facets. A princess cut is a square shape with inverted pyramid pavilion for intense light return. Developed to deliver round-level brilliance in a square silhouette, while preserving more rough diamond during cutting.",
    note: "More sparkle than emerald",
  },
  {
    title: "Round",
    img: "assets/round.png",
    description:
      "Highest brilliance of all cuts with 57-58 precisely calculated facets. This was the first cut based on optical physics, not aesthetics. It boasts of circular symmetry and tight facet alignment that ensures uniform sparkle. This cut hides inclusions and colour better than any other cut.",
    note: "The Most Engineered Shape",
  },
  {
    title: "Pear",
    img: "assets/pear.png",
    description:
      "A deliberate imbalance creates high brilliance with 56-58 facets. Also known as the teardrop diamond, the pear shape is often associated with tears of joy, elegance, and sweeping romance - making it a popular choice for sentimental pieces like engagement rings and anniversary gifts.",
    note: "Hybrid of round & marquise cuts",
  },
  {
    title: "Marquise",
    img: "assets/marquise.png",
    description:
      "58 triangular and kite-shaped facets. With a long, pointed silhouette, this cut maximizes perceived size per carat. Look closely and you'll see the shape resembles lips, eyes, or a small boat (also called Navette cut).",
    note: "A brilliant-style cut",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
  const elements = {
    title: document.getElementById("cutTitle"),
    description: document.getElementById("cutDescription"),
    note: document.getElementById("cutNote"),
    img: document.querySelector(".cut-img"),
    slider: document.querySelector(".cutsSwiper"),
    sliderWrapper: document.querySelector(".cutsSwiper .swiper-wrapper"),
    nextButton: document.querySelector(".cuts-next"),
    prevButton: document.querySelector(".cuts-prev"),
  };

  if (
    !elements.title ||
    !elements.description ||
    !elements.note ||
    !elements.slider
  ) {
    console.warn("Slider content elements or slider container not found.");
    return;
  }

  if (isMobileViewport) {
    elements.slider.setAttribute("dir", "ltr");
  }

  const renderModelContent = (index) => {
    const model = MODELS[index];

    if (!model) {
      console.warn(`No model found for index: ${index}`);
      return;
    }

    elements.title.textContent = model.title;
    elements.description.textContent = model.description;
    elements.note.textContent = model.note;

    if (elements.img) {
      elements.img.src = model.img;
      elements.img.alt = model.title;
    }
  };

  const setupMobileSlider = () => {
    if (!elements.sliderWrapper) {
      return;
    }

    const originalSlides = Array.from(elements.sliderWrapper.children);

    if (!originalSlides.length) {
      return;
    }

    elements.slider.classList.add("cutsSwiper-mobile");
    elements.slider.setAttribute("dir", "ltr");

    originalSlides.forEach((slide, index) => {
      slide.dataset.modelIndex = String(index);
    });

    const createCloneSet = () =>
      originalSlides.map((slide) => {
        const clone = slide.cloneNode(true);
        clone.dataset.clone = "true";
        clone.dataset.modelIndex = slide.dataset.modelIndex;
        return clone;
      });

    const prependClones = [...createCloneSet(), ...createCloneSet()];
    const appendClones = [...createCloneSet(), ...createCloneSet()];

    prependClones
      .slice()
      .reverse()
      .forEach((slide) => {
        elements.sliderWrapper.insertBefore(slide, elements.sliderWrapper.firstChild);
      });

    appendClones.forEach((slide) => {
      elements.sliderWrapper.appendChild(slide);
    });

    const getSlides = () =>
      Array.from(elements.sliderWrapper.querySelectorAll(".swiper-slide"));

    const getOriginalsMetrics = () => {
      const firstOriginal = originalSlides[0];
      const lastOriginal = originalSlides[originalSlides.length - 1];
      const start = firstOriginal.offsetLeft;
      const end = lastOriginal.offsetLeft + lastOriginal.offsetWidth;

      return {
        start,
        end,
        width: end - start,
      };
    };

    const centerSlide = (slide, behavior = "auto") => {
      if (!slide) {
        return;
      }

      const targetLeft =
        slide.offsetLeft - (elements.slider.clientWidth - slide.offsetWidth) / 2;

      elements.slider.scrollTo({
        left: targetLeft,
        behavior,
      });
    };

    const syncInfinitePosition = () => {
      const { start, width } = getOriginalsMetrics();
      const currentLeft = elements.slider.scrollLeft;
      const leftThreshold = start - width * 0.9;
      const rightThreshold = start + width * 0.9;

      if (currentLeft < leftThreshold) {
        elements.slider.scrollLeft = currentLeft + width;
      } else if (currentLeft > rightThreshold + width) {
        elements.slider.scrollLeft = currentLeft - width;
      }
    };

    const updateActiveSlide = () => {
      syncInfinitePosition();

      const slides = getSlides();
      const centerX = elements.slider.scrollLeft + elements.slider.clientWidth / 2;

      const activeSlide = slides.reduce((closest, slide) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;

        if (!closest) {
          return slide;
        }

        const closestCenter = closest.offsetLeft + closest.offsetWidth / 2;
        return Math.abs(slideCenter - centerX) < Math.abs(closestCenter - centerX)
          ? slide
          : closest;
      }, null);

      const orderedSlides = slides
        .map((slide) => ({
          slide,
          distance: Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - centerX),
        }))
        .sort((a, b) => a.distance - b.distance);

      slides.forEach((slide) => {
        slide.classList.remove("is-active", "is-neighbor");
      });

      if (orderedSlides[0]) {
        orderedSlides[0].slide.classList.add("is-active");
        renderModelContent(Number(orderedSlides[0].slide.dataset.modelIndex));
      }

      if (orderedSlides[1]) {
        orderedSlides[1].slide.classList.add("is-neighbor");
      }

      if (orderedSlides[2]) {
        orderedSlides[2].slide.classList.add("is-neighbor");
      }
    };

    let ticking = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let didDrag = false;
    let settleTimer;

    const handleScroll = () => {
      window.clearTimeout(settleTimer);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSlide();
          ticking = false;
        });
        ticking = true;
      }

      settleTimer = window.setTimeout(() => {
        const activeSlide = elements.sliderWrapper.querySelector(".is-active");
        centerSlide(activeSlide, "smooth");
      }, 140);
    };

    const handleTap = (event) => {
      const slide = event.target.closest(".swiper-slide");

      if (!slide) {
        return;
      }

      centerSlide(slide, "smooth");
    };

    const handlePointerStart = (event) => {
      const point = "touches" in event ? event.touches[0] : event;
      pointerStartX = point.clientX;
      pointerStartY = point.clientY;
      didDrag = false;
    };

    const handlePointerMove = (event) => {
      const point = "touches" in event ? event.touches[0] : event;

      if (
        Math.abs(point.clientX - pointerStartX) > 8 ||
        Math.abs(point.clientY - pointerStartY) > 8
      ) {
        didDrag = true;
      }
    };

    const handlePointerEnd = () => {
      window.setTimeout(() => {
        didDrag = false;
      }, 0);
    };

    const handlePointerCancel = () => {
      window.clearTimeout(settleTimer);
      didDrag = false;
    };

    elements.slider.addEventListener("scroll", handleScroll, { passive: true });
    elements.slider.addEventListener("touchstart", handlePointerStart, {
      passive: true,
    });
    elements.slider.addEventListener("touchmove", handlePointerMove, {
      passive: true,
    });
    elements.slider.addEventListener("touchend", handlePointerEnd, {
      passive: true,
    });
    elements.slider.addEventListener("touchcancel", handlePointerCancel, {
      passive: true,
    });
    elements.slider.addEventListener("mousedown", handlePointerStart);
    elements.slider.addEventListener("mousemove", handlePointerMove);
    elements.slider.addEventListener("mouseup", handlePointerEnd);
    elements.slider.addEventListener("mouseleave", handlePointerCancel);
    elements.slider.addEventListener("click", (event) => {
      if (didDrag) {
        return;
      }

      handleTap(event);
    });

    window.requestAnimationFrame(() => {
      centerSlide(originalSlides[0], "auto");
      updateActiveSlide();
    });
  };

  const commonConfig = {
    speed: 400,
    centeredSlides: true,
    watchSlidesProgress: true,
    simulateTouch: true,
    allowTouchMove: true,
    touchEventsTarget: "container",
    touchStartPreventDefault: false,
    preventClicks: true,
    preventClicksPropagation: true,
    threshold: 6,
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: elements.nextButton,
      prevEl: elements.prevButton,
    },
    on: {
      init() {
        renderModelContent(this.realIndex);
      },
      slideChange() {
        renderModelContent(this.realIndex);
      },
      realIndexChange() {
        renderModelContent(this.realIndex);
      },
      transitionEnd() {
        renderModelContent(this.realIndex);
      },
      tap() {
        const activeSlide = this.slides[this.activeIndex];
        const activeLink = activeSlide?.querySelector("a[href]");

        if (!activeLink || this.animating) {
          return;
        }

        window.open(activeLink.href, activeLink.target || "_self");
      },
    },
  };

  const desktopConfig = {
    effect: "coverflow",
    loop: true,
    speed: 400,
    slidesPerView: "auto",
    grabCursor: true,
    centeredSlides: true,
    watchSlidesProgress: true,
    simulateTouch: true,
    observer: true,
    observeParents: true,
    spaceBetween: 30,
    navigation: {
      nextEl: elements.nextButton,
      prevEl: elements.prevButton,
    },
    coverflowEffect: {
      rotate: 0,
      stretch: 228,
      depth: 200,
      modifier: 2.5,
      slideShadows: false,
    },
    breakpoints: {
      0: {
        spaceBetween: 25,
        coverflowEffect: {
          rotate: 0,
          stretch: 90,
          depth: 90,
          modifier: 2.5,
          slideShadows: false,
        },
      },
      768: {
        spaceBetween: 2,
        coverflowEffect: {
          rotate: 0,
          stretch: 149,
          depth: 150,
          modifier: 2.5,
          slideShadows: false,
        },
      },
    },
    on: commonConfig.on,
  };

  if (isMobileViewport) {
    setupMobileSlider();
    return;
  }

  const swiper = new Swiper(elements.slider, desktopConfig);
  renderModelContent(swiper.realIndex);
});
