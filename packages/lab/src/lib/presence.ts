/**
 * Shared per-user presence palette.
 *
 * Used by collaboration components (LiveCursors, PresenceFacepile, CommentPin)
 * so the same user is rendered in a stable, distinct color everywhere.
 */

/** The presence color ramp — distinct, accessible hues in oklch. */
export const PRESENCE_COLORS = [
  "oklch(0.62 0.2 25)", // red
  "oklch(0.7 0.17 60)", // amber
  "oklch(0.72 0.16 145)", // green
  "oklch(0.65 0.15 195)", // teal
  "oklch(0.6 0.18 250)", // blue
  "oklch(0.58 0.22 300)", // violet
  "oklch(0.62 0.22 350)", // pink
  "oklch(0.68 0.15 110)", // lime
] as const;

/** Deterministic 32-bit hash of a string. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Resolve a stable presence color for an identity (id, name, email, …).
 * The same key always maps to the same color.
 */
export function presenceColor(key: string): string {
  return PRESENCE_COLORS[hashString(key) % PRESENCE_COLORS.length];
}

/** Two-letter initials from a display name. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
