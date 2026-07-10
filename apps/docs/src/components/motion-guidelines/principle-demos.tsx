"use client";

import { motion } from "framer-motion";
import { type GalleryItem, TapToPlay, useOneShot } from "./motion-card";
import { EASE, SPRING, STAGGER } from "./motion-tokens";

/**
 * Demos for the Motion Principles gallery. Each one is built to *teach* its
 * principle, using the shared {@link motion-tokens} so the whole gallery speaks
 * one motion language. Tap a card to run its single cycle; it resets on its own.
 * Everything is transform/opacity (plus a little blur for Clarity) and reduces
 * to stillness under `prefers-reduced-motion`.
 */

const SHAPE = "rounded-md bg-foreground";
const SHAPE_MUTED = "rounded-md bg-muted-foreground/35";
const REST = { duration: 0.4, ease: EASE.standard }; // settle back when idle

// 1. Clarity — one element resolves from blurred + dim to sharp + present.
function ClarityDemo() {
  const { play, start, done } = useOneShot();
  return (
    <TapToPlay label="Play Clarity demo" onTap={start}>
      <motion.div
        className={`size-12 ${SHAPE}`}
        animate={
          play
            ? {
                opacity: [0.3, 1, 1],
                filter: ["blur(8px)", "blur(0px)", "blur(0px)"],
                scale: [0.96, 1, 1],
              }
            : { opacity: 1, filter: "blur(0px)", scale: 1 }
        }
        transition={play ? { duration: 1.6, ease: EASE.out } : REST}
        onAnimationComplete={play ? done : undefined}
      />
    </TapToPlay>
  );
}

// 2. Continuity — the same object travels its path; it never teleports.
function ContinuityDemo() {
  const { play, start, done } = useOneShot();
  return (
    <TapToPlay label="Play Continuity demo" onTap={start}>
      <div className="relative flex w-44 items-center justify-between">
        <span className="size-9 rounded-full border border-dashed border-border" />
        <span className="size-9 rounded-full border border-dashed border-border" />
        <motion.div
          className="absolute left-0 size-9 rounded-full bg-foreground"
          animate={play ? { x: [0, 140, 0] } : { x: 0 }}
          transition={play ? { duration: 2, ease: EASE.inOut } : REST}
          onAnimationComplete={play ? done : undefined}
        />
      </div>
    </TapToPlay>
  );
}

// 3. Hierarchy — the primary row leads; secondary rows follow in sequence.
function HierarchyDemo() {
  const { play, start, done } = useOneShot();
  const rows = [
    { w: "w-32", cls: SHAPE, delay: 0 },
    { w: "w-24", cls: SHAPE_MUTED, delay: STAGGER.loose * 2 },
    { w: "w-20", cls: SHAPE_MUTED, delay: STAGGER.loose * 4 },
  ];
  return (
    <TapToPlay label="Play Hierarchy demo" onTap={start}>
      <div className="flex flex-col gap-2.5">
        {rows.map((row, i) => (
          <motion.div
            key={row.w}
            className={`h-3.5 ${row.w} ${row.cls}`}
            animate={
              play ? { opacity: [0, 1], y: [10, 0] } : { opacity: 1, y: 0 }
            }
            transition={
              play ? { duration: 0.5, ease: EASE.out, delay: row.delay } : REST
            }
            onAnimationComplete={
              play && i === rows.length - 1 ? done : undefined
            }
          />
        ))}
      </div>
    </TapToPlay>
  );
}

// 4. Spatial Awareness — a panel enters from the edge it belongs to.
function SpatialAwarenessDemo() {
  const { play, start, done } = useOneShot();
  return (
    <TapToPlay label="Play Spatial Awareness demo" onTap={start}>
      <div className="relative h-24 w-44 overflow-hidden rounded-lg border border-border bg-card/40">
        <span className="absolute inset-y-0 right-0 w-1 bg-border" />
        <motion.div
          className="absolute inset-y-3 right-3 w-20 rounded-md bg-foreground"
          animate={
            play
              ? { x: [96, 0, 0, 96], opacity: [0, 1, 1, 0] }
              : { x: 0, opacity: 1 }
          }
          transition={
            play
              ? { duration: 2.2, times: [0, 0.25, 0.75, 1], ease: EASE.out }
              : REST
          }
          onAnimationComplete={play ? done : undefined}
        />
      </div>
    </TapToPlay>
  );
}

