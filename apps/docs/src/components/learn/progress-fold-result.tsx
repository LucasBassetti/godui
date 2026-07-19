"use client";

import { ProgressFoldButton } from "@godui/components";
import * as React from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * Progress Fold Button. Left one is wired up: click it and `status` /
 * `progress` drive a real determinate loading cycle. Right one sits in
 * `status="loading"` with no `progress`, so the bar stays indeterminate.
 */
export function ProgressFoldResult() {
  const [status, setStatus] = React.useState<"idle" | "loading">("idle");
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (status !== "loading") return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return p;
        return Math.min(100, p + 8);
      });
    }, 120);
    return () => clearInterval(id);
  }, [status]);

  React.useEffect(() => {
    if (status === "loading" && progress >= 100) {
      const id = setTimeout(() => {
        setStatus("idle");
        setProgress(0);
      }, 400);
      return () => clearTimeout(id);
    }
  }, [status, progress]);

  const handleClick = () => {
    if (status === "loading") return;
    setProgress(0);
    setStatus("loading");
  };

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — click the left one
        </span>
      </div>
      <div className="flex min-h-[240px] flex-wrap items-center justify-center gap-6 p-10">
        <ProgressFoldButton
          variant="primary"
          status={status}
          progress={status === "loading" ? progress : undefined}
          onClick={handleClick}
        >
          {status === "loading" ? "Submitting…" : "Submit"}
        </ProgressFoldButton>
        <ProgressFoldButton variant="secondary" status="loading">
          Indeterminate
        </ProgressFoldButton>
      </div>
    </div>
  );
}
