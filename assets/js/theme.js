/*=========================================================
    AUDIT HUB PRO — THEME TOGGLE (shared across every page)

    The inline script in <head> already set the initial
    data-theme attribute before first paint, on every page
    (avoids a flash of the wrong theme). This just handles
    the click + persists the choice for next visit.

    Independent of script.js on purpose — index.html and
    about.html both use this, but only index.html loads the
    tool-grid logic in script.js.
=========================================================*/

(function () {
    function bind() {
        const btn = document.getElementById("themeToggle");
        if (!btn) return;
        btn.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            try { localStorage.setItem("ahp-theme", next); } catch (e) { /* storage unavailable — theme just won't persist */ }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bind);
    } else {
        bind();
    }
})();
