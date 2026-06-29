"use client";

const widths = ["w-full", "w-5/6", "w-2/3"];

export default function TextAnimatePreview() {
  return (
    <div className="flex w-32 flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`h-3 ${widths[i]} translate-y-1 rounded bg-[var(--muted-foreground)]/20 opacity-0 blur-[1px] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:blur-0`}
          style={{ transitionDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}
