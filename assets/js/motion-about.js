/*=========================================================
    AUDIT HUB PRO — ABOUT PAGE MOTION LAYER
    Same defensive pattern as assets/js/motion.js: no-ops
    instantly if GSAP/ScrollTrigger fail to load, and respects
    prefers-reduced-motion. Every element here is fully visible
    through normal CSS with zero JS running.
=========================================================*/

(function () {
    if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") return;

    const prefersReducedMotion = () =>
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const revealUp = (selector, opts = {}) => {
        document.querySelectorAll(selector).forEach(el => {
            gsap.from(el, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
                ...opts
            });
        });
    };

    // Section headings
    revealUp(".about-section h2");

    // Experience role cards
    revealUp(".role-card");

    // Highlight bullets inside each role card, lightly staggered
    document.querySelectorAll(".highlight-list").forEach(list => {
        gsap.from(list.querySelectorAll("li"), {
            opacity: 0,
            x: -10,
            duration: 0.35,
            ease: "power2.out",
            stagger: 0.07,
            scrollTrigger: { trigger: list, start: "top 88%" }
        });
    });

    // Key clients — pop in as a staggered cloud
    const clientCloud = document.querySelector(".client-cloud");
    if (clientCloud) {
        gsap.from(clientCloud.querySelectorAll(".client-chip"), {
            opacity: 0,
            scale: 0.9,
            y: 8,
            duration: 0.35,
            ease: "back.out(1.6)",
            stagger: { each: 0.03, from: "start" },
            scrollTrigger: { trigger: clientCloud, start: "top 88%" }
        });
    }

    // Skill cards
    const skillsGrid = document.querySelector(".skills-grid");
    if (skillsGrid) {
        gsap.from(skillsGrid.querySelectorAll(".skill-card"), {
            opacity: 0,
            y: 18,
            scale: 0.97,
            duration: 0.45,
            ease: "back.out(1.4)",
            stagger: 0.08,
            scrollTrigger: { trigger: skillsGrid, start: "top 88%" }
        });
    }

    // Education table
    revealUp(".edu-table");

    // Contact cards
    const contactGrid = document.querySelector(".contact-grid");
    if (contactGrid) {
        gsap.from(contactGrid.querySelectorAll(".contact-card"), {
            opacity: 0,
            y: 16,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: { trigger: contactGrid, start: "top 88%" }
        });
    }

    // Social icon row
    const socialRow = document.querySelector(".social-row");
    if (socialRow) {
        gsap.from(socialRow.querySelectorAll(".social-btn"), {
            opacity: 0,
            scale: 0.7,
            duration: 0.35,
            ease: "back.out(1.8)",
            stagger: 0.08,
            scrollTrigger: { trigger: socialRow, start: "top 92%" }
        });
    }

    // CTA button
    revealUp(".about-cta");
})();
