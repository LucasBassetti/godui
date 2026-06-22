"use client";

import { MagicButton } from "@godui/components";
import { useRouter } from "next/navigation";
import { DocsHeader } from "./docs/_components/docs-header";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-svh flex-col">
      {/* Rainbow Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(125% 125% at 50% 10%, var(--color-fd-background) 40%, transparent 100%),
            linear-gradient(to right, var(--rainbow-1), var(--rainbow-2), var(--rainbow-3), var(--rainbow-4), var(--rainbow-5))
          `,
        }}
      />
      {/* Dashed Center Fade Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
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
        }}
      />
      <DocsHeader className="border-transparent" showSidebarTrigger={false} />
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
        <h1 className="max-w-3xl text-balance font-semibold text-4xl text-fd-foreground tracking-tight sm:text-5xl md:text-6xl">
          UI collection for Design Engineers
        </h1>
        <p className="max-w-md text-balance text-fd-muted-foreground text-sm sm:text-base">
          Collection of open-source animated components built with{" "}
          <span className="font-semibold text-fd-foreground">React</span>,{" "}
          <span className="font-semibold text-fd-foreground">TypeScript</span>,{" "}
          <span className="font-semibold text-fd-foreground">Tailwind CSS</span>
          , and <span className="font-semibold text-fd-foreground">Motion</span>
          . Beautiful motion, built for{" "}
          <span className="font-semibold text-fd-foreground">shadcn/ui</span>.
        </p>
        <MagicButton size="lg" onClick={() => router.push("/docs/components")}>
          Browse Components
        </MagicButton>
      </section>
    </main>
  );
}
