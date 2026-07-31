"use client";

import { createContext, type ReactNode, useContext } from "react";

/**
 * Page-level metadata the MDX body doesn't own. Set by the docs page and read by
 * <LearnPlayer> so it can render the article title + description *below* the
 * pinned preview (instead of the default position above the body).
 */
export type LearnMeta = {
  title: string;
  description?: string;
};

const LearnMetaContext = createContext<LearnMeta | null>(null);

export function LearnPlayerProvider({
  value,
  children,
}: {
  value: LearnMeta;
  children: ReactNode;
}) {
  return (
    <LearnMetaContext.Provider value={value}>
      {children}
    </LearnMetaContext.Provider>
  );
}

/** Returns the article meta, or null when rendered outside a provider. */
export function useLearnMeta(): LearnMeta | null {
  return useContext(LearnMetaContext);
}
