/*=========================================================
    AUDIT HUB PRO — MOTION LAYER
    Optional progressive enhancement, built with GSAP + ScrollTrigger.

    If either library fails to load (offline, blocked CDN, etc.)
    this file no-ops on its very first line — every element it
    would otherwise animate is already fully visible through the
    default CSS, so nothing breaks and nothing stays hidden.

    Also respects prefers-reduced-motion throughout.

    Developed by Vicky Shaw
=========================================================*/

(function () {
    if (typeof window.gsap === "undefined") return;

    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const prefersReducedMotion = () =>
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* -----------------------------------------------------
        CARD GRID ENTRANCE
        script.js calls this every time it rebuilds the grids —
        on first load, on category change, and on search.
    ----------------------------------------------------- */
    window.onCardsRendered = function (grids) {
        if (prefersReducedMotion()) return;

        [grids.featuredGrid, grids.allGrid].forEach(grid => {
            if (!grid) return;
            const cards = grid.querySelectorAll(".card");
            if (!cards.length) return;

            gsap.from(cards, {
                opacity: 0,
                y: 18,
                scale: 0.96,
                duration: 0.45,
                ease: "back.out(1.4)",
                stagger: { each: 0.06, from: "start", grid: "auto" },
                clearProps: "opacity,transform"
            });
        });
    };

    if (!window.ScrollTrigger || prefersReducedMotion()) return;

    /* -----------------------------------------------------
        HERO SNAPSHOT — bars fill in on load
        The HTML already sets each bar's correct final width
        inline, so without this (or without GSAP) they still
        show the right values immediately. This just animates
        the fill from 0 as a one-time flourish.
    ----------------------------------------------------- */
    const bars = document.querySelectorAll(".snapshot-bar span[data-fill]");
    if (bars.length) {
        gsap.set(bars, { width: "0%" });
        gsap.to(bars, {
            width: (i, el) => el.dataset.fill + "%",
            duration: 1.1,
            ease: "power2.out",
            stagger: 0.15,
            delay: 0.5
        });
    }

    /* -----------------------------------------------------
        SECTION TITLES — reveal as they enter the viewport
    ----------------------------------------------------- */
    document.querySelectorAll(".section-title").forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 16,
            duration: 0.4,
            ease: "power1.out",
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });

    /* -----------------------------------------------------
        STAT STRIP — count up once, the first time it's seen
    ----------------------------------------------------- */
    const statCells = document.querySelectorAll(".stat-cell h3[data-stat]");
    if (statCells.length) {
        ScrollTrigger.create({
            trigger: ".stats-strip",
            start: "top 85%",
            once: true,
            onEnter: () => {
                statCells.forEach(el => {
                    const target = parseInt(el.textContent, 10);
                    if (isNaN(target)) return;
                    const counter = { val: 0 };
                    gsap.to(counter, {
                        val: target,
                        duration: 1,
                        ease: "power2.out",
                        onUpdate: () => { el.textContent = Math.round(counter.val); }
                    });
                });
            }
        });
    }
})();
