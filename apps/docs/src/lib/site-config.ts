/**
 * Single source of truth for site identity + social links. Previously these
 * were duplicated inline across layout.tsx, page.tsx and docs-header.tsx.
 */
export const siteConfig = {
  name: "GodUI",
  url: "https://godui.design",
  description:
    "An open-source collection of beautifully crafted motion components built with React, TypeScript, Tailwind CSS, Motion, and shadcn/ui.",
  github: "https://github.com/LucasBassetti/godui",
  x: "https://x.com/LucasBassetti",
  xHandle: "@LucasBassetti",
  // Keep in sync with the card-previews registry
  // (apps/docs/src/components/card-previews/registry.tsx) and the component
  // category folders under content/docs/components/. Hardcoded so the marketing
  // sections don't pull the client-only previews bundle just to read a count.
  componentCount: 107,
  categoryCount: 12,
} as const;
