"use client";

import { EncryptedCard } from "@godui/components";

export function EncryptedCardDemo() {
  return (
    <div className="flex items-center justify-center">
      <EncryptedCard className="w-[22rem]">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-primary">
                <svg
                  aria-hidden="true"
                  role="img"
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>Key</title>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium leading-tight">
                  Production API key
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  rotated 3 days ago
                </p>
              </div>
            </div>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-primary">
              Live
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2">
            <code className="flex-1 truncate font-mono text-[13px]">
              sk_live_51Nc••••••••4Rf2
            </code>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <svg
                aria-hidden="true"
                role="img"
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Copy</title>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              AES-256-GCM at rest
            </span>
            <span className="font-mono">SOC 2</span>
          </div>
        </div>
      </EncryptedCard>
    </div>
  );
}
