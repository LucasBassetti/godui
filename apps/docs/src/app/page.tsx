import { MagicButton } from "@godui/components";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import Link from "next/link";
import type { CSSProperties } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { HomeHeader } from "./docs/_components/home-header";
import { MobileMenu } from "./docs/_components/mobile-menu";
import { NullNavTitle } from "./docs/_components/null-nav-title";
import { HeroGrid } from "./hero-grid";

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

// Full-bleed single-column grid (zero-width sidebar/toc columns) so the hero
// spans the viewport, while still rendering inside DocsLayout — that's what
// gives the landing page the exact same mobile nav drawer as the docs pages.
const homeLayoutStyle = {
  gridTemplate: `"sidebar header"
"sidebar main" 1fr / 0 minmax(0, 1fr)`,
} as CSSProperties;

export default function Home() {
  return (
    <>
      <DocsLayout
        tree={source.getPageTree()}
        {...baseOptions()}
        // Desktop sidebar hidden (md:hidden); the mobile drawer is fixed-position
        // and unaffected, so the landing keeps a clean full-bleed hero on desktop
        // while sharing the docs drawer on mobile.
        sidebar={{ collapsible: false, className: "md:hidden" }}
        links={[{ type: "custom", on: "menu", children: <MobileMenu /> }]}
        containerProps={{ className: "min-h-svh", style: homeLayoutStyle }}
        slots={{
          header: HomeHeader,
          navTitle: NullNavTitle,
          searchTrigger: false,
        }}
      >
        <main className="relative flex min-h-svh flex-col [grid-area:main]">
          <HeroGrid />
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
              <span className="font-semibold text-fd-foreground">
                TypeScript
              </span>
              ,{" "}
              <span className="font-semibold text-fd-foreground">
                Tailwind CSS
              </span>
              , <span className="font-semibold text-fd-foreground">Motion</span>
              , and{" "}
              <span className="font-semibold text-fd-foreground">
                shadcn/ui
              </span>
              .
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
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
        </main>
      </DocsLayout>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw script injection.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