// 5. Feedback — the surface answers the touch: press in, ripple out.
function FeedbackDemo() {
  const { play, start, done } = useOneShot();
  return (
    <TapToPlay label="Play Feedback demo" onTap={start}>
      <div className="relative grid place-items-center">
        {play && (
          <motion.span
            className="absolute size-16 rounded-full border border-foreground/40"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1.7, opacity: [0.5, 0] }}
            transition={{ duration: 0.5, ease: EASE.out }}
          />
        )}
        <motion.div
          className="grid h-11 w-24 place-items-center rounded-lg bg-foreground text-xs font-medium text-background"
          animate={play ? { scale: [1, 0.92, 1] } : { scale: 1 }}
          transition={
            play
              ? { duration: 0.5, times: [0, 0.25, 1], ease: EASE.standard }
              : REST
          }
          onAnimationComplete={play ? done : undefined}
        >
          Tap
        </motion.div>
      </div>
    </TapToPlay>
  );
}

// 6. Timing & Easing — same distance, same time; only the curve differs.
function TimingEasingDemo() {
  const { play, start, done } = useOneShot();
  const tracks: { label: string; ease: "linear" | typeof EASE.inOut }[] = [
    { label: "linear", ease: "linear" },
    { label: "eased", ease: EASE.inOut },
  ];
  return (
    <TapToPlay label="Play Timing and Easing demo" onTap={start}>
      <div className="flex flex-col gap-3">
        {tracks.map((track, i) => (
          <div key={track.label} className="flex items-center gap-2">
            <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
              {track.label}
            </span>
            <div className="relative h-5 w-32 rounded-full bg-muted-foreground/15">
              <motion.span
                className="absolute top-1/2 left-1 size-3.5 -translate-y-1/2 rounded-full bg-foreground"
                animate={{ x: play ? 104 : 0 }}
                transition={play ? { duration: 1.4, ease: track.ease } : REST}
                onAnimationComplete={play && i === 0 ? done : undefined}
              />
            </div>
          </div>
        ))}
      </div>
    </TapToPlay>
  );
}

// 7. Anticipation — a small wind-up backward sells the launch forward.
function AnticipationDemo() {
  const { play, start, done } = useOneShot();
  return (
    <TapToPlay label="Play Anticipation demo" onTap={start}>
      <div className="relative flex w-44 items-center">
        <motion.div
          className="size-10 rounded-full bg-foreground"
          animate={play ? { x: [0, -14, 130, 0] } : { x: 0 }}
          transition={
            play
              ? { duration: 2, times: [0, 0.28, 0.62, 1], ease: EASE.out }
              : REST
          }
          onAnimationComplete={play ? done : undefined}
        />
      </div>
    </TapToPlay>
  );
}

// 8. Follow Through — the trailing element keeps moving, then settles.
function FollowThroughDemo() {
  const { play, start, done } = useOneShot();
  return (
    <TapToPlay label="Play Follow Through demo" onTap={start}>
      <div className="relative flex w-44 items-center">
        <motion.div
          className="size-10 rounded-md bg-foreground"
          animate={play ? { x: 96 } : { x: 0 }}
          transition={play ? { duration: 0.5, ease: EASE.standard } : REST}
        />
        {/* Trailing element lags + overshoots on a spring — the follow-through. */}
        <motion.div
          className="absolute size-7 rounded-md bg-muted-foreground/40"
          animate={play ? { x: 96 } : { x: 0 }}
          transition={play ? { ...SPRING.bouncy, delay: 0.12 } : REST}
          onAnimationComplete={play ? done : undefined}
        />
      </div>
    </TapToPlay>
  );
}

// 9. Rhythm — an even, staggered cadence reads as a single coordinated wave.
function RhythmDemo() {
  const { play, start, done } = useOneShot();
  const bars = [0, 1, 2, 3, 4];
  return (
    <TapToPlay label="Play Rhythm demo" onTap={start}>
      <div className="flex items-end gap-2">
        {bars.map((i) => (
          <motion.span
            key={i}
            className="h-10 w-2.5 rounded-full bg-foreground"
            style={{ transformOrigin: "bottom" }}
            animate={play ? { scaleY: [0.4, 1, 0.4] } : { scaleY: 0.7 }}
            transition={
              play
                ? { duration: 1, ease: EASE.inOut, delay: i * STAGGER.base }
                : REST
            }
            onAnimationComplete={
              play && i === bars.length - 1 ? done : undefined
            }
          />
        ))}
      </div>
    </TapToPlay>
  );
}

// 10. Restraint — the smallest possible move. Calm, not absent.
function RestraintDemo() {
  const { play, start, done } = useOneShot();
  return (
    <TapToPlay label="Play Restraint demo" onTap={start}>
      <motion.div
        className="size-10 rounded-full bg-foreground"
        animate={
          play
            ? { opacity: [0.55, 1, 0.55], y: [0, -3, 0] }
            : { opacity: 0.85, y: 0 }
        }
        transition={play ? { duration: 1.8, ease: EASE.inOut } : REST}
        onAnimationComplete={play ? done : undefined}
      />
    </TapToPlay>
  );
}

