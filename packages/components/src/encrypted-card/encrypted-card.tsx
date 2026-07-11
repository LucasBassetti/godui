"use client";

import * as React from "react";

export type EncryptedCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Pool of glyphs the encrypted stream is drawn from. */
  characters?: string;
  /** Milliseconds between glyph re-randomizations while hovered. */
  speed?: number;
  /** Radius of the reveal window that follows the pointer, in pixels. */
  revealRadius?: number;
  /** Color of the encrypted glyph stream. Accepts any CSS color. */
  streamColor?: string;
};

// A wide alphabet keeps the stream looking like ciphertext rather than a word.
const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>[]{}/*#$%&";
// Enough characters to flood any reasonably sized card.
const STREAM_LEN = 1500;

const ROOT_BASE =
  "group relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground";

// The glyph layer, revealed only inside a soft radial mask centered on the
// pointer (`--x` / `--y`, defaulting to center so the first paint isn't a corner
// flash). `mask-image` is a single longhand so the shorthand-reset trap does not
// apply here.
const STREAM_BASE =
  "pointer-events-none absolute inset-0 select-none break-all font-mono text-[11px] leading-[1.15] tracking-[0.15em] opacity-0 [transition:opacity_300ms_ease] group-hover:opacity-100 motion-reduce:[transition:none] [mask-image:radial-gradient(var(--reveal)_circle_at_var(--x,50%)_var(--y,50%),#000_0%,transparent_100%)] [-webkit-mask-image:radial-gradient(var(--reveal)_circle_at_var(--x,50%)_var(--y,50%),#000_0%,transparent_100%)]";

function randomString(length: number, chars: string): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

const EncryptedCard = React.forwardRef<HTMLDivElement, EncryptedCardProps>(
  (
    {
      characters = DEFAULT_CHARS,
      speed = 55,
      revealRadius = 130,
      streamColor = "var(--primary)",
      className,
      style,
      children,
      onPointerMove,
      onPointerEnter,
      onPointerLeave,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );

    const [stream, setStream] = React.useState("");
    const [hovered, setHovered] = React.useState(false);
    const reduced = usePrefersReducedMotion();

    // Fill on mount (client-only, so SSR markup stays deterministic) and, while
    // hovered with motion enabled, re-randomize on an interval.
    React.useEffect(() => {
      setStream(randomString(STREAM_LEN, characters));
      if (reduced || !hovered) return;
      const id = window.setInterval(() => {
        setStream(randomString(STREAM_LEN, characters));
      }, speed);
      return () => window.clearInterval(id);
    }, [characters, speed, hovered, reduced]);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }
      onPointerMove?.(e);
    };

    const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
      setHovered(true);
      onPointerEnter?.(e);
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
      setHovered(false);
      onPointerLeave?.(e);
    };

    return (
      <div
        ref={ref}
        data-slot="encrypted-card"
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className={`${ROOT_BASE} ${className ?? ""}`}
        style={{
          ["--reveal" as string]: `${revealRadius}px`,
          ...style,
        }}
        {...props}
      >
        <div aria-hidden className={STREAM_BASE} style={{ color: streamColor }}>
          {stream}
        </div>
        <div className="relative z-raised">{children}</div>
      </div>
    );
  },
);
EncryptedCard.displayName = "EncryptedCard";

export { EncryptedCard };
