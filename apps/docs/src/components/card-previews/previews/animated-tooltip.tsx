"use client";

export default function AnimatedTooltipPreview() {
  return (
    <div className="relative flex pt-9">
      <div className="-translate-x-1/2 absolute top-0 left-1/2 opacity-0 transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
        <div className="relative rounded-md bg-primary px-3 py-1.5">
          <div className="h-1.5 w-10 rounded-full bg-primary-foreground/80" />
          <span
            aria-hidden
            className="-translate-x-1/2 absolute top-[calc(100%-0.25rem)] left-1/2 size-2 rotate-45 bg-primary"
          />
        </div>
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="-ml-3 size-10 rounded-full bg-[var(--muted-foreground)]/25 ring-2 ring-background first:ml-0"
        />
      ))}
    </div>
  );
}
