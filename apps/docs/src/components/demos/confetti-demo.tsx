"use client";

import { ConfettiButton } from "@godui/components";
import { Check } from "lucide-react";

export function ConfettiDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Check className="size-6" strokeWidth={3} />
      </div>
      <div className="space-y-1">
        <div className="text-lg font-semibold text-foreground">
          Payment successful
        </div>
        <div className="text-sm text-muted-foreground">
          Your order is confirmed and on its way.
        </div>
      </div>
      <ConfettiButton
        className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm [transition:background_200ms_ease] hover:bg-primary/90 active:scale-[0.98]"
        options={{ particleCount: 160, spread: 100, startVelocity: 48 }}
      >
        Celebrate 🎉
      </ConfettiButton>
    </div>
  );
}
