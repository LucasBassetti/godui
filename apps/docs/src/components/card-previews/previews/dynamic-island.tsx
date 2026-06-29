"use client";

export default function DynamicIslandPreview() {
  return (
    <div className="flex justify-center pt-4">
      <div className="flex h-8 w-20 items-center justify-center gap-2 rounded-full bg-foreground px-3 transition-all duration-300 group-hover:h-9 group-hover:w-40 group-hover:justify-between">
        <span className="size-2.5 rounded-full bg-primary" />
        <span className="hidden h-1.5 w-12 rounded-full bg-background/60 group-hover:block" />
      </div>
    </div>
  );
}
