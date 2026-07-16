"use client";

import { GooeyStack } from "@godui/components";
import * as React from "react";

type Card = {
  brand: string;
  last4: string;
  label: string;
  chip: string;
};

const CARDS: Card[] = [
  {
    brand: "VISA",
    last4: "4242",
    label: "Personal",
    chip: "linear-gradient(135deg,#38bdf8,#6366f1)",
  },
  {
    brand: "Mastercard",
    last4: "8210",
    label: "Business",
    chip: "linear-gradient(135deg,#fb923c,#f43f5e)",
  },
  {
    brand: "Amex",
    last4: "0005",
    label: "Travel",
    chip: "linear-gradient(135deg,#34d399,#14b8a6)",
  },
];

function WalletCard({ card }: { card: Card }) {
  return (
    <div className="h-24 px-5 py-4">
      <div className="flex items-start justify-between">
        <span
          className="h-6 w-9 rounded-md shadow-sm"
          style={{ background: card.chip }}
        />
        <span className="text-xs font-semibold tracking-wide text-muted-foreground">
          {card.brand}
        </span>
      </div>
      <div className="mt-3.5 flex items-end justify-between">
        <span className="font-mono text-sm tracking-widest text-foreground">
          •••• {card.last4}
        </span>
        <span className="text-xs text-muted-foreground">{card.label}</span>
      </div>
    </div>
  );
}

export function GooeyWalletDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex w-full max-w-[22rem] flex-col items-center gap-8 max-sm:px-4">
      <GooeyStack collapsed={!open} expandedGap={18} radius={20}>
        {CARDS.map((card) => (
          <WalletCard key={card.last4} card={card} />
        ))}
      </GooeyStack>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-pressed={open}
        className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground [transition:background_150ms] hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {open ? "Close wallet" : "Open wallet"}
      </button>
    </div>
  );
}
