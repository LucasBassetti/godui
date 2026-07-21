"use client";

import { SourceCitation, SourceList } from "@godui/components";

/**
 * Same source set as the component's docs demo, extended to five entries so
 * the real `SourceList` "+2 more" toggle — not just the inline pills — is on
 * screen. Closing "here's the finished thing" panel: hover a pill, tab to
 * one, or open the collapsed rows below.
 */
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
  {
    title: "Framer Motion — AnimatePresence",
    url: "https://motion.dev/docs/react-animate-presence",
    snippet: "Animating components as they mount and unmount.",
  },
  {
    title: "MDN — prefers-reduced-motion",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion",
    snippet: "Detecting a user's request for less motion on the web.",
  },
];

export function SourceCitationsResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          hover or tab to a pill · open the collapsed rows
        </span>
      </div>
      <div className="flex min-h-[320px] w-full items-center justify-center p-10">
        <div className="w-full max-w-lg">
          <p className="text-sm leading-7 text-foreground">
            Modern design systems standardize on OKLCH for perceptually uniform
            theming
            <SourceCitation index={1} source={sources[0]} />, and Tailwind v4
            ships a CSS-first config that makes tokens first-class
            <SourceCitation index={2} source={sources[1]} />. Motion is now
            treated as a core craft, not a finishing touch
            <SourceCitation index={3} source={sources[2]} />.
          </p>
          <div className="mt-4 border-t border-border pt-4">
            <SourceList sources={sources} />
          </div>
        </div>
      </div>
    </div>
  );
}
