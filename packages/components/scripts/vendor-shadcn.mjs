// Fetches shadcn/ui new-york-v4 registry sources into test/shadcn/ so parity
// tests can render the real upstream component next to GodUI's. Rewrites the
// registry-internal imports to this package's aliases; content otherwise verbatim.
// Usage: node packages/components/scripts/vendor-shadcn.mjs button dialog …
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NAMES = process.argv.slice(2);
const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "test",
  "shadcn",
);
mkdirSync(out, { recursive: true });
for (const name of NAMES) {
  const res = await fetch(
    `https://ui.shadcn.com/r/styles/new-york-v4/${name}.json`,
  );
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const item = await res.json();
  const file = item.files.find((f) => f.type === "registry:ui");
  const content = file.content
    .replace(/from "cn"/g, 'from "@/lib/utils"')
    .replace(/@\/registry\/new-york-v4\/ui\//g, "./");
  writeFileSync(
    join(out, `${name}.tsx`),
    `// Vendored from https://ui.shadcn.com/r/styles/new-york-v4/${name}.json (2026-10-01).\n// Reference for parity tests only — do not edit; re-run scripts/vendor-shadcn.mjs.\n${content}`,
  );
  console.log(`vendored ${name}`);
}
