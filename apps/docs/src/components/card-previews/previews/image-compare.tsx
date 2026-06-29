"use client";

export default function ImageComparePreview() {
  return (
    <div className="relative h-24 w-40 overflow-hidden rounded-xl bg-[var(--muted-foreground)]/15">
      <div className="absolute inset-y-0 left-0 w-1/2 bg-[var(--muted-foreground)]/30 transition-[width] duration-300 group-hover:w-[35%]" />
      <div className="absolute inset-y-0 left-1/2 flex w-0.5 items-center justify-center bg-primary transition-[left] duration-300 group-hover:left-[35%]">
        <span className="size-6 rounded-full border-2 border-primary bg-card" />
      </div>
    </div>
  );
}
