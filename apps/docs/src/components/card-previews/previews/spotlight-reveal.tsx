"use client";

export default function SpotlightRevealPreview() {
  return (
    <div className="relative h-24 w-40 overflow-hidden rounded-xl bg-[var(--muted-foreground)]/20">
      <div className="absolute top-3 left-3 size-14 rounded-full bg-primary/35 blur-lg transition-transform duration-500 ease-out group-hover:translate-x-20 group-hover:translate-y-4" />
    </div>
  );
}
