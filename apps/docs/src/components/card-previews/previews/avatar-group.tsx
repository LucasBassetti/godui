"use client";

export default function AvatarGroupPreview() {
  return (
    <div className="flex">
      <span className="-ml-3 size-10 rounded-full bg-[var(--muted-foreground)]/25 ring-2 ring-background transition-all duration-300 first:ml-0 group-hover:-translate-y-1 group-hover:ml-1 group-hover:first:ml-0" />
      <span className="-ml-3 size-10 rounded-full bg-primary ring-2 ring-background transition-all duration-300 group-hover:-translate-y-1 group-hover:ml-1" />
      <span className="-ml-3 size-10 rounded-full bg-[var(--muted-foreground)]/25 ring-2 ring-background transition-all duration-300 group-hover:-translate-y-1 group-hover:ml-1" />
      <span className="-ml-3 size-10 rounded-full bg-[var(--muted-foreground)]/25 ring-2 ring-background transition-all duration-300 group-hover:-translate-y-1 group-hover:ml-1" />
      <span className="-ml-3 size-10 rounded-full bg-[var(--muted-foreground)]/15 ring-2 ring-background transition-all duration-300 group-hover:-translate-y-1 group-hover:ml-1" />
    </div>
  );
}
