"use client";

import { HeroParallax } from "@godui/components";
import * as React from "react";

/**
 * Closing "here's the finished thing" panel — the real Hero Parallax in a
 * framed scrollport. The plane starts at translateY -700 / opacity 0.2, so
 * we seed the scroller ~18% in — past the enter window — so cards are
 * visible immediately; scroll either way to scrub the full effect.
 */
const PRODUCTS = [
  "1015",
  "1016",
  "1018",
  "1019",
  "1024",
  "1025",
  "1027",
  "1035",
  "1036",
  "1039",
  "1043",
  "1044",
  "1047",
  "1050",
  "1051",
].map((id, i) => ({
  title: `Project ${i + 1}`,
  thumbnail: `https://picsum.photos/id/${id}/600/400`,
  href: "#",
}));

const HEADER = (
  <div className="relative mx-auto w-full max-w-3xl px-6 py-10">
    <h2 className="text-2xl font-bold text-foreground md:text-3xl">
      Scroll to drift
    </h2>
    <p className="mt-2 max-w-md text-sm text-muted-foreground">
      Rows spread apart as the plane un-tilts into view.
    </p>
  </div>
);

/** ~18% — plane enter maps over scroll [0, 0.2], so this lands mid-reveal. */
const SEED_PROGRESS = 0.18;

export function HeroParallaxResult() {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const seed = () => {
      const max = el.scrollHeight - el.clientHeight;
      if (max > 0) el.scrollTop = max * SEED_PROGRESS;
    };
    seed();
    // Images can grow scrollHeight after first paint — re-seed once.
    const id = requestAnimationFrame(seed);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll inside this panel
        </span>
      </div>
      <div
        ref={scrollerRef}
        className="relative h-[min(720px,75vh)] overflow-x-hidden overflow-y-auto overscroll-contain"
      >
        <HeroParallax
          products={PRODUCTS}
          header={HEADER}
          scrollContainer={scrollerRef}
        />
      </div>
    </div>
  );
}
