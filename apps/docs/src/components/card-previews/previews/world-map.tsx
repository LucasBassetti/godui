"use client";

export default function WorldMapPreview() {
  return (
    <div className="relative h-24 w-44 overflow-hidden rounded-lg [background:radial-gradient(circle,color-mix(in_oklch,var(--muted-foreground)_25%,transparent)_1px,transparent_1px)] [background-size:8px_8px]">
      <svg
        viewBox="0 0 176 96"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <title>World map</title>
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
