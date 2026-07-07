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
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/docs/components" className="inline-block">
            <MagicButton size="lg" tabIndex={-1}>
              Browse Components
            </MagicButton>
          </Link>
          <a
            href="https://github.com/LucasBassetti/godui"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-block"
          >
            <MagicButton
              size="lg"
              variant="secondary"
              rainbow={false}
              tabIndex={-1}
            >
              <span className="inline-flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                Star on GitHub
              </span>
            </MagicButton>
          </a>
        </div>
      </section>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw script injection.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
