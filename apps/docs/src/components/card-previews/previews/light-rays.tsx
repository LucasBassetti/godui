"use client";

export default function LightRaysPreview() {
  return (
    <div className="relative size-24 overflow-hidden rounded-xl bg-[var(--muted-foreground)]/10">
      <div className="-translate-x-1/2 absolute top-0 left-1/2 origin-top transition-opacity duration-500 [opacity:0.55] group-hover:[opacity:1]">
        <span className="absolute h-24 w-1.5 origin-top rotate-[-25deg] bg-gradient-to-b from-primary to-transparent" />
        <span className="absolute h-24 w-1.5 origin-top bg-gradient-to-b from-primary to-transparent" />
        <span className="absolute h-24 w-1.5 origin-top rotate-[25deg] bg-gradient-to-b from-primary to-transparent" />
      </div>
    </div>
  );
}
