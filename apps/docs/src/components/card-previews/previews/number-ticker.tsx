"use client";

function Digit({ delay }: { delay: number }) {
  return (
    <div className="h-10 w-6 overflow-hidden rounded bg-[var(--muted-foreground)]/15">
      <div
        className="transition-transform duration-700 ease-out group-hover:-translate-y-10"
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className="grid h-10 place-items-center">
          <span className="h-5 w-3 rounded-sm bg-[var(--muted-foreground)]/30" />
        </div>
        <div className="grid h-10 place-items-center">
          <span className="h-5 w-3 rounded-sm bg-primary" />
        </div>
      </div>
    </div>
  );
}

export default function NumberTickerPreview() {
  return (
    <div className="flex gap-1.5">
      <Digit delay={0} />
      <Digit delay={90} />
      <Digit delay={180} />
    </div>
  );
}
