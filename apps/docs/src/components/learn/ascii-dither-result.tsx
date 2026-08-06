"use client";

import { AsciiDither } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

const PORTRAIT =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=512&h=640&fit=crop&q=80";

function Demo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="aspect-[4/5] w-full max-w-[18rem] overflow-hidden rounded-xl border border-fd-border bg-fd-card">
        <AsciiDither
          src={PORTRAIT}
          alt="Headphones rendered as ASCII"
          cellSize={4}
          contrast={1.4}
          color="theme"
          interactive
        />
      </div>
    </div>
  );
}

/**
 * Closing "here's the finished thing" panel — the real component: a photo as
 * ASCII (hover to sweep the lens).
 */
export function AsciiDitherResult() {
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center p-6">
        <Demo />
      </div>
    );

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover the ASCII to sweep the lens
        </span>
      </div>
      <div className="flex min-h-[240px] w-full items-center justify-center p-10">
        <Demo />
      </div>
    </div>
  );
}
