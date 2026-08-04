"use client";

function Flap({ accent, delay }: { accent?: boolean; delay: string }) {
  return (
    <div className="relative h-11 w-8 [perspective:200px]">
      {/* Card body with a center hinge seam. */}
      <div className="absolute inset-0 rounded-md bg-[var(--muted-foreground)]/20" />
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--background)]/40" />
      {/* Top leaf hinges down on hover. */}
      <div
        className={`absolute inset-x-0 top-0 h-1/2 origin-bottom rounded-t-md transition-transform duration-500 ease-out [transform:rotateX(0deg)] group-hover:[transform:rotateX(-85deg)] ${
          accent ? "bg-primary" : "bg-[var(--muted-foreground)]/35"
        } ${delay}`}
      />
    </div>
  );
}

export default function SplitFlapDisplayPreview() {
  return (
    <div className="flex gap-1.5">
      <Flap delay="[transition-delay:0ms]" />
      <Flap accent delay="[transition-delay:80ms]" />
      <Flap delay="[transition-delay:160ms]" />
      <Flap delay="[transition-delay:240ms]" />
    </div>
  );
}
