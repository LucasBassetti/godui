"use client";

import { OTPInput } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive OTP Input.
 * Type to feel the auto-advance and traveling caret, paste a code to fill it in
 * one shot, and see the masked variant render dots.
 */
export function OtpResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — type, or paste a code
        </span>
      </div>
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-8 p-10">
        <OTPInput length={6} />
        <OTPInput length={6} mask />
      </div>
    </div>
  );
}
