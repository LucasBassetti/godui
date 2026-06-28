"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import * as React from "react";
import { presenceColor } from "../lib/presence";

export type LiveCursor = {
  id: string;
  name: string;
  /** Position in pixels, relative to the LiveCursors container. */
  x: number;
  y: number;
  /** Override the auto-assigned presence color. */
  color?: string;
  /** Optional cursor-chat message rendered beside the pointer. */
  message?: string;
};

export type LiveCursorsProps = React.HTMLAttributes<HTMLDivElement> & {
  cursors: LiveCursor[];
  /** Hide the name flag, showing only pointers. */
  hideNames?: boolean;
};

const LiveCursors = React.forwardRef<HTMLDivElement, LiveCursorsProps>(
  ({ cursors, hideNames = false, className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="live-cursors"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      {...props}
    >
      <AnimatePresence>
        {cursors.map((cursor) => (
          <CursorFlag key={cursor.id} cursor={cursor} hideName={hideNames} />
        ))}
      </AnimatePresence>
    </div>
  ),
);
LiveCursors.displayName = "LiveCursors";

function CursorFlag({
  cursor,
  hideName,
}: {
  cursor: LiveCursor;
  hideName: boolean;
}) {
  const reduce = useReducedMotion();
  const config = { stiffness: 700, damping: 40, mass: 0.6 };
  const x = useSpring(cursor.x, config);
  const y = useSpring(cursor.y, config);
  const color = cursor.color ?? presenceColor(cursor.id);

  React.useEffect(() => {
    if (reduce) {
      x.jump(cursor.x);
      y.jump(cursor.y);
    } else {
      x.set(cursor.x);
      y.set(cursor.y);
    }
  }, [cursor.x, cursor.y, x, y, reduce]);

  return (
    <motion.div
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 top-0 z-popover flex items-start"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        className="shrink-0 drop-shadow-sm"
        aria-hidden="true"
        style={{ color }}
      >
        <path
          d="M5 3l5.5 16 2.2-6.8L19.5 10z"
          fill="currentColor"
          stroke="white"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </svg>
      {!hideName || cursor.message ? (
        <span
          className="mt-3 -ml-1 max-w-[14rem] truncate rounded-[10px] rounded-tl-sm px-2 py-0.5 text-xs font-medium text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {cursor.message ?? cursor.name}
        </span>
      ) : null}
    </motion.div>
  );
}

export type SimulatedCursorsProps = Omit<LiveCursorsProps, "cursors"> & {
  /** Names to animate. Defaults to four sample teammates. */
  names?: string[];
};

const DEFAULT_NAMES = ["Ana", "Marco", "Priya", "Jules"];

/**
 * Self-driving peers for demos, stories, and marketing. Each peer drifts on a
 * smooth random walk inside the container. Pauses under reduced motion.
 */
const SimulatedCursors = React.forwardRef<
  HTMLDivElement,
  SimulatedCursorsProps
>(({ names = DEFAULT_NAMES, ...props }, ref) => {
  const reduce = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  const [cursors, setCursors] = React.useState<LiveCursor[]>([]);
  const stateRef = React.useRef(
    names.map((name, i) => ({
      id: `peer-${i}`,
      name,
      x: 0.3 + Math.random() * 0.4,
      y: 0.3 + Math.random() * 0.4,
      tx: Math.random(),
      ty: Math.random(),
    })),
  );

  React.useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const tick = () => {
      const el = containerRef.current;
      const w = el?.clientWidth ?? 480;
      const h = el?.clientHeight ?? 320;
      const peers = stateRef.current;
      for (const peer of peers) {
        peer.x += (peer.tx - peer.x) * 0.02;
        peer.y += (peer.ty - peer.y) * 0.02;
        if (Math.abs(peer.tx - peer.x) < 0.02)
          peer.tx = 0.1 + Math.random() * 0.8;
        if (Math.abs(peer.ty - peer.y) < 0.02)
          peer.ty = 0.1 + Math.random() * 0.8;
      }
      setCursors(
        peers.map((p) => ({
          id: p.id,
          name: p.name,
          x: p.x * w,
          y: p.y * h,
        })),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return <LiveCursors ref={containerRef} cursors={cursors} {...props} />;
});
SimulatedCursors.displayName = "SimulatedCursors";

export { LiveCursors, SimulatedCursors };
