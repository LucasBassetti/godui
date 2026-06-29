"use client";

export default function LiquidGlassCardPreview() {
  return (
    <div className="relative grid size-24 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/40 via-primary/10 to-[var(--muted-foreground)]/20">
      <div className="flex size-14 flex-col justify-center gap-1.5 rounded-lg border border-white/30 bg-white/10 p-2.5 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
        <span className="h-1.5 w-2/3 rounded-full bg-white/60" />
        <span className="h-1 w-full rounded-full bg-white/30" />
      </div>
    </div>
  );
}
