"use client";

import { Stepper } from "@godui/components";
import * as React from "react";

const steps = [
  { label: "Account", description: "Email & password" },
  { label: "Profile", description: "Name & avatar" },
  { label: "Workspace", description: "Invite your team" },
  { label: "Done", description: "All set" },
];

const btn =
  "rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40";

export function StepperInteractiveDemo() {
  const [active, setActive] = React.useState(1);
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-8">
      <Stepper steps={steps} active={active} />
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={btn}
          disabled={active === 0}
          onClick={() => setActive((s) => Math.max(0, s - 1))}
        >
          Back
        </button>
        <button
          type="button"
          className={`${btn} border-primary bg-primary text-primary-foreground hover:bg-primary/90`}
          disabled={active === steps.length}
          onClick={() => setActive((s) => Math.min(steps.length, s + 1))}
        >
          {active >= steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
