import type { ReactNode } from "react";

export type LearnChapterProps = {
  /** Short rail label + numbered step name, e.g. "The goo filter". */
  label: string;
  /**
   * The animated scene body for this chapter — a raw `*Body` element (no card
   * chrome). `LearnPlayer` injects `{ cycle, reduced }` via `cloneElement`, so
   * the element you pass should accept those (all the gooey `*Body` scenes do).
   */
  scene: ReactNode;
  /** Source shown in the stage's Code tab. Omit to hide the Code tab entirely. */
  code?: string;
  /** Language for the Code tab (default "tsx"). */
  lang?: string;
  /**
   * Marks the final "live component" chapter. Its scene is interactive (not a
   * replayable animation), so the stage hides the Replay control for it.
   */
  isResult?: boolean;
  /** The prose shown below the stage while this chapter is active. */
  children: ReactNode;
};

/**
 * Declares one chapter inside a <LearnPlayer>. Renders nothing on its own —
 * <LearnPlayer> (a server component) reads its props to build the carousel.
 * Kept as a stable module identity so `child.type === LearnChapter` matches
 * across the server-MDX → client boundary.
 */
export function LearnChapter(_props: LearnChapterProps): null {
  return null;
}
