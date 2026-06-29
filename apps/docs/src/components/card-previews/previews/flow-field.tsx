"use client";

export default function FlowFieldPreview() {
  return (
    <div className="relative size-24 overflow-hidden rounded-xl bg-[var(--muted-foreground)]/10">
      <svg
        viewBox="0 0 96 96"
        className="size-full transition-transform duration-700 group-hover:translate-x-1"
        aria-hidden="true"
        fill="none"
        strokeWidth="2"
      >
        <path
          d="M0 24 Q24 8 48 24 T96 24"
          className="stroke-[var(--muted-foreground)]/30"
        />
        <path d="M0 48 Q24 32 48 48 T96 48" className="stroke-primary" />
        <path
          d="M0 72 Q24 56 48 72 T96 72"
          className="stroke-[var(--muted-foreground)]/30"
        />
      </svg>
    </div>
  );
}
