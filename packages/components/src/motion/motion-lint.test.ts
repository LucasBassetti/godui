import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { MOTION_ALLOWLIST } from "./motion-allowlist";
import { scanSource, type Violation } from "./motion-lint";

/**
 * Motion Performance CI gate. Scans every component source file and asserts that
 * no animation touches a GATED (layout / paint-heavy) property unless it is
 * sanctioned in MOTION_ALLOWLIST. Banned patterns (`transition-all`, ambient
 * layout loops) can never be allowlisted. See motion-lint.ts for the policy.
 */

const SRC = dirname(dirname(fileURLToPath(import.meta.url))); // packages/components/src

/** Every `<dir>/<file>.tsx` under src, excluding tests and stories. */
function componentFiles(): string[] {
  const out: string[] = [];
  for (const dir of readdirSync(SRC, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    for (const f of readdirSync(join(SRC, dir.name))) {
      if (!f.endsWith(".tsx")) continue;
      if (f.endsWith(".test.tsx") || f.endsWith(".stories.tsx")) continue;
      out.push(`${dir.name}/${f}`);
    }
  }
  return out;
}

const files = componentFiles();

function allowed(rel: string, prop: string): boolean {
  return (MOTION_ALLOWLIST[rel] ?? []).some((e) => e.prop === prop);
}

describe("motion performance guardrail", () => {
  const scanned = files.map((rel) => ({
    rel,
    violations: scanSource(readFileSync(join(SRC, rel), "utf8")),
  }));

  it("bans transition-all and ambient layout loops (no allowlist escape)", () => {
    const banned: string[] = [];
    for (const { rel, violations } of scanned) {
      for (const v of violations.filter((x) => x.kind === "banned")) {
        banned.push(`${rel}:${v.line} — ${v.raw} (animates \`${v.prop}\`)`);
      }
    }
    expect(
      banned,
      banned.length
        ? `\nBANNED motion patterns — fix these, they cannot be allowlisted:\n  ${banned.join("\n  ")}\n`
        : undefined,
    ).toEqual([]);
  });

  it("gates layout/paint-heavy animation behind MOTION_ALLOWLIST", () => {
    const uncovered: string[] = [];
    for (const { rel, violations } of scanned) {
      for (const v of violations.filter((x) => x.kind === "gated")) {
        if (!allowed(rel, v.prop)) {
          uncovered.push(
            `${rel}:${v.line} — animates \`${v.prop}\` (${v.raw})`,
          );
        }
      }
    }
    expect(
      uncovered,
      uncovered.length
        ? `\nGATED animation missing a MOTION_ALLOWLIST entry.\nEither convert it to transform/opacity/filter, or add an entry with a reason:\n  ${uncovered.join("\n  ")}\n`
        : undefined,
    ).toEqual([]);
  });

  // Self-tests — guarantee the scanner still detects things (regex rot would
  // otherwise make every file silently pass).
  it("detects the patterns it is meant to catch", () => {
    const kinds = (src: string) =>
      scanSource(src).map((v) => `${v.kind}:${v.prop}`);

    expect(kinds('className="transition-all"')).toContain("banned:all");
    expect(kinds("[transition:width_200ms_ease]")).toContain("gated:width");
    expect(kinds("[transition:box-shadow_300ms]")).toContain("gated:boxshadow");
    expect(kinds("animate={{ height: measured }}")).toContain("gated:height");
    // ambient loop of a layout prop → banned, no allowlist escape
    expect(
      kinds("animate={{ width: 100, transition: { repeat: Infinity } }}"),
    ).toContain("banned:width");
  });

  it("passes clean compositor-only animation", () => {
    expect(scanSource("[transition:transform_200ms,opacity_150ms]")).toEqual(
      [],
    );
    expect(scanSource('className="transition-colors"')).toEqual([]);
    expect(scanSource("animate={{ x: 100, opacity: 1, scale: 1.1 }}")).toEqual(
      [],
    );
    expect(scanSource('animate={{ filter: "blur(0px)" }}')).toEqual([]);
    // height:auto still gates (allowlisted per file) — but z-index/cursor don't
    expect(scanSource("animate={{ zIndex: 2, cursor: 'grabbing' }}")).toEqual(
      [],
    );
  });

  it("has no stale MOTION_ALLOWLIST entries", () => {
    const byFile = new Map<string, Violation[]>(
      scanned.map(({ rel, violations }) => [rel, violations]),
    );
    const stale: string[] = [];
    for (const [rel, entries] of Object.entries(MOTION_ALLOWLIST)) {
      const vs = byFile.get(rel);
      for (const e of entries) {
        const live = vs?.some((v) => v.kind === "gated" && v.prop === e.prop);
        if (!live) stale.push(`${rel} → "${e.prop}" (${e.reason})`);
      }
    }
    expect(
      stale,
      stale.length
        ? `\nStale MOTION_ALLOWLIST entries (no matching violation) — remove them:\n  ${stale.join("\n  ")}\n`
        : undefined,
    ).toEqual([]);
  });
});
