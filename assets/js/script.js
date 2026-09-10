/*=========================================================
    AUDIT HUB PRO — MAIN APPLICATION
    Developed by Vicky Shaw
=========================================================*/

/*---------------------------------------------------------
    DOM ELEMENTS
---------------------------------------------------------*/
const categoryBar   = document.getElementById("categoryBar");
const featuredGrid  = document.getElementById("featuredGrid");
const featuredBlock = document.getElementById("featuredBlock");
const allGrid       = document.getElementById("allGrid");
const noResults     = document.getElementById("noResults");
const searchBox     = document.getElementById("search");
const currentYearEl = document.getElementById("currentYear");
const scrollTopBtn  = document.getElementById("scrollTop");

/*---------------------------------------------------------
    STATE
---------------------------------------------------------*/
let currentCategory = appConfig.defaultCategory || "all";
let currentKeyword = "";

/*---------------------------------------------------------
    INIT
    (this script tag sits at the end of body, so the DOM is
    already parsed by the time it runs — DOMContentLoaded may
    have already fired. Guard against both cases.)
---------------------------------------------------------*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

function init() {
    renderCategoryBar();
    renderAll();
    updateStats();
    bindSearch();
    bindScrollTop();
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
}

/*---------------------------------------------------------
    CATEGORY BAR (built from tools actually in the database)
---------------------------------------------------------*/
function renderCategoryBar() {
    if (!categoryBar) return;

    const used = getUsedCategories();

    const allBtn = makeCategoryButton("all", "All Tools", "fa-solid fa-border-all");
    categoryBar.appendChild(allBtn);

    used.forEach(catId => {
        const meta = categoryMeta[catId] || { name: catId, icon: "fa-solid fa-layer-group" };
        categoryBar.appendChild(makeCategoryButton(catId, meta.name, meta.icon));
    });
}

function makeCategoryButton(id, label, icon) {
    const btn = document.createElement("button");
    btn.className = "cat-btn" + (id === currentCategory ? " active" : "");
    btn.dataset.category = id;
    btn.innerHTML = `<i class="${icon}"></i> ${label}`;
    btn.addEventListener("click", () => {
        currentCategory = id;
        categoryBar.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderAll();
    });
    return btn;
}

/*---------------------------------------------------------
    FILTERING
---------------------------------------------------------*/
function getFilteredTools() {
    let list = getToolsByCategory(currentCategory);
    if (currentKeyword !== "") {
        const kw = currentKeyword;
        list = list.filter(tool =>
            tool.name.toLowerCase().includes(kw) ||
            tool.description.toLowerCase().includes(kw) ||
            tool.category.toLowerCase().includes(kw) ||
            (tool.code || "").toLowerCase().includes(kw)
        );
    }
    return list;
}

/*---------------------------------------------------------
    RENDER
---------------------------------------------------------*/
function renderAll() {
    const list = getFilteredTools();

    // Featured strip only shows while browsing "all" tools with no active search
    const showFeatured = currentCategory === "all" && currentKeyword === "";
    const featured = showFeatured ? getFeaturedTools() : [];

    if (featuredBlock) featuredBlock.classList.toggle("hidden", featured.length === 0);
    if (featuredGrid) {
        featuredGrid.innerHTML = "";
        featured.forEach(tool => featuredGrid.appendChild(buildCard(tool)));
    }

    if (allGrid) {
        allGrid.innerHTML = "";
        list.forEach(tool => allGrid.appendChild(buildCard(tool)));
    }

    if (noResults) noResults.classList.toggle("hidden", list.length !== 0);
    if (allGrid) allGrid.classList.toggle("hidden", list.length === 0);

    updateStats(list);

    // Optional hook: assets/js/motion.js attaches this if GSAP loaded successfully.
    // Core rendering above works fully with or without it.
    if (typeof window.onCardsRendered === "function") {
        window.onCardsRendered({ featuredGrid, allGrid });
    }
}

function buildCard(tool) {
    const card = document.createElement("div");
    card.className = "card cat-" + tool.category;

    const statusLabel = tool.status === "active" ? "Active" : "In Progress";
    const statusClass = tool.status === "active" ? "status-pill" : "status-pill muted";

    const meta = categoryMeta[tool.category] || { name: tool.category };

    card.innerHTML = `
        <div class="card-top">
            <div class="card-icon"><i class="${tool.icon}"></i></div>
            <span class="${statusClass}">${statusLabel}</span>
        </div>
        <h3>${tool.featured ? '<i class="fa-solid fa-star featured-mark"></i>' : ""}${tool.name}</h3>
        <p>${tool.description}</p>
        <div class="card-tags">
            <span class="category-badge">${meta.name}</span>
            <span class="version-tag">v${tool.version}</span>
        </div>
        <div class="card-footer">
            ${
                tool.status === "active"
                ? `<a href="${getToolURL(tool)}" class="open-btn">Open Tool <i class="fa-solid fa-arrow-right"></i></a>`
                : `<span class="coming-soon">Coming Soon</span>`
            }
        </div>
    `;
    return card;
}

/*---------------------------------------------------------
    STATS
---------------------------------------------------------*/
function updateStats(list) {
    if (typeof tools === "undefined" || !Array.isArray(tools)) {
        console.error("Audit HUB Pro: 'tools' is not defined — data/tools.js may not have loaded before script.js. Check the <script> order in index.html.");
        return;
    }
    const shown = list || tools;
    document.querySelectorAll("[data-stat='total']").forEach(el => el.textContent = tools.length);
    document.querySelectorAll("[data-stat='categories']").forEach(el => el.textContent = getUsedCategories().length);
}

/*---------------------------------------------------------
    SEARCH
---------------------------------------------------------*/
function bindSearch() {
    if (!searchBox) return;
    searchBox.addEventListener("input", function () {
        currentKeyword = this.value.trim().toLowerCase();
        renderAll();
    });
}

/*---------------------------------------------------------
    SCROLL TO TOP
---------------------------------------------------------*/
function bindScrollTop() {
    if (!scrollTopBtn) return;
    window.addEventListener("scroll", () => {
        scrollTopBtn.classList.toggle("show", window.scrollY > 400);
    });
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/*---------------------------------------------------------
    KEYBOARD SHORTCUTS
---------------------------------------------------------*/
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (searchBox) { searchBox.focus(); searchBox.select(); }
    }
    if (event.key === "Escape" && searchBox) {
        searchBox.value = "";
        currentKeyword = "";
        renderAll();
    }
});

/*---------------------------------------------------------
    CONSOLE SIGNATURE
---------------------------------------------------------*/
console.log(`%c${appConfig.appName} v${appConfig.version}`, "color:#059669;font-size:15px;font-weight:bold;");
console.log(`Developed by ${appConfig.author} — ${tools.length} tools loaded`);
