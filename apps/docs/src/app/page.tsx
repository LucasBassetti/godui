"use client";

import { MagicButton } from "@godui/components";
import { useRouter } from "next/navigation";
import { DocsHeader } from "./docs/_components/docs-header";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-svh flex-col">
      <DocsHeader />
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
        <h1 className="max-w-3xl text-balance font-semibold text-4xl text-fd-foreground tracking-tight sm:text-5xl md:text-6xl">
          UI collection for Design Engineers
        </h1>
        <MagicButton
          size="lg"
          onClick={() => router.push("/docs/installation")}
        >
          Browse Components
        </MagicButton>
      </section>
    </main>
  );
}
