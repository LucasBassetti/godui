// Generates apps/docs/public/r/index.json — a lightweight catalog the GodUI MCP
// server (@godui/mcp) fetches to power list/search. Source of truth is the root
// registry.json (names/titles/descriptions/deps); categories come from the docs
// sidebar config (meta.json). Run via `pnpm build:registry`.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");

const registry = JSON.parse(
  readFileSync(resolve(repoRoot, "registry.json"), "utf8"),
);
const meta = JSON.parse(
  readFileSync(resolve(repoRoot, "apps/docs/content/docs/meta.json"), "utf8"),
);

// Build component-name -> category from the meta.json sidebar. Entries look like
// "---Buttons---" (a group header) followed by "components/buttons/magic-button".
const categoryByName = {};
let currentCategory = null;
for (const entry of meta.pages) {
  const header = /^---(.+)---$/.exec(entry);
  if (header) {
    currentCategory = header[1].trim();
    continue;
  }
  const match = /^components\/[^/]+\/(.+)$/.exec(entry);
  if (match && currentCategory) {
    categoryByName[match[1]] = currentCategory;
  }
}

const components = registry.items
  .filter((item) => item.type !== "registry:theme")
  .map((item) => ({
    name: item.name,
    title: item.title ?? item.name,
    description: item.description ?? "",
    category: categoryByName[item.name] ?? "Components",
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    install: `npx shadcn@latest add @godui/${item.name}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const index = {
  name: registry.name,
  homepage: registry.homepage,
  generatedAt: new Date().toISOString(),
  components,
};

const outPath = resolve(repoRoot, "apps/docs/public/r/index.json");
writeFileSync(outPath, `${JSON.stringify(index, null, 2)}\n`);

console.log(`Wrote ${components.length} components to ${outPath}`);
