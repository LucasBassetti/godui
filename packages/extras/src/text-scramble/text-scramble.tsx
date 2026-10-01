"use client";

import { useReducedMotion } from "framer-motion";
import * as React from "react";

export type ScrambleCharset =
  | "alphanumeric"
  | "symbols"
  | "katakana"
  | "binary";

export type TextScrambleProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  /** The resolved text. Changing it re-scrambles only the characters that differ. */
  text: string;
  /** When the first scramble runs. */
  trigger?: "mount" | "in-view" | "hover";
  /** Glyph pool used while a character is unresolved. */
  charset?: ScrambleCharset | string;
  /** Milliseconds per frame — lower scrambles faster. */
  speed?: number;
  /** Max stagger spread, in frames, across the string. */
  spread?: number;
};

const CHARSETS: Record<ScrambleCharset, string> = {
  alphanumeric:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  symbols: "!<>-_\\/[]{}—=+*^?#$%&",
  katakana: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ",
  binary: "01",
};

type Cell = { from: string; to: string; start: number; end: number };

const TextScramble = React.forwardRef<HTMLSpanElement, TextScrambleProps>(
  (
    {
      text,
      trigger = "mount",
      charset = "alphanumeric",
      speed = 28,
      spread = 28,
      className,
      onPointerEnter,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLSpanElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLSpanElement,
    );
    const reduce = useReducedMotion();

    const pool = (CHARSETS as Record<string, string>)[charset] ?? charset;
    const poolRef = React.useRef(pool);
    poolRef.current = pool;

    const [cells, setCells] = React.useState<{ ch: string; done: boolean }[]>(
      () => Array.from(text).map((ch) => ({ ch, done: true })),
    );
    const displayed = React.useRef(text);
    const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const started = React.useRef(false);

    const run = React.useCallback(
      (toText: string) => {
        if (reduce) {
          displayed.current = toText;
          setCells(Array.from(toText).map((ch) => ({ ch, done: true })));
          return;
        }
        const from = displayed.current;
        const len = Math.max(from.length, toText.length);
        const queue: Cell[] = [];
        for (let i = 0; i < len; i++) {
          const start = Math.floor(Math.random() * spread);
          const end = start + 10 + Math.floor(Math.random() * spread);
          queue.push({
            from: from[i] ?? "",
            to: toText[i] ?? "",
            start,
            end,
          });
        }

        if (timer.current) clearInterval(timer.current);
        let frame = 0;
        timer.current = setInterval(() => {
          let complete = 0;
          const next = queue.map((c) => {
            if (frame >= c.end) {
              complete++;
              return { ch: c.to, done: true };
            }
            if (frame >= c.start) {
              const p = poolRef.current;
              const ch = p[Math.floor(Math.random() * p.length)] as string;
              return { ch, done: false };
            }
            return { ch: c.from, done: true };
          });
          setCells(next);
          frame++;
          if (complete === queue.length && timer.current) {
            clearInterval(timer.current);
            timer.current = null;
            displayed.current = toText;
          }
        }, speed);
      },
      [reduce, speed, spread],
    );

    // First run is gated by `trigger`; later `text` changes always re-scramble.
    React.useEffect(() => {
      if (!started.current) {
        if (trigger === "mount") {
          started.current = true;
          run(text);
        } else if (trigger === "in-view") {
          const el = ref.current;
          if (!el) return;
          const io = new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting)) {
                started.current = true;
                run(text);
                io.disconnect();
              }
            },
            { threshold: 0.4 },
          );
          io.observe(el);
          return () => io.disconnect();
        }
        // hover: wait for the pointer (handler below).
        return;
      }
      run(text);
    }, [text, trigger, run]);

    React.useEffect(
      () => () => {
        if (timer.current) clearInterval(timer.current);
      },
      [],
    );

    return (
      <span
        ref={ref}
        data-slot="text-scramble"
        onPointerEnter={(e) => {
          onPointerEnter?.(e);
          if (trigger === "hover") {
            started.current = true;
            run(text);
          }
        }}
        className={`inline-block tabular-nums ${className ?? ""}`}
        {...props}
      >
        {/* Accessible, stable text for assistive tech and copy/paste. */}
        <span className="sr-only">{text}</span>
        <span aria-hidden>
          {cells.map((cell, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: positions map 1:1 to the string
              key={i}
              className={
                cell.done
                  ? undefined
                  : "text-primary [transition:color_120ms_ease]"
              }
            >
              {cell.ch === " " ? " " : cell.ch}
            </span>
          ))}
        </span>
      </span>
    );
  },
);
TextScramble.displayName = "TextScramble";

export { TextScramble };
