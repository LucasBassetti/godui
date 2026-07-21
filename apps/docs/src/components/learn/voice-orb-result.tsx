"use client";

import { VoiceOrb, type VoiceOrbState } from "@godui/components";
import * as React from "react";

/**
 * Live VoiceOrb with synthetic amplitude — same idea as the docs demo,
 * without the mic path so the Result panel stays self-contained.
 */
const STATES: VoiceOrbState[] = ["idle", "listening", "speaking"];

export function VoiceOrbResult() {
  const [state, setState] = React.useState<VoiceOrbState>("speaking");
  const [amp, setAmp] = React.useState(0);

  React.useEffect(() => {
    if (state === "idle") {
      // Defer to rAF so we never setState synchronously in the effect body.
      const reset = requestAnimationFrame(() => setAmp(0));
      return () => cancelAnimationFrame(reset);
    }
    let raf = 0;
    const loop = () => {
      const t = performance.now() / 1000;
      const base = state === "speaking" ? 0.55 : 0.3;
      setAmp(base + base * Math.sin(t * 6) * Math.sin(t * 1.7));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — switch states
        </span>
      </div>
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-6 p-10">
        <VoiceOrb state={state} amplitude={amp} />
        <div className="flex flex-wrap justify-center gap-2">
          {STATES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setState(s)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${
                state === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-[var(--muted)] text-foreground hover:opacity-80"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