// 11. Performance — only transform & opacity, so it stays at 60fps.
function PerformanceDemo() {
  const { play, start, done } = useOneShot();
  return (
    <TapToPlay label="Play Performance demo" onTap={start}>
      <div className="flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-8 rounded-lg bg-foreground"
            animate={
              play
                ? { y: [0, -16, 0], scale: [1, 0.85, 1] }
                : { y: 0, scale: 1 }
            }
            transition={
              play
                ? { duration: 0.9, ease: EASE.inOut, delay: i * STAGGER.base }
                : REST
            }
            onAnimationComplete={play && i === 2 ? done : undefined}
          />
        ))}
      </div>
    </TapToPlay>
  );
}

// 12. Accessibility — honor reduced motion: drop transforms, keep opacity.
function AccessibilityDemo() {
  const { play, start, done } = useOneShot();
  const cols: { label: string; reduced: boolean }[] = [
    { label: "default", reduced: false },
    { label: "reduced", reduced: true },
  ];
  return (
    <TapToPlay label="Play Accessibility demo" onTap={start}>
      <div className="flex items-end gap-6">
        {cols.map((col, i) => (
          <div key={col.label} className="flex flex-col items-center gap-2">
            <div className="grid h-16 place-items-center">
              <motion.span
                className="size-9 rounded-lg bg-foreground"
                animate={
                  play
                    ? col.reduced
                      ? { opacity: [0, 1] }
                      : { opacity: [0, 1], y: [16, 0] }
                    : { opacity: 1, y: 0 }
                }
                transition={play ? { duration: 0.5, ease: EASE.out } : REST}
                onAnimationComplete={play && i === 0 ? done : undefined}
              />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              {col.label}
            </span>
          </div>
        ))}
      </div>
    </TapToPlay>
  );
}

export const PRINCIPLES: GalleryItem[] = [
  {
    slug: "clarity",
    title: "Clarity",
    description:
      "Every motion should clarify what changed and why. One focal change at a time, never noise.",
    origins: ["material", "apple"],
    Demo: ClarityDemo,
  },
  {
    slug: "continuity",
    title: "Continuity",
    description:
      "Objects move along visible paths instead of teleporting, so the eye never loses the thread.",
    origins: ["apple", "material"],
    Demo: ContinuityDemo,
  },
  {
    slug: "hierarchy",
    title: "Hierarchy",
    description:
      "Sequence and emphasis tell you what matters first. The primary element leads; the rest follow.",
    origins: ["material", "apple"],
    Demo: HierarchyDemo,
  },
  {
    slug: "spatial-awareness",
    title: "Spatial Awareness",
    description:
      "Elements enter and exit from where they live, reinforcing a stable mental model of the layout.",
    origins: ["apple", "material"],
    Demo: SpatialAwarenessDemo,
  },
  {
    slug: "feedback",
    title: "Feedback",
    description:
      "The interface answers every input immediately, confirming the action landed before anything else.",
    origins: ["apple", "material"],
    Demo: FeedbackDemo,
  },
  {
    slug: "timing-easing",
    title: "Timing & Easing",
    description:
      "The curve is the character. Natural motion accelerates and settles; it rarely moves at a constant speed.",
    origins: ["disney", "material"],
    Demo: TimingEasingDemo,
  },
  {
    slug: "anticipation",
    title: "Anticipation",
    description:
      "A subtle wind-up before a move primes the eye and makes the action feel intentional, not abrupt.",
    origins: ["disney"],
    Demo: AnticipationDemo,
  },
  {
    slug: "follow-through",
    title: "Follow Through",
    description:
      "Motion doesn't stop on a dime. Trailing elements keep going and settle, giving weight and life.",
    origins: ["disney"],
    Demo: FollowThroughDemo,
  },
  {
    slug: "rhythm",
    title: "Rhythm",
    description:
      "Consistent stagger and cadence turn many moving parts into one coordinated, legible gesture.",
    origins: ["disney", "material"],
    Demo: RhythmDemo,
  },
  {
    slug: "restraint",
    title: "Restraint",
    description:
      "The best motion is felt, not noticed. When in doubt, do less — subtle beats flashy every time.",
    origins: ["apple"],
    Demo: RestraintDemo,
  },
  {
    slug: "performance",
    title: "Performance",
    description:
      "Animate only transform and opacity so motion stays at a buttery 60fps, and keep springs interruptible.",
    origins: ["material"],
    Demo: PerformanceDemo,
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    description:
      "Honor prefers-reduced-motion: drop transforms, keep a subtle opacity change, and the interface still reads.",
    origins: ["apple", "material"],
    Demo: AccessibilityDemo,
  },
];
