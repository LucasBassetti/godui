"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/copy-button";

// Real registry slugs (public/r/<slug>.json) — the command stays runnable
// whichever name is on screen when someone copies it.
const SLUGS = [
  "jelly-button",
  "aurora-text",
  "globe",
  "dynamic-island",
  "dock",
  "world-map",
  "orbiting-circles",
  "text-scramble",
];

const PREFIX = 'npx shadcn@latest add "https://godui.design/r/';
const SUFFIX = '.json"';
const INTERVAL_MS = 2200;

export function AnimatedInstall() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const slug = SLUGS[index];
  const command = `${PREFIX}${slug}${SUFFIX}`;

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLUGS.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-fd-border bg-fd-background px-5 py-4 text-left shadow-sm">
      <span aria-hidden="true" className="font-mono text-fd-primary text-sm">
        $
      </span>
      {/* sr-only carries the full current command; the visible split is
          aria-hidden so only the component name animates on screen. */}
      <code className="flex min-w-0 flex-1 items-baseline overflow-hidden font-mono text-fd-muted-foreground text-sm sm:text-base">
        <span className="sr-only">{command}</span>
        <span aria-hidden="true" className="truncate">
          {PREFIX}
        </span>
        <span aria-hidden="true" className="relative inline-flex">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={slug}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 8, filter: "blur(6px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -8, filter: "blur(6px)" }
              }
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="whitespace-nowrap font-semibold text-fd-foreground"
            >
              {slug}
            </motion.span>
          </AnimatePresence>
        </span>
        <span aria-hidden="true">{SUFFIX}</span>
      </code>
      <CopyButton value={command} className="size-8 shrink-0 rounded-md" />
    </div>
  );
}
