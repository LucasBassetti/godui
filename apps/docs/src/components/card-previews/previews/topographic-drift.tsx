"use client";

export default function TopographicDriftPreview() {
  return (
    <div className="relative grid size-24 place-items-center overflow-hidden rounded-xl bg-[var(--muted-foreground)]/10">
      <span className="absolute size-20 rounded-[40%] border border-[var(--muted-foreground)]/25 transition-transform duration-700 group-hover:scale-105" />
      <span className="absolute size-14 rounded-[42%] border border-[var(--muted-foreground)]/25 transition-transform duration-700 group-hover:scale-110" />
      <span className="absolute size-8 rounded-[45%] border border-primary transition-transform duration-700 group-hover:scale-110" />
    </div>
  );
}
