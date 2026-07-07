"use client";

import { Gravity, MatterBody } from "@godui/components";

const TAGS = [
  { label: "design", x: "20%", y: "10%" },
  { label: "motion", x: "40%", y: "0%" },
  { label: "physics", x: "60%", y: "12%" },
  { label: "react", x: "78%", y: "4%" },
  { label: "tailwind", x: "30%", y: "20%" },
  { label: "wow", x: "55%", y: "24%" },
  { label: "drag me", x: "68%", y: "18%" },
];

const COLORS = [
  "bg-primary text-primary-foreground",
  "bg-foreground text-background",
  "bg-muted text-foreground",
];

export function GravityDemo() {
  return (
    <div className="w-full">
      <Gravity className="h-[420px] w-full rounded-xl border border-border bg-muted/20">
        {TAGS.map((tag, i) => (
          <MatterBody
            key={tag.label}
            x={tag.x}
            y={tag.y}
            angle={(i - 3) * 8}
            matterBodyOptions={{ friction: 0.5, restitution: 0.4 }}
          >
            <span
              className={`rounded-full px-5 py-2.5 text-lg font-medium shadow-sm ${COLORS[i % COLORS.length]}`}
            >
              {tag.label}
            </span>
          </MatterBody>
        ))}
      </Gravity>
    </div>
  );
}
