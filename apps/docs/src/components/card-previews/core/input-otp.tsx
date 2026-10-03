"use client";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function InputOtpPreview() {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2, 3, 4, 5].map((slot) => (
        <div
          key={slot}
          className="flex size-7 items-center justify-center rounded-md border border-[var(--muted-foreground)]/25"
        >
          <div
            className="h-2.5 w-1.5 translate-y-1 bg-primary rounded-full opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100"
            style={{ transitionDelay: `${slot * 70}ms` }}
          />
        </div>
      ))}
    </div>
  );
}
