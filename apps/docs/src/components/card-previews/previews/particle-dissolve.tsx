"use client";

const dots = [
  "group-hover:-translate-x-8 group-hover:-translate-y-6",
  "group-hover:translate-x-8 group-hover:-translate-y-5",
  "group-hover:-translate-x-7 group-hover:translate-y-7",
  "group-hover:translate-x-9 group-hover:translate-y-6",
  "group-hover:translate-x-2 group-hover:-translate-y-9",
];

export default function ParticleDissolvePreview() {
  return (
    <div className="relative grid size-20 place-items-center">
      <div className="size-16 rounded-xl bg-[var(--muted-foreground)]/20 transition-opacity duration-500 group-hover:opacity-0" />
      {dots.map((d, i) => (
        <span
          key={d}
          className={`absolute size-1.5 rounded-full bg-primary opacity-0 transition-all duration-500 group-hover:opacity-100 ${d}`}
          style={{ transitionDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}
