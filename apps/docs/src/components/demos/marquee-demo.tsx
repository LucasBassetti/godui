"use client";

import { Marquee } from "@godui/components";
import type { ReactNode } from "react";

function Logo({ mark, name }: { mark: ReactNode; name: string }) {
  return (
    <div className="flex items-center gap-2.5 px-2 text-muted-foreground [transition:color_200ms_ease] hover:text-foreground">
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="currentColor"
        aria-hidden="true"
      >
        {mark}
      </svg>
      <span className="text-lg font-semibold tracking-tight whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

const logos: { name: string; mark: ReactNode }[] = [
  { name: "Northwind", mark: <circle cx="12" cy="12" r="9" /> },
  { name: "Globex", mark: <path d="M12 2 22 20H2z" /> },
  { name: "Acme", mark: <rect x="3" y="3" width="18" height="18" rx="4" /> },
  {
    name: "Initech",
    mark: <path d="M12 2 21 7v10l-9 5-9-5V7z" />,
  },
  {
    name: "Hooli",
    mark: <path d="M12 2a10 10 0 1 0 0 20 6 6 0 0 1 0-12 4 4 0 1 1 0-8z" />,
  },
  {
    name: "Stark",
    mark: <path d="M2 7h20l-4 12-6-4-6 4z" />,
  },
  {
    name: "Umbra",
    mark: (
      <>
        <circle cx="8" cy="12" r="6" />
        <circle cx="16" cy="12" r="6" opacity="0.55" />
      </>
    ),
  },
  { name: "Vertex", mark: <path d="M3 20 12 4l9 16-9-5z" /> },
];

export function MarqueeDemo() {
  return (
    <div className="w-full py-4">
      <p className="mb-6 text-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
        Trusted by fast-moving teams
      </p>
      <Marquee speed={28}>
        {logos.map((logo) => (
          <Logo key={logo.name} mark={logo.mark} name={logo.name} />
        ))}
      </Marquee>
    </div>
  );
}
