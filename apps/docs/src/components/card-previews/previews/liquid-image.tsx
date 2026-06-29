"use client";

export default function LiquidImagePreview() {
  return (
    <div className="relative grid size-24 place-items-center overflow-hidden rounded-xl bg-[var(--muted-foreground)]/20">
      <span className="absolute size-8 rounded-full border-2 border-primary/0 transition-all duration-700 group-hover:size-28 group-hover:border-primary/40" />
      <span className="absolute size-8 rounded-full border-2 border-primary/0 transition-all delay-150 duration-700 group-hover:size-20 group-hover:border-primary/30" />
    </div>
  );
}
