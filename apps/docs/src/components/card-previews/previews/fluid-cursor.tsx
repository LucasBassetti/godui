"use client";

export default function FluidCursorPreview() {
  return (
    <div className="relative h-24 w-40 overflow-hidden rounded-xl bg-[var(--muted-foreground)]/10">
      <div className="absolute top-4 left-4 size-10 rounded-full bg-primary/70 blur-md transition-transform duration-500 ease-out group-hover:translate-x-20 group-hover:translate-y-8" />
    </div>
  );
}
