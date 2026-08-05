"use client";

// A 6x6 halftone grid: dot sizes step with luminance, one accent cell, and each
// dot pops (scales up) on card hover with a staggered delay. Built from plain
// divs (muted + accent tokens) so per-cell size/delay can be inline. Size is set
// via width/height (static), leaving `transform` free for the hover pop.
const SIZES = [
  30, 55, 80, 95, 70, 40, 55, 80, 100, 90, 60, 35, 80, 100, 100, 100, 80, 55,
  90, 100, 100, 100, 90, 65, 60, 85, 100, 95, 70, 45, 35, 55, 75, 65, 45, 25,
];
const ACCENT = 15;

export default function AsciiDitherPreview() {
  return (
    <div className="grid grid-cols-6 gap-1">
      {SIZES.map((s, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static decorative grid
          key={i}
          className="flex size-3 items-center justify-center"
        >
          <div
            className={`rounded-full transition-transform duration-500 ease-out group-hover:scale-125 ${
              i === ACCENT ? "bg-primary" : "bg-[var(--muted-foreground)]/20"
            }`}
            style={{
              width: `${s}%`,
              height: `${s}%`,
              transitionDelay: `${i * 12}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
