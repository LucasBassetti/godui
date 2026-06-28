"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { type GalleryItem, TapToPlay, useOneShot } from "./motion-card";
import { DURATION, EASE, SPRING, STAGGER } from "./motion-tokens";

/**
 * Demos for the Motion Patterns gallery — the concrete recipes that implement
 * the principles, built from the shared {@link motion-tokens}. Some are directly
 * interactive (press / hover / toggle the element); the rest play a single cycle
 * when the card is tapped, then reset.
 */

const REST = { duration: 0.4, ease: EASE.standard };
const TRIGGER = cn(
  "inline-flex h-8 items-center justify-center rounded-lg border border-border bg-card px-3",
  "font-medium text-foreground text-xs transition-colors hover:bg-muted",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
);
const SURFACE =
  "grid h-16 w-28 place-items-center rounded-xl bg-foreground text-background text-sm font-medium";

// Enter — fade up into place on a soft spring. Tap to replay.
function EnterDemo() {
  const { play, start, done } = useOneShot();
  return (
    <TapToPlay label="Play Enter demo" onTap={start}>
      <motion.div
        className={SURFACE}
        animate={play ? { opacity: [0, 1], y: [14, 0] } : { opacity: 1, y: 0 }}
        transition={play ? SPRING.smooth : REST}
        onAnimationComplete={play ? done : undefined}
      >
        Enter
      </motion.div>
    </TapToPlay>
  );
}

// Exit — fade down and out, then snap back. Tap to replay.
function ExitDemo() {
  const { play, start, done } = useOneShot();
  return (
    <TapToPlay label="Play Exit demo" onTap={start}>
      <motion.div
        className={SURFACE}
        animate={play ? { opacity: [1, 0], y: [0, 10] } : { opacity: 1, y: 0 }}
        transition={
          play ? { duration: DURATION.slow, ease: EASE.standard } : REST
        }
        onAnimationComplete={play ? done : undefined}
      >
        Exit
      </motion.div>
    </TapToPlay>
  );
}

