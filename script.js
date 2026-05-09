/* =====================================================================
   AMTGARD — Chronicle interactions
   - Torch cursor that lags slightly behind the pointer
   - Scroll-reveal for sections
   - Subtle parallax breath on the hero corners
   ===================================================================== */

(() => {
  // ░░░ NAV DROPDOWNS ░░░
  const dropdowns = document.querySelectorAll("[data-dropdown]");
  if (dropdowns.length) {
    const closeAll = (except) => {
      dropdowns.forEach((d) => {
        if (d === except) return;
        d.dataset.open = "false";
        d.querySelector(".ribbon__menu-trigger")?.setAttribute("aria-expanded", "false");
      });
    };

    dropdowns.forEach((dd) => {
      const trigger = dd.querySelector(".ribbon__menu-trigger");
      if (!trigger) return;
      dd.dataset.open = "false";

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dd.dataset.open === "true";
        closeAll(dd);
        dd.dataset.open = isOpen ? "false" : "true";
        trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });

      // hover open on desktop pointer
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        let hoverTimer;
        dd.addEventListener("mouseenter", () => {
          clearTimeout(hoverTimer);
          closeAll(dd);
          dd.dataset.open = "true";
          trigger.setAttribute("aria-expanded", "true");
        });
        dd.addEventListener("mouseleave", () => {
          hoverTimer = setTimeout(() => {
            dd.dataset.open = "false";
            trigger.setAttribute("aria-expanded", "false");
          }, 180);
        });
      }
    });

    document.addEventListener("click", () => closeAll(null));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll(null);
    });
  }

  // ░░░ TORCH CURSOR ░░░
  const torch = document.querySelector(".torch");
  if (torch && window.matchMedia("(pointer: fine)").matches) {
    const HALF = 11; // torch is 22x22
    let tx = -100, ty = -100;     // current rendered position
    let mx = -100, my = -100;     // pointer target
    let scale = 1;
    let armed = false;            // wait for first real mousemove

    const tick = () => {
      tx += (mx - tx) * 0.22;
      ty += (my - ty) * 0.22;
      torch.style.transform =
        `translate3d(${tx - HALF}px, ${ty - HALF}px, 0) scale(${scale})`;
      requestAnimationFrame(tick);
    };

    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!armed) {
          // snap to first real cursor position so it doesn't ease in from 0,0
          tx = mx;
          ty = my;
          torch.style.opacity = "1";
          armed = true;
        }
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () => (torch.style.opacity = "0"));
    document.addEventListener("mouseenter", () => {
      if (armed) torch.style.opacity = "1";
    });

    const interactives = document.querySelectorAll(
      "a, button, input, .class-card, .realm, .arms__item, .craft-card"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", () => (scale = 1.6));
      el.addEventListener("mouseleave", () => (scale = 1));
    });

    torch.style.opacity = "0"; // hidden until first move
    tick();
  }

  // ░░░ SCROLL REVEAL ░░░
  const revealSelectors = [
    ".chronicle__heading",
    ".chronicle__columns",
    ".chronicle__aside",
    ".classes__feature",
    ".class-card",
    ".realm",
    ".wars__list li",
    ".field-photo",
    ".arms__item",
    ".craft-card",
    ".crafts__footnote",
    ".join__card",
    ".section__title",
    ".classes__footnote",
  ];
  const targets = document.querySelectorAll(revealSelectors.join(","));
  targets.forEach((el, i) => {
    el.classList.add("reveal");
    // small stagger when items appear in groups
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add("is-in"));
  }

  // ░░░ HERO CORNER BREATH ░░░ (subtle parallax on pointer)
  const corners = document.querySelectorAll(".hero__corner");
  const hero = document.querySelector(".hero");
  if (hero && corners.length && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const dy = ((e.clientY - r.top) / r.height - 0.5) * 8;
      corners.forEach((c) => {
        const dirX = c.classList.contains("hero__corner--tr") || c.classList.contains("hero__corner--br") ? -1 : 1;
        const dirY = c.classList.contains("hero__corner--bl") || c.classList.contains("hero__corner--br") ? -1 : 1;
        const baseTransform = c.dataset.base || c.style.transform || "";
        if (!c.dataset.base) c.dataset.base = baseTransform;
        c.style.transform = `${c.dataset.base} translate(${dx * dirX}px, ${dy * dirY}px)`;
      });
    });
    hero.addEventListener("mouseleave", () => {
      corners.forEach((c) => {
        c.style.transform = c.dataset.base || "";
      });
    });
  }

  // ░░░ REALMS MAP — auto-cycle pages of 6 kingdoms ░░░
  const mapStage = document.querySelector(".realms-map__stage");
  if (mapStage) {
    const pageCount = 4;
    const dwellMs = 5500; // each page visible for 5.5s
    let current = parseInt(mapStage.dataset.activePage, 10) || 1;
    let timer = null;
    let paused = false;

    const advance = () => {
      if (paused) return;
      current = (current % pageCount) + 1;
      mapStage.dataset.activePage = String(current);
    };
    const setPage = (n) => {
      current = n;
      mapStage.dataset.activePage = String(n);
      // restart the timer so the user gets a full dwell on their pick
      clearInterval(timer);
      timer = setInterval(advance, dwellMs);
    };

    timer = setInterval(advance, dwellMs);

    // Pause when hovered or focused — let people read
    mapStage.addEventListener("mouseenter", () => (paused = true));
    mapStage.addEventListener("mouseleave", () => (paused = false));
    mapStage.addEventListener("focusin", () => (paused = true));
    mapStage.addEventListener("focusout", () => (paused = false));

    // Pager pip clicks
    mapStage.querySelectorAll(".realms-map__pager button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const n = parseInt(btn.dataset.page, 10);
        if (!Number.isNaN(n)) setPage(n);
      });
    });
  }

  // ░░░ ZIP FORM (no-op enhancement) ░░░
  const form = document.querySelector(".join__form");
  const input = document.querySelector("#zip");
  if (form && input) {
    form.addEventListener("submit", () => {
      // honest about being a demo: just give a flash
      input.animate(
        [
          { boxShadow: "0 0 0 0 rgba(232,201,125,0.7)", color: "#E8C97D" },
          { boxShadow: "0 0 0 12px rgba(232,201,125,0)", color: "#F2E4BC" },
        ],
        { duration: 700, easing: "ease-out" }
      );
    });
  }
})();
