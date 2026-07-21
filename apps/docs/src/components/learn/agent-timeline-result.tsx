"use client";

import { AgentStep, AgentTimeline, type StepStatus } from "@godui/components";
import * as React from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `AgentTimeline` advancing through a run on its own clock. Click a step
 * with a body to morph it open; hit replay to watch the connectors spring-
 * fill from the top again.
 */
const STEPS: { title: string; meta: string; body?: string }[] = [
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

export function AgentTimelineResult() {
  const [active, setActive] = React.useState(0);
  const [run, setRun] = React.useState(0);

  React.useEffect(() => {
    if (active >= STEPS.length) return;
    const id = setTimeout(() => setActive((a) => a + 1), 1400);
    return () => clearTimeout(id);
  }, [active]);

  const statusFor = (i: number): StepStatus =>
    i < active ? "success" : i === active ? "running" : "pending";

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — advancing on its own
        </span>
        <button
          type="button"
          onClick={() => {
            setActive(0);
            setRun((r) => r + 1);
          }}
          aria-label="Replay run"
          title="Replay"
          className="ms-auto inline-flex size-8 items-center justify-center rounded-[10px] border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:text-fd-foreground active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
      <div className="flex min-h-[280px] items-center justify-center p-6 md:p-10">
        <div key={run} className="w-full max-w-md">
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
      </div>
    </div>
  );
}
