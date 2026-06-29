"use client";

export default function ElasticTextPreview() {
  return (
    <div className="flex items-end gap-1.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`h-6 w-3 origin-bottom rounded transition-transform duration-300 group-hover:scale-y-150 ${i === 2 ? "bg-primary" : "bg-[var(--muted-foreground)]/20"}`}
          style={{ transitionDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}
