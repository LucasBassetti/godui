// Pure tool implementations — kept free of MCP wiring so they can be unit
// tested directly. Each returns a plain string rendered to the agent.

import type {
  CatalogComponent,
  RegistryClient,
  RegistryItem,
} from "./registry-client.js";

function formatCatalogLine(c: CatalogComponent): string {
  return `- ${c.name} — ${c.title}: ${c.description} [${c.category}]`;
}

/** List the full catalog, optionally filtered to a single category. */
export async function listComponents(
  client: RegistryClient,
  category?: string,
): Promise<string> {
  const index = await client.getIndex();
  let components = index.components;

  if (category) {
    const wanted = category.toLowerCase();
    components = components.filter((c) => c.category.toLowerCase() === wanted);
    if (components.length === 0) {
      const categories = [...new Set(index.components.map((c) => c.category))]
        .sort()
        .join(", ");
      return `No GodUI components found in category "${category}". Available categories: ${categories}.`;
    }
  }

  const header = category
    ? `GodUI components in "${category}" (${components.length}):`
    : `GodUI components (${components.length}). Install any with: npx shadcn@latest add @godui/<name>`;

  return `${header}\n${components.map(formatCatalogLine).join("\n")}`;
}

function scoreMatch(c: CatalogComponent, terms: string[]): number {
  const haystack =
    `${c.name} ${c.title} ${c.description} ${c.category}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (!haystack.includes(term)) continue;
    score += 1;
    if (c.name.toLowerCase().includes(term)) score += 2;
    if (c.title.toLowerCase().includes(term)) score += 1;
  }
  return score;
}

/** Rank catalog entries against a free-text query. */
export async function searchComponents(
  client: RegistryClient,
  query: string,
): Promise<string> {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const index = await client.getIndex();
  if (terms.length === 0) {
    return listComponents(client);
  }

  const ranked = index.components
    .map((c) => ({ c, score: scoreMatch(c, terms) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.c.name.localeCompare(b.c.name))
    .slice(0, 10);

  if (ranked.length === 0) {
    return `No GodUI components matched "${query}". Use list_components to browse the full catalog.`;
  }

  return `GodUI components matching "${query}":\n${ranked
    .map((r) => formatCatalogLine(r.c))
    .join(
      "\n",
    )}\n\nUse get_component with a name above to fetch its source and install command.`;
}

function renderRecord(label: string, record?: Record<string, unknown>): string {
  if (!record || Object.keys(record).length === 0) return "";
  return `\n## ${label}\n\n\`\`\`json\n${JSON.stringify(record, null, 2)}\n\`\`\``;
}

/** Full component payload: metadata, install command, and source files. */
export async function getComponent(
  client: RegistryClient,
  name: string,
  variant?: string,
): Promise<string> {
  const slug = name.trim().replace(/^@godui\//, "");
  let item: RegistryItem;
  try {
    item = await client.getComponent(slug, variant);
  } catch (error) {
    return `Could not load GodUI component "${slug}": ${
      error instanceof Error ? error.message : String(error)
    }\nUse list_components or search_components to find a valid name.`;
  }

  const installTarget = variant
    ? `"https://godui.design/r/${slug}.json?variant=${variant}"`
    : `@godui/${slug}`;

  const parts: string[] = [
    `# ${item.title ?? slug}`,
    "",
    item.description ?? "",
    "",
    "## Install",
    "",
    "```bash",
    `npx shadcn@latest add ${installTarget}`,
    "```",
    "",
    "This copies the source into `components/godui/` and merges GodUI theme tokens + styles into your global stylesheet automatically.",
  ];

  if (item.dependencies?.length) {
    parts.push("", `**npm dependencies:** ${item.dependencies.join(", ")}`);
  }
  if (item.registryDependencies?.length) {
    parts.push(
      "",
      `**Registry dependencies:** ${item.registryDependencies.join(", ")}`,
    );
  }

  for (const file of item.files ?? []) {
    parts.push(
      "",
      `## Source — \`${file.target ?? file.path}\``,
      "",
      "```tsx",
      file.content ?? "(source not inlined — install via the command above)",
      "```",
    );
  }

  parts.push(renderRecord("CSS variables", item.cssVars));
  parts.push(renderRecord("CSS", item.css));

  return parts
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
