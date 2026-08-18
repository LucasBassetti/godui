"use client";

import {
  CompactMultiButton,
  MultiButton,
  type MultiButtonItem,
} from "@godui/components";
import { Archive, Download, Ellipsis, Eye, Share2 } from "lucide-react";
import { useState } from "react";
import { useBareScene } from "./bare-scene-context";

const ITEMS: MultiButtonItem[] = [
  { id: "review", icon: Eye, label: "Review" },
  { id: "download", icon: Download, label: "Download" },
  { id: "share", icon: Share2, label: "Share" },
  { id: "archive", icon: Archive, label: "Archive" },
];

type Treatment = "original" | "gooey";

function TreatmentSwitch({
  value,
  onChange,
}: {
  value: Treatment;
  onChange: (value: Treatment) => void;
}) {
  return (
    <fieldset className="inline-flex rounded-full bg-[var(--muted)] p-1 ring-1 ring-[var(--foreground)]/10 ring-inset">
      <legend className="sr-only">Multi Button treatment</legend>
      {(["original", "gooey"] as const).map((treatment) => {
        const active = treatment === value;
        return (
          <button
            key={treatment}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(treatment)}
            className={`h-10 cursor-pointer rounded-full px-4 font-medium text-xs capitalize transition-[background-color,color,box-shadow,scale] duration-150 active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100 ${
              active
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-fd-muted-foreground hover:text-[var(--foreground)]"
            }`}
          >
            {treatment}
          </button>
        );
      })}
    </fieldset>
  );
}

export function MultiButtonResult() {
  const [treatment, setTreatment] = useState<Treatment>("original");
  const gooey = treatment === "gooey";
  const demo = (
    <div className="flex w-full flex-col items-center gap-7">
      <div className="flex w-full max-w-[520px] flex-col items-center gap-6">
        <div className="flex min-w-0 flex-col items-center gap-3">
          <span className="font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.14em]">
            Standard
          </span>
          <MultiButton
            gooey={gooey}
            highlightColor="var(--primary)"
            items={ITEMS}
            variant="default"
          />
        </div>
        <div className="flex min-w-0 flex-col items-center gap-3">
          <span className="font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.14em]">
            Compact
          </span>
          <CompactMultiButton
            gooey={gooey}
            highlightColor="var(--primary)"
            items={ITEMS}
            restAriaLabel="Open actions"
            restIcon={Ellipsis}
            selectedId="review"
            variant="outline"
          />
        </div>
      </div>
      <TreatmentSwitch value={treatment} onChange={setTreatment} />
      <p className="text-center font-mono text-[10px] text-fd-muted-foreground">
        Four-item example · optional rest icon crossfades on open · no fixed
        maximum
      </p>
    </div>
  );

  if (useBareScene()) {
    return (
      <div className="flex min-h-[260px] w-full items-center justify-center p-4 sm:p-6">
        {demo}
      </div>
    );
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-fd-border border-b px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          hover, focus, or tap an action
        </span>
      </div>
      <div className="flex min-h-[280px] items-center justify-center p-6 sm:p-10">
        {demo}
      </div>
    </div>
  );
}
