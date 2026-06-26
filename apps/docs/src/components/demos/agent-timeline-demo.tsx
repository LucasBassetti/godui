"use client";

import { AgentStep, AgentTimeline, type StepStatus } from "@godui/components";
import { useEffect, useState } from "react";

const STEPS: { title: string; meta?: string; body?: string }[] = [
  {
    title: "Read the repository",
    meta: "0.4s",
    body: "Indexed 128 files across 6 packages.",
  },
  {
    title: "Search for the failing test",
    meta: "1.1s",
    body: 'grep "token expiry" → src/auth/middleware.ts:42',
  },
  {
    title: "Edit auth-middleware.ts",
    meta: "0.3s",
    body: "Changed the expiry check from `<` to `<=`.",
  },
  { title: "Run the test suite", meta: "3.2s", body: "42 passed, 0 failed." },
];

export function AgentTimelineDemo() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (active >= STEPS.length) return;
    const id = setTimeout(() => setActive((a) => a + 1), 1400);
    return () => clearTimeout(id);
  }, [active]);

  const statusFor = (i: number): StepStatus =>
    i < active ? "success" : i === active ? "running" : "pending";

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Agent run</span>
        <button
          type="button"
          onClick={() => setActive(0)}
          className="rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-accent"
        >
          Replay
        </button>
      </div>
      <AgentTimeline>
        {STEPS.map((step, i) => (
          <AgentStep
            key={step.title}
            status={statusFor(i)}
            title={step.title}
            meta={statusFor(i) === "pending" ? undefined : step.meta}
            defaultOpen={i === active}
            last={i === STEPS.length - 1}
          >
            {step.body}
          </AgentStep>
        ))}
      </AgentTimeline>
    </div>
  );
}
