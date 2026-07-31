"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { SceneAnim } from "@/components/learn/scroll-scene";

/**
 * When a Learn scene is rendered on the `LearnPlayer` stage (rather than the
 * classic scroll layout), the player owns the card chrome and the play lifecycle.
 * This context signals that: any `<ScrollScene>` (or a `*-result` card) inside it
 * renders its body ONLY — no border, bar, replay or IntersectionObserver — and
 * reads `cycle` / `reduced` from here. Absent (null) = classic standalone card.
 */
export type BareScene = SceneAnim;

const BareSceneContext = createContext<BareScene | null>(null);

export function BareSceneProvider({
  value,
  children,
}: {
  value: BareScene;
  children: ReactNode;
}) {
  return (
    <BareSceneContext.Provider value={value}>
      {children}
    </BareSceneContext.Provider>
  );
}

/** Returns the player's scene state when rendered on the stage, else null. */
export function useBareScene(): BareScene | null {
  return useContext(BareSceneContext);
}
