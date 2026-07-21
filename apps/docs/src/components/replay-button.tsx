"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type ReplayButtonProps = {
  onReplay: () => void;
  className?: string;
};

/**
 * Replay control shared by ComponentPreview and the Learn ScrollScene. Clicking
 * spins the arrow a full turn; the border beam it triggers lives on the card,
 * not here (see BorderBeam). The icon remounts on `plays` (React key) so the
 * spin restarts every click.
 */
export function ReplayButton({ onReplay, className }: ReplayButtonProps) {
  const [plays, setPlays] = useState(0);

  const handleClick = () => {
    setPlays((p) => p + 1);
    onReplay();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Replay animation"
      title="Replay"
      className={cn(
        "inline-flex size-8 cursor-pointer items-center justify-center rounded-[10px] border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:text-fd-foreground active:scale-95",
        className,
      )}
    >
      <svg
        key={plays}
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
        className={cn(
          plays > 0 &&
            "[animation:godui-replay-spin_560ms_cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:animate-none",
        )}
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    </button>
  );
}
