# Audit-Hub

AI-powered tools for retail operations, inventory audits, reporting, and business calculations.

## Adding a new tool

The tool grid, stats, category tabs and footer links are all generated —
you never hand-edit `data/tools.js` directly.

1. Copy `tools/_template` to a new folder, e.g. `tools/purchase-order-tracker`.
2. Build your tool as `index.html` inside that folder.
3. Fill in its `tool.json` (see `tools/_template/README.md` for the full field list).
4. Run:
   ```
   node scripts/build-tools.js
   ```
   or double-click `build.bat` (Windows) / run `./build.sh` (Mac/Linux).

That's it — the new tool appears on the site with no further editing.
Requires [Node.js](https://nodejs.org) to be installed to run the build script.