// Spring Pop — scale + opacity pop for menus and popovers.
function SpringPopDemo() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        className={TRIGGER}
        onClick={() => setOpen((v) => !v)}
      >
        Toggle menu
      </button>
      <div className="grid h-24 place-items-start">
        <AnimatePresence>
          {open && (
            <motion.div
              className="w-36 rounded-xl border border-border bg-card p-2 shadow-lg"
              style={{ transformOrigin: "top center" }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={reduce ? { duration: DURATION.base } : SPRING.snappy}
            >
              {["Profile", "Settings", "Sign out"].map((item) => (
                <div
                  key={item}
                  className="rounded-md px-2.5 py-1.5 text-foreground text-xs hover:bg-muted"
                >
                  {item}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Spring Height — animate height: auto for collapse / expand.
function SpringHeightDemo() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  return (
    <div className="w-52 rounded-xl border border-border bg-card">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 text-foreground text-xs font-medium"
        onClick={() => setOpen((v) => !v)}
      >
        Details
        <span className="text-muted-foreground">{open ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{
              height: reduce ? { duration: 0 } : SPRING.crisp,
              opacity: { duration: DURATION.base },
            }}
          >
            <p className="px-3 pb-3 text-muted-foreground text-xs">
              Height springs from 0 to auto while opacity fades.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hover Lift — lift + shadow on hover. Reduced-motion stays put.
function HoverLiftDemo() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="grid h-20 w-32 cursor-default place-items-center rounded-xl border border-border bg-card text-foreground text-sm shadow-sm"
      whileHover={
        reduce
          ? undefined
          : { y: -8, boxShadow: "0 16px 32px rgb(0 0 0 / 0.1)" }
      }
      transition={{ duration: 0.3, ease: EASE.standard }}
    >
      Hover me
    </motion.div>
  );
}

// Stagger Reveal — children cascade in with a shared cadence. Tap to replay.
function StaggerRevealDemo() {
  const { play, start, done } = useOneShot();
  const items = ["Overview", "Activity", "Members", "Billing"];
  return (
    <TapToPlay label="Play Stagger Reveal demo" onTap={start}>
      <div className="flex w-44 flex-col gap-2">
        {items.map((item, i) => (
          <motion.div
            key={item}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-foreground text-xs"
            animate={
              play ? { opacity: [0, 1], y: [10, 0] } : { opacity: 1, y: 0 }
            }
            transition={
              play
                ? { duration: 0.4, ease: EASE.out, delay: i * STAGGER.loose }
                : REST
            }
            onAnimationComplete={
              play && i === items.length - 1 ? done : undefined
            }
          >
            {item}
          </motion.div>
        ))}
      </div>
    </TapToPlay>
  );
}

// Backdrop Fade — scrim fades in, content pops on a spring.
function BackdropFadeDemo() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative grid h-28 w-44 place-items-center overflow-hidden rounded-xl border border-border bg-card">
      <button type="button" className={TRIGGER} onClick={() => setOpen(true)}>
        Open
      </button>
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 grid place-items-center bg-foreground/40 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : DURATION.base }}
          >
            <motion.span
              className="rounded-lg bg-card px-3 py-1.5 text-foreground text-xs shadow-lg"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={reduce ? { duration: DURATION.base } : SPRING.smooth}
            >
              Tap to close
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// Shared-Layout Morph — one surface grows between two states. Tap to toggle.
function SharedLayoutMorphDemo() {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      className="grid place-items-center bg-foreground text-background text-xs"
      animate={
        expanded
          ? { width: 176, height: 72, borderRadius: 20 }
          : { width: 56, height: 56, borderRadius: 12 }
      }
      transition={reduce ? { duration: 0 } : SPRING.smooth}
    >
      {expanded ? "Expanded" : "Tap"}
    </motion.button>
  );
}

// Press Feedback — a quick scale-down confirms the press.
function PressFeedbackDemo() {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      className="rounded-xl bg-foreground px-6 py-3 font-medium text-background text-sm"
      whileTap={reduce ? undefined : { scale: 0.94 }}
      transition={SPRING.snappy}
    >
      Press me
    </motion.button>
  );
}

// Loop — a seamless, continuous marquee.
function LoopDemo() {
  const reduce = useReducedMotion();
  const items = ["Ship", "Iterate", "Polish", "Repeat"];
  const track = [
    ...items.map((t) => ({ label: t, key: `${t}-a` })),
    ...items.map((t) => ({ label: t, key: `${t}-b` })),
  ];
  return (
    <div className="w-44 overflow-hidden rounded-xl border border-border bg-card py-2.5">
      <motion.div
        className="flex w-max gap-2 pl-2"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{
          duration: 6,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {track.map(({ label, key }) => (
          <span
            key={key}
            className="whitespace-nowrap rounded-md bg-muted px-2.5 py-1 text-foreground text-xs"
          >
            {label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export const PATTERNS: GalleryItem[] = [
  {
    slug: "enter",
    title: "Enter",
    description:
      "Bring an element in with a gentle fade-up on a soft spring. Serves Clarity.",
    Demo: EnterDemo,
  },
  {
    slug: "exit",
    title: "Exit",
    description:
      "Send it out the way it came, but faster — exits should never linger. Serves Continuity.",
    Demo: ExitDemo,
  },
  {
    slug: "spring-pop",
    title: "Spring Pop",
    description:
      "Scale and fade together for menus, popovers, and tooltips. Serves Spatial Awareness.",
    Demo: SpringPopDemo,
  },
  {
    slug: "spring-height",
    title: "Spring Height",
    description:
      "Animate height to auto for accordions, fading opacity alongside. Serves Continuity.",
    Demo: SpringHeightDemo,
  },
  {
    slug: "hover-lift",
    title: "Hover Lift",
    description:
      "A small lift and shadow on hover gives cards and tiles weight. Serves Feedback.",
    Demo: HoverLiftDemo,
  },
  {
    slug: "stagger-reveal",
    title: "Stagger Reveal",
    description:
      "Cascade children with a shared stagger so a list reads as one wave. Serves Rhythm.",
    Demo: StaggerRevealDemo,
  },
  {
    slug: "backdrop-fade",
    title: "Backdrop Fade",
    description:
      "Fade the scrim independently from the content's spring. Serves Hierarchy.",
    Demo: BackdropFadeDemo,
  },
  {
    slug: "shared-layout-morph",
    title: "Shared-Layout Morph",
    description:
      "One surface morphs between two states instead of teleporting. Serves Continuity.",
    Demo: SharedLayoutMorphDemo,
  },
  {
    slug: "press-feedback",
    title: "Press Feedback",
    description:
      "A quick scale-down confirms the press before anything else happens. Serves Feedback.",
    Demo: PressFeedbackDemo,
  },
  {
    slug: "loop",
    title: "Loop",
    description:
      "A seamless marquee: duplicate the track and translate by half. Serves Restraint.",
    Demo: LoopDemo,
  },
];
