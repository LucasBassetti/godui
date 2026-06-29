"use client";

export default function StepperPreview() {
  return (
    <div className="flex w-48 items-center">
      <span className="size-4 shrink-0 rounded-full bg-primary" />
      <span className="h-0.5 flex-1 bg-[var(--muted-foreground)]/25">
        <span className="block h-full w-0 bg-primary transition-[width] duration-500 group-hover:w-full" />
      </span>
      <span className="size-4 shrink-0 rounded-full bg-[var(--muted-foreground)]/25 transition-colors duration-300 group-hover:bg-primary" />
      <span className="h-0.5 flex-1 bg-[var(--muted-foreground)]/25" />
      <span className="size-4 shrink-0 rounded-full bg-[var(--muted-foreground)]/25" />
    </div>
  );
}
