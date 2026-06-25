"use client";

import { MagicButton } from "@godui/components";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { DocsHeader } from "./docs/_components/docs-header";

const SITE_URL = "https://godui.design";

/**
 * FAQ entries power both the visible Q&A section and the FAQPage JSON-LD.
 * `answerText` is the plain-text version schema.org requires (no markup).
 */
const FAQ_ITEMS: { question: string; answer: ReactNode; answerText: string }[] =
  [
    {
      question: "What is GodUI?",
      answer:
        "GodUI is an open-source collection of animated UI components for React. Copy and paste them into your app, or install them through the shadcn CLI.",
      answerText:
        "GodUI is an open-source collection of animated UI components for React. Copy and paste them into your app, or install them through the shadcn CLI.",
    },
    {
      question: "Is GodUI free to use?",
      answer:
        "Yes. GodUI is fully open-source and free to use in both personal and commercial projects.",
      answerText:
        "Yes. GodUI is fully open-source and free to use in both personal and commercial projects.",
    },
    {
      question: "What is GodUI built with?",
      answer: (
        <ul className="list-disc space-y-1 ps-5">
          <li>React</li>
          <li>TypeScript</li>
          <li>Tailwind CSS v4</li>
          <li>Motion</li>
        </ul>
      ),
      answerText:
        "GodUI components are built with React, TypeScript, Tailwind CSS v4, and Motion.",
    },
    {
      question: "Does GodUI work with shadcn/ui?",
      answer:
        "Yes. Every component ships through a shadcn-compatible registry, so you can drop it into any shadcn/ui project with the shadcn CLI.",
      answerText:
        "Yes. Every component ships through a shadcn-compatible registry, so you can drop it into any shadcn/ui project with the shadcn CLI.",
    },
    {
      question: "How do I install a GodUI component?",
      answer:
        'Run the command shown on each component page, e.g. npx shadcn@latest add "https://godui.design/r/<component>.json".',
      answerText:
        'Run the shadcn add command shown on each component page, e.g. npx shadcn@latest add "https://godui.design/r/<component>.json".',
    },
  ];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "GodUI — Animated React UI Components for Design Engineers",
      description:
        "GodUI is an open-source collection of animated UI components for React, built with TypeScript, Tailwind CSS, and Motion.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answerText },
      })),
    },
  ],
};

// Shared easing for the accordion: a fast-out, settle-in curve. One curve for
// height, chevron, and content keeps the motion reading as a single gesture.
const FAQ_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function Home() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<string | null>(FAQ_ITEMS[0].question);

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
      <section
        id="faq"
        className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-8 pb-24"
      >
        <h2 className="mb-8 text-center font-semibold text-2xl text-fd-foreground tracking-tight sm:text-3xl">
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => {
            const open = openFaq === item.question;
            const panelId = `faq-panel-${item.question.replace(/\W+/g, "-")}`;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-xl border bg-fd-card/50"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenFaq(open ? null : item.question)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-start font-medium text-fd-foreground transition-colors duration-200 hover:bg-fd-accent/30"
                >
                  <span>{item.question}</span>
                  {/* TW v4 emits `rotate` as its own property, so animate that
                      longhand — `transition-transform` would never fire. */}
                  <ChevronDown
                    className="size-4 shrink-0 text-fd-muted-foreground transition-[rotate] duration-300 will-change-transform motion-reduce:transition-none"
                    style={{
                      rotate: open ? "180deg" : "0deg",
                      transitionTimingFunction: FAQ_EASE,
                    }}
                  />
                </button>
                {/* grid 0fr→1fr animates height while keeping the answer in the
                    DOM at all times — required for the FAQ to stay crawlable. */}
                <div
                  id={panelId}
                  className="grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none"
                  style={{
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transitionTimingFunction: FAQ_EASE,
                  }}
                >
                  <div className="overflow-hidden">
                    <div
                      className="px-5 pb-5 text-fd-muted-foreground text-sm transition-[opacity,translate] duration-300 motion-reduce:transition-none"
                      style={{
                        opacity: open ? 1 : 0,
                        translate: open ? "0 0" : "0 -0.25rem",
                        transitionTimingFunction: FAQ_EASE,
                      }}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
