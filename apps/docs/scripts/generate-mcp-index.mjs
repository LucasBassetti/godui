// Generates apps/docs/public/r/index.json and manifest.json — the catalog and
// integrity metadata the GodUI MCP server (@godui/mcp) fetches to power
// list/search. Source of truth is the root registry.json
// (names/titles/descriptions/deps); categories come from the docs sidebar
// config (meta.json). Run via `pnpm build:registry`.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");

function getSourceRevision() {
  const configured = [
    process.env.GITHUB_SHA,
    process.env.VERCEL_GIT_COMMIT_SHA,
  ].find((value) => value?.trim());
  if (configured) return configured.trim();

  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
  } catch {
    return "unknown";
  }
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

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
  // The revision makes this live catalog auditable and lets consumers pin an
  // immutable snapshot when freshness is less important than reproducibility.
  revision: getSourceRevision(),
  components,
};

const outputDir = resolve(repoRoot, "apps/docs/public/r");
const indexPath = resolve(outputDir, "index.json");
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

// Registry JSON is checked in and served as-is. Normalize it before recording
// digests so a build and the deployed bytes cannot drift due to formatting.
execFileSync("pnpm", ["exec", "biome", "format", "--write", outputDir], {
  cwd: repoRoot,
  stdio: "inherit",
});

const files = { "index.json": sha256(indexPath) };
for (const component of components) {
  const fileName = `${component.name}.json`;
  const filePath = resolve(outputDir, fileName);
  files[fileName] = sha256(filePath);
}

const manifestPath = resolve(outputDir, "manifest.json");
writeFileSync(
  manifestPath,
  `${JSON.stringify(
    {
      version: 1,
      revision: index.revision,
      algorithm: "sha256",
      files,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `Wrote ${components.length} components, index, and integrity manifest to ${outputDir}`,
);
