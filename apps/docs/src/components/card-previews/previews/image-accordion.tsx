"use client";

export default function ImageAccordionPreview() {
  return (
    <div className="flex h-24 w-48 gap-1.5">
      <div className="flex-[3] rounded-lg bg-[var(--muted-foreground)]/20 transition-all duration-300 group-hover:flex-1" />
      <div className="flex-1 rounded-lg bg-primary transition-all duration-300 group-hover:flex-[3]" />
      <div className="flex-1 rounded-lg bg-[var(--muted-foreground)]/20" />
      <div className="flex-1 rounded-lg bg-[var(--muted-foreground)]/20" />
    </div>
  );
}
