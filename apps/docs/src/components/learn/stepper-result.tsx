"use client";

import { Stepper } from "@godui/components";
import * as React from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `Stepper`. Walk forward and back and watch the connector spring-fill and
 * each circle morph its number into a checkmark.
 */
const STEPS = [
  { label: "Account", description: "Email & password" },
  { label: "Profile", description: "Name & avatar" },
  { label: "Workspace", description: "Invite your team" },
  { label: "Done", description: "All set" },
];

const buttonClass =
  "rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40";

export function StepperResult() {
  const [active, setActive] = React.useState(1);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — walk it forward and back
        </span>
      </div>
      <div className="relative flex min-h-[280px] flex-col items-center justify-center gap-8 p-6 md:p-10">
        <div className="w-full max-w-xl">
          <Stepper steps={STEPS} active={active} />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={buttonClass}
            disabled={active === 0}
            onClick={() => setActive((s) => Math.max(0, s - 1))}
          >
            Back
          </button>
          <button
            type="button"
            className={`${buttonClass} border-primary bg-primary text-primary-foreground hover:bg-primary/90`}
            disabled={active === STEPS.length}
            onClick={() => setActive((s) => Math.min(STEPS.length, s + 1))}
          >
            {active >= STEPS.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
