"use client";

import * as React from "react";

export type TerminalLineType = "command" | "output" | "comment";

export type TerminalLine = {
  /** Text of the line. */
  text: string;
  /** How the line reads: a typed command, static output, or a dim comment. */
  type?: TerminalLineType;
  /** Prompt shown before a command line. Defaults to the terminal `promptSymbol`. */
  prompt?: string;
  /** Delay before a non-command line appears, in ms. */
  delay?: number;
};

export type TerminalProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> & {
  /** The scripted lines to play out. */
  lines: TerminalLine[];
  /** Milliseconds per character while typing a command. */
  typingSpeed?: number;
  /** Start playing only once scrolled into view. */
  startOnView?: boolean;
  /** Restart from the top after finishing. */
  loop?: boolean;
  /** Title shown in the window chrome. */
  title?: string;
  /** Render the traffic-light window chrome. */
  showChrome?: boolean;
  /** Default prompt symbol for command lines. */
  promptSymbol?: string;
};

const ROOT_BASE =
  "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm";
const HEADER_BASE =
  "flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5";
const BODY_BASE =
  "space-y-1 p-4 font-mono text-[13px] leading-relaxed [font-variant-ligatures:none]";

const LINE_COLOR: Record<TerminalLineType, string> = {
  command: "text-foreground",
  output: "text-muted-foreground",
  comment: "text-muted-foreground/70",
};

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

const Caret = () => (
  <span
    aria-hidden
    className="ml-0.5 inline-block h-[1.1em] w-[0.55ch] translate-y-[0.15em] bg-primary align-baseline animate-pulse motion-reduce:animate-none"
  />
);

const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  (
    {
      lines,
      typingSpeed = 38,
      startOnView = true,
      loop = false,
      title,
      showChrome = true,
      promptSymbol = "$",
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );

    const reduced = usePrefersReducedMotion();
    const [active, setActive] = React.useState(!startOnView);
    // `count` = fully rendered lines; `typed` = chars typed on the current line.
    const [count, setCount] = React.useState(0);
    const [typed, setTyped] = React.useState(0);

    // Kick off once the terminal scrolls into view.
    React.useEffect(() => {
      if (!startOnView || active) return;
      const el = ref.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setActive(true);
            io.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      io.observe(el);
      return () => io.disconnect();
    }, [startOnView, active]);

    // Reduced motion: reveal everything immediately, no typing.
    React.useEffect(() => {
      if (reduced && active) {
        setCount(lines.length);
        setTyped(0);
      }
    }, [reduced, active, lines.length]);

    // The typing / reveal state machine.
    React.useEffect(() => {
      if (!active || reduced) return;

      if (count >= lines.length) {
        if (!loop) return;
        const id = window.setTimeout(() => {
          setCount(0);
          setTyped(0);
        }, 2000);
        return () => window.clearTimeout(id);
      }

      const line = lines[count];
      const isCommand = (line.type ?? "output") === "command";

      if (isCommand && typed < line.text.length) {
        const id = window.setTimeout(() => setTyped((t) => t + 1), typingSpeed);
        return () => window.clearTimeout(id);
      }

      const pause = isCommand ? 320 : (line.delay ?? 380);
      const id = window.setTimeout(() => {
        setCount((c) => c + 1);
        setTyped(0);
      }, pause);
      return () => window.clearTimeout(id);
    }, [active, reduced, count, typed, lines, typingSpeed, loop]);

    const done = count >= lines.length;

    // Stable, unique keys that don't lean on the array index (dedupes repeats).
    const keys = React.useMemo(() => {
      const seen = new Map<string, number>();
      return lines.map((line) => {
        const base = `${line.type ?? "output"}:${line.text}`;
        const n = seen.get(base) ?? 0;
        seen.set(base, n + 1);
        return `${base}#${n}`;
      });
    }, [lines]);

    return (
      <div
        ref={ref}
        data-slot="terminal"
        className={`${ROOT_BASE} ${className ?? ""}`}
        {...props}
      >
        {showChrome ? (
          <div className={HEADER_BASE}>
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-3 rounded-full bg-red-500/80" />
              <span className="size-3 rounded-full bg-yellow-500/80" />
              <span className="size-3 rounded-full bg-green-500/80" />
            </div>
            {title ? (
              <span className="flex-1 text-center text-xs text-muted-foreground">
                {title}
              </span>
            ) : null}
            {title ? <div className="w-[54px]" aria-hidden /> : null}
          </div>
        ) : null}

        <div className={BODY_BASE}>
          {/* Full transcript for assistive tech; the animated view is aria-hidden. */}
          <div className="sr-only">
            {lines.map((line, i) => (
              <div key={`sr-${keys[i]}`}>
                {line.type === "command"
                  ? `${line.prompt ?? promptSymbol} ${line.text}`
                  : line.text}
              </div>
            ))}
          </div>

          <div aria-hidden>
            {lines.map((line, i) => {
              const type = line.type ?? "output";
              const isCommand = type === "command";
              const isCurrent = i === count;
              const isRevealed = i < count;

              // Non-command lines only appear once fully advanced past.
              if (
                !isRevealed &&
                !(isCurrent && isCommand && active && !reduced)
              ) {
                return null;
              }

              const text =
                isCommand && isCurrent && !reduced
                  ? line.text.slice(0, typed)
                  : line.text;
              const showCaret =
                !reduced &&
                ((isCurrent && isCommand) ||
                  (done && i === lines.length - 1 && loop === false));

              return (
                <div
                  key={keys[i]}
                  className={`whitespace-pre-wrap break-words ${LINE_COLOR[type]}`}
                >
                  {isCommand ? (
                    <span className="mr-2 select-none text-primary">
                      {line.prompt ?? promptSymbol}
                    </span>
                  ) : null}
                  {text}
                  {showCaret ? <Caret /> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);
Terminal.displayName = "Terminal";

export { Terminal };
