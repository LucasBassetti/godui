"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";

type CopyButtonProps = {
  value: string;
  className?: string;
};

export function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      onClick={onCopy}
      className={cn(
        // Radius comes from the call site (cn has no tailwind-merge, so a base
        // radius couldn't be overridden). Callers pass rounded-md / rounded-[10px].
        "inline-flex size-8 items-center justify-center border border-fd-border bg-fd-card text-fd-muted-foreground transition-[color,border-color,background-color,transform] duration-150 hover:border-fd-primary/45 hover:text-fd-primary active:scale-[0.96]",
        className,
        copied &&
          "border-fd-success/45 text-fd-success hover:border-fd-success/45 hover:text-fd-success",
      )}
    >
      {/* Remount on toggle (via key) so the pop animation replays each copy. */}
      <span
        key={copied ? "check" : "copy"}
        className={cn(
          "inline-flex",
          copied &&
            "animate-[godui-tool-pop_380ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
        )}
      >
        {copied ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </span>
    </button>
  );
}
