"use client";

import { SplitFlapDisplay } from "@godui/components";
import { useEffect, useState } from "react";
import { useBareScene } from "@/components/learn/bare-scene-context";

const WORDS = ["ARRIVALS", "BOARDING", "ON TIME", "DELAYED", "GODUI"];

function Demo() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <SplitFlapDisplay value={WORDS[i]} length={8} align="center" size="md" />
  );
}

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * SplitFlapDisplay, cycling a departure board through the charset.
 */
export function SplitFlapResult() {
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
          the real component — it re-flips whenever the value changes
        </span>
      </div>
      <div className="flex min-h-[240px] w-full items-center justify-center p-10">
        <Demo />
      </div>
    </div>
  );
}
