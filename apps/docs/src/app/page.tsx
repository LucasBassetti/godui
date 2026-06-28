"use client";

import { MagicButton } from "@godui/components";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { DocsHeader } from "./docs/_components/docs-header";

const SITE_URL = "https://godui.design";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "GodUI — UI Collection for Modern Interfaces",
      description:
        "An open-source collection of beautifully crafted motion components built with React, TypeScript, Tailwind CSS, Motion, and shadcn/ui.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function Home() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle parallax: nudge the grid a few px toward the pointer.
    const STRENGTH = 12; // max px offset in each axis
    let frame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        if (gridRef.current) {
          gridRef.current.style.transform = `translate3d(${x * STRENGTH}px, ${y * STRENGTH}px, 0) scale(1.04)`;
        }
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main className="relative flex min-h-svh flex-col">
      {/* Dashed Center Fade Grid */}
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0 z-0 transition-transform duration-300 ease-out [transition-property:transform] will-change-transform"
        // Initial scale keeps the grid covering the viewport while it parallaxes.
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-fd-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-fd-border) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
            repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
            radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)
          `,
          WebkitMaskImage: `
            repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
            radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)
          `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
          transform: "translate3d(0, 0, 0) scale(1.04)",
        }}
      />
      <DocsHeader
        className="mx-auto w-full max-w-[90rem] border-transparent"
        showSidebarTrigger={false}
        showScrollBorder={false}
      />
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
        <a
          href="https://github.com/LucasBassetti/godui"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-full border bg-fd-card px-3 py-1 font-medium text-fd-muted-foreground text-xs transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-fd-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-fd-primary" />
          </span>
          Actively building — star us on GitHub
        </a>
        <h1 className="max-w-3xl text-balance font-semibold text-4xl text-fd-foreground tracking-tight sm:text-5xl md:text-6xl">
          UI Collection for Modern Interfaces
        </h1>
        <p className="max-w-md text-balance text-fd-muted-foreground text-sm sm:text-base">
          An open-source collection of beautifully crafted motion components
          built with{" "}
          <span className="font-semibold text-fd-foreground">React</span>,{" "}
          <span className="font-semibold text-fd-foreground">TypeScript</span>,{" "}
          <span className="font-semibold text-fd-foreground">Tailwind CSS</span>
          , <span className="font-semibold text-fd-foreground">Motion</span>,
          and{" "}
          <span className="font-semibold text-fd-foreground">shadcn/ui</span>.
        </p>
        <Link href="/docs/components" className="inline-block">
          <MagicButton size="lg" tabIndex={-1}>
            Browse Components
          </MagicButton>
        </Link>
      </section>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw script injection.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
