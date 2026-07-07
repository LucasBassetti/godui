"use client";

const CONTINENTS = [
  "M28 32 Q40 24 48 34 Q50 44 42 48 Q34 46 30 40 Z",
  "M40 54 Q48 56 46 66 Q42 76 36 70 Q34 60 40 54 Z",
  "M76 30 Q86 26 90 34 Q94 48 86 62 Q80 74 76 62 Q74 46 76 30 Z",
  "M104 26 Q132 20 150 30 Q154 40 142 44 Q118 46 106 40 Q100 32 104 26 Z",
  "M132 60 Q146 56 150 66 Q148 74 138 72 Q128 68 132 60 Z",
];

export default function WorldMapPreview() {
  return (
    <div className="relative h-24 w-44 overflow-hidden rounded-lg bg-[var(--muted)]/30">
      <svg
        viewBox="0 0 176 96"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <title>World map</title>
        <defs>
          <pattern
            id="wm-dots"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="1"
              cy="1"
              r="0.9"
              fill="var(--muted-foreground)"
              fillOpacity={0.55}
            />
          </pattern>
          <clipPath id="wm-land">
            {CONTINENTS.map((d) => (
              <path key={d} d={d} />
            ))}
          </clipPath>
        </defs>
        {/* Dotted continents. */}
        <rect
          width="176"
          height="96"
          fill="url(#wm-dots)"
          clipPath="url(#wm-land)"
        />
        {/* Muted base arc, always visible. */}
        <path
          d="M 40 64 Q 88 16 136 56"
          fill="none"
          stroke="color-mix(in oklch, var(--muted-foreground) 30%, transparent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Primary arc draws on hover. */}
        <path
          d="M 40 64 Q 88 16 136 56"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          className="transition-[stroke-dashoffset] duration-700 ease-out group-hover:[stroke-dashoffset:0]"
        />
        <circle cx="40" cy="64" r="3.5" fill="var(--primary)" />
        <circle cx="136" cy="56" r="3.5" fill="var(--primary)" />
      </svg>
    </div>
  );
}
