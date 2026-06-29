"use client";

export default function LampPreview() {
  return (
    <div className="relative flex h-24 w-40 flex-col items-center pt-5">
      <span className="h-0.5 w-24 rounded-full bg-primary shadow-[0_0_12px_2px_var(--primary)] transition-all duration-500 group-hover:w-32" />
      <div className="mt-1 h-12 w-32 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_28%,transparent),transparent_70%)] opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}
