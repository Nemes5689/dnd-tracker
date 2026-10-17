# Local Watabou generators

The Generator page loads browser builds from `public/generators/watabou/`.
All six tools and their assets are bundled into web and Electron builds. The
local app/server must be running; this does not add offline caching of the
entire hosted tracker website.

The files were retrieved from https://watabou.github.io/ for personal offline
use. They remain the work of Oleg Dolya / Watabou. These are compiled browser
builds, not the generators' source code. See the upstream FAQ at
https://watabou.github.io/faq.html: permission to use generated maps does not
constitute a redistribution license for the generator software. Obtain the
author's permission before distributing these copies or publishing them as
part of a hosted app. The older GPL city generator is a separate project at
https://github.com/watabou/TownGeneratorOS.

`public/generators/watabou/manifest.json` records download time, original URLs,
file sizes and SHA-256 hashes. Upstream copyright and library notices are
preserved. The city build's three Armoria request methods are disabled: coats
of arms require an external API and are unavailable offline. Local HTML omits
analytics and legacy font formats; font declarations
whose TrueType files return 404 upstream are removed so the browser can fall
back to available fonts. The local index is an app-provided tool picker.

To refresh the personal copies, run `node scripts/download-generators.mjs`
with an internet connection. A failed refresh must be resolved before packaging;
it can leave a partial set of updated files. Export maps using each generator's
own controls before switching tools. The trusted local browser builds run in
frames with same-origin access so OpenFL can load its local assets.
