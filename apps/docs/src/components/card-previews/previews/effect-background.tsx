"use client";

export default function EffectBackgroundPreview() {
  return (
    <div className="relative grid size-24 place-items-center overflow-hidden rounded-xl bg-[var(--muted-foreground)]/10">
      <span className="size-10 rounded-full bg-primary/50 blur-md transition-all duration-500 group-hover:size-16 group-hover:bg-primary/60" />
    </div>
  );
}
