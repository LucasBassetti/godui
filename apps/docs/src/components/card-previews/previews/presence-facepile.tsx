"use client";

export default function PresenceFacepilePreview() {
  return (
    <div className="flex">
      <span className="-ml-2.5 relative size-9 rounded-full bg-[var(--muted-foreground)]/25 ring-2 ring-background first:ml-0">
        <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-primary ring-2 ring-background transition-transform duration-300 group-hover:scale-125" />
      </span>
      <span className="-ml-2.5 size-9 rounded-full bg-[var(--muted-foreground)]/25 ring-2 ring-background" />
      <span className="-ml-2.5 size-9 rounded-full bg-[var(--muted-foreground)]/25 ring-2 ring-background" />
      <span className="-ml-2.5 size-9 rounded-full bg-[var(--muted-foreground)]/15 ring-2 ring-background" />
    </div>
  );
}
