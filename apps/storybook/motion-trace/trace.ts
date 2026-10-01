import { expect, type Page } from "@playwright/test";

type TraceEvent = {
  name: string;
  ph: string;
  ts: number;
  id?: string;
  id2?: { local?: string };
  args?: {
    data?: {
      compositeFailed?: number;
      unsupportedProperties?: string[];
      animationName?: string;
      name?: string;
    };
  };
};

export interface TraceResult {
  /** Layout events after the interaction's own first layout has settled. */
  layoutCount: number;
  /**
   * Distinct ~16.7ms frames containing those layout events. A layout
   * *animation* lays out in every frame it runs (dozens); a discrete size snap
   * touches one or two frames however many forced reads it triggers.
   */
  layoutFrames: number;
  /** Animations Chrome could not run on the compositor because of their properties. */
  unsupported: Array<{ name: string; properties: string[] }>;
  /** Animations Chrome reported as not composited for any reason (bitmask). */
  compositeFailed: Array<{ id: string; reason: number }>;
  /** Distinct animations observed during the window. */
  animationCount: number;
}

/** Layout work allowed right after the interaction (the DOM mutation itself). */
const SETTLE_MS = 50;
/** One frame at 60Hz, in trace microseconds. */
const FRAME_US = 1_000_000 / 60;

/**
 * Record a Chrome trace around one interaction on a Storybook story and report
 * layout work during the animation plus animations that failed to composite
 * because of their properties. Real time only — never virtual time.
 */
export async function traceInteraction(
  page: Page,
  {
    storyId,
    setup,
    act,
    windowMs,
  }: {
    storyId: string;
    /** Runs before tracing starts (e.g. open a dialog to trace its close). */
    setup?: (page: Page) => Promise<void>;
    act: (page: Page) => Promise<void>;
    windowMs: number;
  },
): Promise<TraceResult> {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
  await page.waitForLoadState("networkidle");
  if (setup) {
    await setup(page);
    // Let setup's own animations finish outside the traced window.
    await page.waitForTimeout(400);
  }
  const browser = page.context().browser();
  if (!browser) throw new Error("tracing needs a browser instance");
  await browser.startTracing(page, {
    categories: [
      "devtools.timeline",
      "blink.animations",
      "disabled-by-default-devtools.timeline",
    ],
  });
  await act(page);
  await page.waitForTimeout(windowMs);
  const buffer = await browser.stopTracing();
  const events: TraceEvent[] = JSON.parse(buffer.toString("utf8")).traceEvents;

  if (process.env.MOTION_TRACE_DEBUG) {
    const sample = events.filter((e) => e.name === "Animation").slice(0, 4);
    console.log(JSON.stringify(sample, null, 2));
  }

  const layouts = events
    .filter((e) => e.name === "Layout" && e.ph === "X")
    .map((e) => e.ts)
    .sort((a, b) => a - b);
  const first = layouts[0] ?? 0;
  const settled = layouts.filter((ts) => ts > first + SETTLE_MS * 1000);
  const layoutCount = settled.length;
  const layoutFrames = new Set(
    settled.map((ts) => Math.floor((ts - first) / FRAME_US)),
  ).size;

  const unsupported = events
    .filter(
      (e) =>
        e.name === "Animation" &&
        (e.args?.data?.unsupportedProperties?.length ?? 0) > 0,
    )
    .map((e) => ({
      name: e.args?.data?.animationName ?? e.args?.data?.name ?? "?",
      properties: e.args?.data?.unsupportedProperties ?? [],
    }));

  const animations = events.filter((e) => e.name === "Animation");
  const idOf = (e: TraceEvent) => e.id ?? e.id2?.local ?? "?";
  const failed = new Map<string, number>();
  for (const e of animations) {
    const reason = e.args?.data?.compositeFailed ?? 0;
    if (reason !== 0) failed.set(idOf(e), reason);
  }
  const compositeFailed = [...failed].map(([id, reason]) => ({ id, reason }));
  const animationCount = new Set(animations.map(idOf)).size;

  return {
    layoutCount,
    layoutFrames,
    unsupported,
    compositeFailed,
    animationCount,
  };
}

/**
 * Assert an interaction animated on the compositor only. `maxLayoutFrames`
 * (default 1, e.g. the frame where animations finish) may be raised only for a
 * documented discrete snap, e.g. an accordion panel collapsing after its fade.
 */
export function expectGpuOnly(
  result: TraceResult,
  { maxLayoutFrames = 1 }: { maxLayoutFrames?: number } = {},
): void {
  expect(
    result.unsupported,
    "animations on non-compositable properties",
  ).toEqual([]);
  expect(result.compositeFailed, "animations Chrome did not composite").toEqual(
    [],
  );
  expect(
    result.layoutFrames,
    "frames with layout work while animating",
  ).toBeLessThanOrEqual(maxLayoutFrames);
}
