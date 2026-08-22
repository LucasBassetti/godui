// Generates apps/docs/public/r/index.json — a lightweight catalog the GodUI MCP
// server (@godui/mcp) fetches to power list/search. Static items come from the
// root registry.json; dynamic background items come from the shared background
// catalog. Categories come from the docs sidebar config (meta.json). Run via
// `pnpm build:registry`.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");

const registry = JSON.parse(
  readFileSync(resolve(repoRoot, "registry.json"), "utf8"),
);
const backgroundCatalog = JSON.parse(
  readFileSync(
    resolve(repoRoot, "packages/components/src/lib/background-catalog.json"),
    "utf8",
  ),
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

const toCatalogItem = (
  item,
  install = `npx shadcn@latest add @godui/${item.name}`,
) => ({
  name: item.name,
  title: item.title ?? item.name,
  description: item.description ?? "",
  category: categoryByName[item.name] ?? "Components",
  dependencies: item.dependencies ?? [],
  registryDependencies: item.registryDependencies ?? [],
  install,
});

const staticComponents = registry.items
  .filter((item) => item.type !== "registry:theme")
  .map((item) => toCatalogItem(item));

const dynamicBackgroundComponents = Object.entries(backgroundCatalog).map(
  ([name, item]) =>
    toCatalogItem(
      { name, ...item },
      `npx shadcn@latest add "https://godui.design/r/${name}.json"`,
    ),
);

// Keep one entry per name if a dynamic item is later promoted into the static
// registry. The dynamic route remains the source of truth for these items.
const components = [
  ...new Map(
    [...staticComponents, ...dynamicBackgroundComponents].map((item) => [
      item.name,
      item,
    ]),
  ).values(),
].sort((a, b) => a.name.localeCompare(b.name));

const index = {
  name: registry.name,
  homepage: registry.homepage,
  generatedAt: new Date().toISOString(),
  components,
};

function stringifyIndex(value) {
  const pretty = JSON.stringify(value, null, 2);
  // Keep the generated artifact compatible with Biome's compact formatting for
  // the short string arrays in each catalog entry.
  return pretty.replace(
    /("(?:dependencies|registryDependencies)": )\[\n((?:\s+"(?:[^"\\]|\\.)*",?\n)+)\s+\]/g,
    (_, prefix, values) =>
      `${prefix}[${values
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" ")}]`,
  );
}

const outPath = resolve(repoRoot, "apps/docs/public/r/index.json");
writeFileSync(outPath, `${stringifyIndex(index)}\n`);

console.log(`Wrote ${components.length} components to ${outPath}`);
