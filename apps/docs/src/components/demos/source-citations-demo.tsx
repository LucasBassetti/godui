"use client";

import { SourceCitation, SourceList } from "@godui/components";

const sources = [
  {
    title: "GodUI — motion components for modern interfaces",
    url: "https://github.com/LucasBassetti/godui",
    snippet:
      "Beautifully crafted motion components with OKLCH theming, built for perceptually uniform design tokens and dark mode.",
  },
  {
    title: "Tailwind CSS v4 release notes",
    url: "https://tailwindcss.com/blog/tailwindcss-v4",
    snippet:
      "A ground-up rewrite with a CSS-first config, native cascade layers, and faster builds.",
  },
  {
    title: "Great animations — Emil Kowalski",
    url: "https://emilkowal.ski/ui/great-animations",
    snippet: "What separates polished motion from distracting motion.",
  },
];

export function SourceCitationsDemo() {
  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm leading-7 text-foreground">
        Modern design systems standardize on OKLCH for perceptually uniform
        theming
        <SourceCitation index={1} source={sources[0]} />, and Tailwind v4 ships
        a CSS-first config that makes tokens first-class
        <SourceCitation index={2} source={sources[1]} />. Motion is now treated
        as a core craft, not a finishing touch
        <SourceCitation index={3} source={sources[2]} />.
      </p>
      <div className="mt-4 border-t border-border pt-4">
        <SourceList sources={sources} collapsible={false} />
      </div>
    </div>
  );
}
