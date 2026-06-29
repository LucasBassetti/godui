"use client";

export default function ImageTrailPreview() {
  return (
    <div className="relative h-24 w-44">
      <div className="absolute top-6 left-2 size-14 rounded-xl bg-[var(--muted-foreground)]/20 transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-1" />
      <div className="-translate-x-1/2 absolute top-2 left-1/2 size-14 rounded-xl bg-primary/60 transition-transform duration-300 group-hover:-translate-y-2" />
      <div className="absolute top-7 right-2 size-14 rounded-xl bg-[var(--muted-foreground)]/20 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-1" />
    </div>
  );
}
