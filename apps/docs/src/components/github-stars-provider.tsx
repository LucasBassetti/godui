"use client";

import { createContext, type ReactNode, useContext } from "react";

/**
 * Carries the server-fetched GitHub star count to the (client) header badges.
 * The count is fetched once in the root layout (`getGitHubStars`) and provided
 * here, so it's present during SSR — the badge renders the number in the initial
 * HTML with no client fetch or layout shift. null means the fetch failed.
 */
const GitHubStarsContext = createContext<number | null>(null);

export function GitHubStarsProvider({
  value,
  children,
}: {
  value: number | null;
  children: ReactNode;
}) {
  return (
    <GitHubStarsContext.Provider value={value}>
      {children}
    </GitHubStarsContext.Provider>
  );
}

export function useGitHubStars(): number | null {
  return useContext(GitHubStarsContext);
}
