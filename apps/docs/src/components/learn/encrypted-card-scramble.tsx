"use client";

import { useEffect, useState } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Real EncryptedCard: on hover, stream opacity fades in (300ms) and
 * setInterval re-rolls STREAM_LEN glyphs every `speed` ms (default 55).
 * Opacity stays steady — only the characters change. Reduced motion skips
 * the interval.
 */
const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>[]{}/*#$%&";
const SPEED_MS = 55;
const STREAM_LEN = 1500;

function randomString(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return out;
}

const CSS = `
@keyframes ecs-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.ecs-stream { animation: ecs-fade 300ms ease both; }
.ecs-static .ecs-stream { animation: none; opacity: 1; }
`;

const LEGEND = [
  {
    name: "Opacity in",
    desc: "300ms ease · group-hover:[opacity:var(--stream-opacity)]",
    kind: "opacity" as const,
  },
  {
    name: "Re-randomize",
    desc: "setInterval(speed) · default 55ms · glyphs change, opacity steady",
    kind: "scramble" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "scramble") {
    return (
      <span className="h-3.5 w-6 rounded-lg border border-fd-border bg-[var(--card)] font-mono text-[6px] leading-none text-[var(--foreground)]/50 ring-1 ring-fd-border ring-inset">
        Xy7#
      </span>
    );
  }
  return (
    <span className="h-3.5 w-6 rounded-lg bg-[var(--foreground)]/50 ring-1 ring-fd-border ring-inset" />
  );
}

function ScrambleCard({ cycle, reduced }: { cycle: number; reduced: boolean }) {
  const [stream, setStream] = useState(() => randomString(STREAM_LEN));

  useEffect(() => {
    if (reduced || cycle === 0) return;
    const id = window.setInterval(() => {
      setStream(randomString(STREAM_LEN));
    }, SPEED_MS);
    return () => window.clearInterval(id);
  }, [cycle, reduced]);

  return (
    <div
      key={cycle}
      className={`relative h-[160px] w-full max-w-[300px] overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] ${reduced ? "ecs-static" : ""}`}
    >
      <div
        aria-hidden="true"
        className="ecs-stream absolute inset-0 select-none break-all font-mono text-[10px] leading-[1.15] tracking-[0.12em] text-[var(--foreground)]/50"
        style={{
          maskImage:
            "radial-gradient(100px circle at 55% 45%, #000 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(100px circle at 55% 45%, #000 0%, transparent 100%)",
        }}
      >
        {stream}
      </div>
      <div className="relative z-raised flex h-full flex-col justify-center gap-2.5 px-6">
        <span className="h-2 w-12 rounded-full bg-[var(--foreground)]/30" />
        <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/20" />
      </div>
    </div>
  );
}

export function EncryptedCardScramble() {
  return (
    <ScrollScene label="The scramble" note="fade in · then interval ticks">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[400px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <ScrambleCard key={cycle} cycle={cycle} reduced={reduced} />

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            setInterval(() =&gt; setStream(randomString(1500, chars)), speed)
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
