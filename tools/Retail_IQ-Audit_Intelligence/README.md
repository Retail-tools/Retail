# Adding a new tool to Audit HUB Pro

1. Copy this whole `_template` folder, rename the copy to your tool's
   folder name (e.g. `tools/purchase-order-tracker`).
2. Build your tool as `index.html` (+ its own assets) inside that folder.
3. Open `tool.json` and fill it in:

   | Field         | Required | Notes                                                        |
   |---------------|----------|---------------------------------------------------------------|
   | name          | yes      | Shown on the card                                              |
   | description   | yes      | One or two sentences                                           |
   | category      | yes      | audit / finance / gst / inventory / warehouse / excel / utilities — or a brand-new one (see below) |
   | icon          | no       | Font Awesome class, e.g. "fa-solid fa-wrench"                  |
   | version       | no       | Defaults to "1.0"                                               |
   | featured      | no       | true to show it in the "Featured Tools" row                    |
   | status        | no       | "active" (default) or "coming-soon"                             |
   | order         | no       | Lower numbers sort first. Leave it out and your tool is just appended alphabetically — existing tools never get renumbered |
   | categoryLabel | no       | Only needed the first time you introduce a brand-new category — its display name |
   | categoryIcon  | no       | Only needed the first time you introduce a brand-new category — its Font Awesome class |

4. From the site's root folder, run:

   ```
   node scripts/build-tools.js
   ```

   (or double-click `build.bat` on Windows / run `./build.sh` on Mac/Linux)

That regenerates `data/tools.js` — your tool's card, its category tab,
the stats count, and its footer link all appear with no further editing.

This `_template` folder itself is ignored by the build script (folders
starting with `_` never show up on the live site), so it's safe to leave
here as a copyable starting point.
