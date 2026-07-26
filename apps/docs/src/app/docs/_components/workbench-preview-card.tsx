"use client";

import Link from "fumadocs-core/link";
import { useState } from "react";
import { cardPreviews } from "@/components/card-previews/registry";
import { cn } from "@/lib/cn";

/**
 * Sticky "back to the component" card in the Learn route's table of contents.
 *
 * Learn articles are long reads about a component you can't see from them, so
 * the TOC carries a live miniature of it and a way back to the workbench. It
 * reuses the index page's preview registry, so there's no second artwork to
 * maintain and no re-render of the component's own MDX.
 */
export function WorkbenchPreviewCard({
  slug,
  href,
  title,
}: {
  slug: string;
  href: string;
  title: string;
}) {
  const Preview = cardPreviews[slug];
  const [play, setPlay] = useState(false);

  return (
    <div
      onPointerEnter={() => setPlay(true)}
      onPointerLeave={() => setPlay(false)}
      className="group relative mt-6 overflow-hidden rounded-2xl border border-fd-border bg-fd-card transition-colors hover:bg-fd-accent/40"
    >
      {Preview ? (
        <div
          data-play={play}
          aria-hidden
          className={cn(
            "preview-zone pointer-events-none relative flex h-[104px] items-center justify-center overflow-hidden border-fd-border border-b bg-[radial-gradient(oklch(0.7_0_0/0.12)_1px,transparent_1px)] [background-size:16px_16px]",
            // Calm until hovered — a sidebar that animates while you read is noise.
            "data-[play=false]:[&_*]:![animation-play-state:paused] motion-reduce:[&_*]:![animation-play-state:paused]",
          )}
        >
          <Preview play={play} />
        </div>
      ) : null}
      <div className="p-3.5">
        <p className="font-semibold text-[13.5px] text-fd-foreground">
          {title}
        </p>
        <Link
          href={href}
          className="mt-1.5 inline-flex items-center gap-1.5 font-semibold text-[12.5px] text-fd-primary transition-opacity after:absolute after:inset-0 after:content-[''] hover:opacity-80"
        >
          Open the workbench
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Arrow</title>
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
