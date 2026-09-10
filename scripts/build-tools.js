#!/usr/bin/env node
/*=========================================================
    AUDIT HUB PRO — BUILD SCRIPT

    Regenerates data/tools.js from every tools/<folder>/tool.json
    manifest it finds. Run this after adding, editing, or
    removing a tool folder.

        node scripts/build-tools.js

    To add a new tool to the site:
      1. Create a new folder under tools/ (copy tools/_template
         as a starting point).
      2. Build your tool's index.html inside it.
      3. Fill in tool.json (name, description, category — the
         rest is optional, see tools/_template/tool.json).
      4. Run this script. That's it — the card, the stats, the
         category tab and the footer link all update on their own.

    Developed by Vicky Shaw
=========================================================*/

const fs = require("fs");
const path = require("path");

const ROOT       = path.join(__dirname, "..");
const TOOLS_DIR   = path.join(ROOT, "tools");
const OUTPUT_FILE = path.join(ROOT, "data", "tools.js");

const DEFAULT_CATEGORY_META = {
    audit:     { name: "Audit",     icon: "fa-solid fa-clipboard-check" },
    inventory: { name: "Inventory", icon: "fa-solid fa-boxes-stacked" },
    finance:   { name: "Finance",   icon: "fa-solid fa-indian-rupee-sign" },
    gst:       { name: "GST",       icon: "fa-solid fa-file-invoice" },
    warehouse: { name: "Warehouse", icon: "fa-solid fa-warehouse" },
    excel:     { name: "Excel",     icon: "fa-solid fa-file-excel" },
    utilities: { name: "Utilities", icon: "fa-solid fa-screwdriver-wrench" }
};

function fail(msg) {
    console.error(`\n\u2717 ${msg}\n`);
    process.exit(1);
}

if (!fs.existsSync(TOOLS_DIR)) fail(`Can't find a tools/ folder at ${TOOLS_DIR}`);

const folderNames = fs.readdirSync(TOOLS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => !name.startsWith(".") && !name.startsWith("_")) // "_template" etc. stay off the live site
    .sort((a, b) => a.localeCompare(b));

const categoryMeta = { ...DEFAULT_CATEGORY_META };
const entries = [];
const skipped = [];

folderNames.forEach(folder => {
    const manifestPath = path.join(TOOLS_DIR, folder, "tool.json");
    const indexPath    = path.join(TOOLS_DIR, folder, "index.html");

    if (!fs.existsSync(indexPath)) {
        skipped.push(`${folder}  —  no index.html in this folder yet`);
        return;
    }
    if (!fs.existsSync(manifestPath)) {
        skipped.push(`${folder}  —  no tool.json in this folder yet`);
        return;
    }

    let manifest;
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch (err) {
        skipped.push(`${folder}/tool.json  —  invalid JSON (${err.message})`);
        return;
    }

    if (!manifest.name || !manifest.description || !manifest.category) {
        skipped.push(`${folder}/tool.json  —  needs at least "name", "description" and "category"`);
        return;
    }

    // A brand-new category can define its own label/icon the first time it appears.
    if (manifest.categoryLabel && !categoryMeta[manifest.category]) {
        categoryMeta[manifest.category] = {
            name: manifest.categoryLabel,
            icon: manifest.categoryIcon || "fa-solid fa-layer-group"
        };
    }

    entries.push({
        folder,
        order: typeof manifest.order === "number" ? manifest.order : Infinity,
        name: manifest.name,
        description: manifest.description,
        category: manifest.category,
        icon: manifest.icon || "fa-solid fa-wrench",
        version: manifest.version || "1.0",
        featured: !!manifest.featured,
        status: manifest.status === "coming-soon" ? "coming-soon" : "active"
    });
});

// Tools with an explicit "order" come first (lowest first); anything without
// one is appended afterwards in alphabetical folder-name order. This means
// adding a plain new folder never reshuffles the tools that already exist.
entries.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.folder.localeCompare(b.folder);
});

const tools = entries.map((e, i) => ({
    id: i + 1,
    code: `AH-${String(i + 1).padStart(2, "0")}`,
    name: e.name,
    description: e.description,
    category: e.category,
    folder: e.folder,
    icon: e.icon,
    version: e.version,
    featured: e.featured,
    status: e.status
}));

const toolBlocks = tools.map(t => `    {
        id: ${t.id},
        code: "${t.code}",
        name: ${JSON.stringify(t.name)},
        description: ${JSON.stringify(t.description)},
        category: ${JSON.stringify(t.category)},
        folder: ${JSON.stringify(t.folder)},
        icon: ${JSON.stringify(t.icon)},
        version: ${JSON.stringify(t.version)},
        featured: ${t.featured},
        status: ${JSON.stringify(t.status)}
    }`).join(",\n");

const categoryBlock = Object.entries(categoryMeta)
    .map(([key, meta]) => `    ${key}: { name: ${JSON.stringify(meta.name)}, icon: ${JSON.stringify(meta.icon)} }`)
    .join(",\n");

const output = `/*=========================================================
    AUDIT HUB PRO — TOOL DATABASE
    AUTO-GENERATED by scripts/build-tools.js — do not hand-edit.
    Edit tools/<folder>/tool.json instead, then run:
        node scripts/build-tools.js
    Developed by Vicky Shaw
=========================================================*/

const tools = [
${toolBlocks}
];

/*=========================================================
    CATEGORY LABELS + ICONS
    (used only when that category exists in \`tools\`)
=========================================================*/

const categoryMeta = {
${categoryBlock}
};

/*=========================================================
    HELPER FUNCTIONS
=========================================================*/

function getActiveTools() {
    return tools.filter(tool => tool.status === "active");
}

function getFeaturedTools() {
    return tools.filter(tool => tool.featured);
}

function getToolsByCategory(category) {
    if (category === "all") return tools;
    return tools.filter(tool => tool.category === category);
}

function searchTools(keyword) {
    keyword = keyword.toLowerCase().trim();
    return tools.filter(tool =>
        tool.name.toLowerCase().includes(keyword) ||
        tool.description.toLowerCase().includes(keyword) ||
        tool.category.toLowerCase().includes(keyword) ||
        (tool.code || "").toLowerCase().includes(keyword)
    );
}

function getToolURL(tool) {
    return \`tools/\${tool.folder}/index.html\`;
}

/* Unique categories actually present in the tool list, in a stable order */
function getUsedCategories() {
    const seen = [];
    tools.forEach(tool => {
        if (!seen.includes(tool.category)) seen.push(tool.category);
    });
    return seen;
}

/*=========================================================
    APP CONFIG
=========================================================*/

const appConfig = {
    appName: "Audit HUB Pro",
    version: "5.0",
    author: "Vicky Shaw",
    defaultCategory: "all",
    searchMinCharacters: 1
};
`;

fs.writeFileSync(OUTPUT_FILE, output);

console.log(`\n\u2713 data/tools.js regenerated — ${tools.length} tool(s) now on the site.\n`);
if (skipped.length) {
    console.log("Not included this time:");
    skipped.forEach(s => console.log(`  - ${s}`));
    console.log("");
}
