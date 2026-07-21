"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Children rise into the lit cones: opacity 0→1 and y 40→0, delayed 0.2s
 * behind the cone/bar ignite so the headline arrives after the light is on.
 */
const CSS = `
@keyframes lr-cone {
  from { transform: scaleX(0.5); opacity: 0.5; }
  to   { transform: scaleX(1);   opacity: 1; }
}
@keyframes lr-rise {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lr-cone { animation: lr-cone 800ms ease-in-out both; }
.lr-rise { animation: lr-rise 800ms ease-in-out 200ms both; }
.lr-static .lr-cone,
.lr-static .lr-rise { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Light",
    desc: "cones + bar ignite first (t=0)",
    kind: "light" as const,
  },
  {
    name: "Children",
    desc: "opacity + y:40→0, delay 0.2s",
    kind: "children" as const,
  },
  {
    name: "Reduced motion",
    desc: "start at lit + risen state",
    kind: "reduced" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "children") {
    return (
      <span className="h-2 w-8 rounded-full bg-[var(--foreground)]/35 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "reduced") {
    return (
      <span className="h-3.5 w-6 rounded-2xl ring-1 ring-[var(--foreground)]/40 ring-inset" />
    );
  }
  return (
    <span
      className="h-4 w-8 rounded-t-full ring-1 ring-fd-border ring-inset"
      style={{
        backgroundImage:
          "conic-gradient(from 70deg at 50% 100%, color-mix(in oklch, var(--foreground) 28%, transparent), transparent 55%)",
      }}
    />
  );
}

export function LampRise() {
  return (
    <ScrollScene label="Rise" note="children · delay 0.2s · y:40→0">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-9 ${reduced ? "lr-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="relative isolate overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ width: 360, height: 220 }}
          >
            <div className="absolute inset-x-0 top-6 flex justify-center">
              <div
                className="lr-cone h-28 w-64"
                style={{
                  backgroundImage:
                    "conic-gradient(from 70deg at 50% 0%, color-mix(in oklch, var(--foreground) 28%, transparent), transparent 40%, transparent), conic-gradient(from 290deg at 50% 0%, transparent, transparent 40%, color-mix(in oklch, var(--foreground) 28%, transparent))",
                  maskImage: "linear-gradient(to top, transparent, white)",
                  WebkitMaskImage:
                    "linear-gradient(to top, transparent, white)",
                }}
              />
            </div>
            <div className="lr-rise absolute inset-x-0 bottom-12 flex flex-col items-center gap-2.5">
              <span className="h-2.5 w-32 rounded-full bg-[var(--foreground)]/35" />
              <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/20" />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}'}
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="text-[12px] text-fd-muted-foreground">
                  {item.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
