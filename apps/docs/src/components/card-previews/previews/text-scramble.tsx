"use client";

export default function TextScramblePreview() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className={`h-6 w-3 rounded-sm transition-transform duration-200 group-hover:-translate-y-1 ${i % 3 === 1 ? "bg-primary" : "bg-[var(--muted-foreground)]/25"}`}
          style={{ transitionDelay: `${i * 70}ms` }}
        />
      ))}
    </div>
  );
}
