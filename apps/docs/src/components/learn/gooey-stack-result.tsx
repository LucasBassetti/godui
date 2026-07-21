"use client";

import { GooeyStack } from "@godui/components";
import * as React from "react";

function GitHubMark() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-foreground text-background">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
        aria-hidden="true"
      >
        <title>GitHub</title>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    </span>
  );
}

function ConnectorCard({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <GitHubMark />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">MCP Connector</p>
        <p className="text-sm font-semibold text-foreground">GitHub</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-sm font-medium text-muted-foreground [transition:color_150ms] hover:text-foreground"
      >
        Skip
      </button>
      <button
        type="button"
        onClick={onClose}
        className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary [transition:background_150ms] hover:bg-primary/15"
      >
        Connect
      </button>
    </div>
  );
}

function PromptCard({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative h-36 px-5 py-4">
      <textarea
        aria-label="Ask anything"
        placeholder="Tap the plug to connect a source and watch it merge in…"
        className="h-16 w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <div className="absolute right-4 bottom-4 flex items-center gap-2">
        <button
          type="button"
          aria-label="Connect a source"
          aria-pressed={open}
          onClick={onToggle}
          className={`grid size-8 place-items-center rounded-full border [transition:background_150ms,border-color_150ms,color_150ms] ${
            open
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
          >
            <path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Send"
          className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground [transition:background_150ms] hover:bg-accent"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * Closing "here's the finished thing" panel — the real, interactive Gooey
 * Stack. Tap the plug to watch the prompt card merge in and split back out.
 */
export function GooeyStackResult() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — tap the plug icon
        </span>
      </div>
      <div className="relative flex min-h-[300px] items-center justify-center p-6 md:min-h-[360px] md:p-10">
        <div className="w-full max-w-[26rem]">
          <GooeyStack collapsed={!open}>
            <ConnectorCard onClose={() => setOpen(false)} />
            <PromptCard open={open} onToggle={() => setOpen((o) => !o)} />
          </GooeyStack>
        </div>
      </div>
    </div>
  );
}
