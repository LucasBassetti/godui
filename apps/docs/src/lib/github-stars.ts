import { cache } from "react";

const REPO = "LucasBassetti/godui";

/**
 * Server-side star count. Cached in Next's data cache for 1 day so the value is
 * baked into the initial HTML — no client fetch, no icon-then-number layout
 * shift — while staying well under GitHub's unauthenticated rate limit.
 * This fetch runs in the root layout, so its `revalidate` sets the ISR window
 * for the whole route tree (~218 pages). A 1-day window keeps ISR cache writes
 * ~24× lower than the previous 1h while the star count stays fresh enough.
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
      next: { revalidate: 86400 },
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
