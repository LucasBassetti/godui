import { cache } from "react";

const REPO = "LucasBassetti/godui";

/**
 * Server-side star count, resolved at BUILD time and baked into the static HTML
 * (`cache: "force-cache"`) — so the number is in the initial paint with no
 * client pop-in or layout shift.
 *
 * This fetch runs in the root layout, so a time-based `revalidate` here would
 * set an ISR window on the WHOLE route tree (~218 pages), and every page would
 * re-write its ISR cache each window — the source of the huge ISR write bill.
 * `force-cache` gives the value no expiry: pages stay fully static and never
 * revalidate at runtime, so the docs contribute ~zero ISR writes (they only
 * rebuild on deploy, which is when the star count also refreshes). The badge is
 * kept live between deploys by a lightweight client refresh in <GitHubStars>,
 * which updates the already-rendered number in place (still no layout shift).
 *
 * React `cache` dedupes it within a single render pass. Returns null on any
 * failure; the badge then renders the icon alone.
 */
export const getGitHubStars = cache(async (): Promise<number | null> => {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "godui-docs",
      },
      cache: "force-cache",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
});
