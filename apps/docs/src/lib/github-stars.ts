import { cache } from "react";

const REPO = "LucasBassetti/godui";

/**
 * Server-side star count. Cached in Next's data cache for 1h so the value is
 * baked into the initial HTML — no client fetch, no icon-then-number layout
 * shift — while staying well under GitHub's unauthenticated rate limit
 * (~1 request/hour). React `cache` dedupes it within a single render pass.
 * Returns null on any failure; the badge then renders the icon alone.
 */
export const getGitHubStars = cache(async (): Promise<number | null> => {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "godui-docs",
      },
      next: { revalidate: 3600 },
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
