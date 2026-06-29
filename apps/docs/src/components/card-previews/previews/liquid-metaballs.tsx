"use client";

export default function LiquidMetaballsPreview() {
  return (
    <div className="relative grid size-24 place-items-center overflow-hidden rounded-xl bg-[var(--muted-foreground)]/10">
      <span className="absolute size-9 rounded-full bg-primary/60 blur-[3px] transition-transform duration-500 group-hover:-translate-x-2" />
      <span className="absolute size-7 rounded-full bg-primary/60 blur-[3px] transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-1" />
    </div>
  );
}
