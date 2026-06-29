"use client";

export default function OTPInputPreview() {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-9 w-7 rounded-md bg-[var(--muted-foreground)]/20 transition-colors duration-200 group-hover:bg-primary"
          style={{ transitionDelay: `${i * 110}ms` }}
        />
      ))}
    </div>
  );
}
