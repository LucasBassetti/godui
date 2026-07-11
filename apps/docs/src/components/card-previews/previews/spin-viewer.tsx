"use client";

export default function SpinViewerPreview() {
  return (
    <div className="relative flex h-24 w-36 items-center justify-center overflow-hidden rounded-xl border border-border bg-card [perspective:420px]">
      <div className="size-12 rounded-md bg-primary shadow-md [transform:rotateX(22deg)_rotateY(-24deg)] [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover:[transform:rotateX(22deg)_rotateY(156deg)]" />
      <span className="pointer-events-none absolute bottom-2 text-xs leading-none text-muted-foreground">
        ⟲
      </span>
    </div>
  );
}
