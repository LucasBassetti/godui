"use client";

// GodUI Slider — mirrors shadcn/ui new-york-v4 components/ui/slider.tsx (registry snapshot 2026-10-01).
// Motion: a press anywhere on the slider lifts the thumb it moves (scale, bouncy
// spring) and thickens the track (scaleY); hover and focus fade a halo in
// around the thumb, drawn like shadcn's ring (opacity + scale). A track
// click, a key or a new `value` glides the thumb from where it is drawn (WAAPI
// `translate`) and the range on the same clock: the range is full length and
// placed with `translate` + `scale` from Radix's own start/end. A drag follows
// the pointer 1:1 (only coarse steps glide); past either end the track
// stretches toward the pointer like a rubber band and springs back on release.
// GPU-only.

import { Direction, Slider as SliderPrimitive } from "radix-ui";
import * as React from "react";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { cn } from "@/lib/utils";

/** Pointer travel (px) before a press becomes a drag. */
const SLOP = 3;
/** The most the track gives past an end (px). */
const MAX_OVER = 24;
/**
 * A `step` this long on the track (px) or longer glides from step to step
 * mid-drag; anything finer follows the pointer 1:1, however fast.
 */
const COARSE_STEP = 12;
const STEP_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const JUMP_KEYS = ["Home", "End", "PageUp", "PageDown"];
// Fallbacks for when the godui-motion tokens can't be read; the glides read
// the tokens themselves. Mirror `--godui-duration-fast` / `-base`,
// `--ease-out-expo` and (approximately) `--ease-spring-snappy`.
const FAST_MS = 150;
const BASE_MS = 260;
const EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
const SNAPPY = "cubic-bezier(0.25, 1, 0.5, 1)";

/** The range as fractions of the track, from its left (top when vertical). */
type Box = { start: number; size: number };
type Point = { x: number; y: number };
/** `step`: an arrow key or a coarse drag step. `jump`: everything else. */
type Glide = "step" | "jump";

const round = (n: number) => Math.round(n * 1e6) / 1e6;

/**
 * Where Radix draws the range. Radix anchors it at the value axis' start edge
 * (left; right when RTL or inverted; bottom when vertical, top when inverted);
 * `fromEnd` says that edge is the physical right/bottom.
 */
function rangeBox(
  values: number[],
  min: number,
  max: number,
  fromEnd: boolean,
): Box {
  const span = max - min;
  const at = values.map((v) =>
    span > 0 ? Math.min(1, Math.max(0, (v - min) / span)) : 0,
  );
  const low = at.length > 1 ? Math.min(...at) : 0;
  const high = at.length > 0 ? Math.max(...at) : 0;
  return {
    start: round(fromEnd ? 1 - high : low),
    size: round(high - low),
  };
}

/** Radix's range box, read back from its inline left/right (top/bottom). */
function readBox(range: HTMLElement, vertical: boolean): Box | null {
  const a = Number.parseFloat(vertical ? range.style.top : range.style.left);
  const b = Number.parseFloat(
    vertical ? range.style.bottom : range.style.right,
  );
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return { start: round(a / 100), size: round(Math.max(0, 1 - (a + b) / 100)) };
}

const boxVars = (box: Box) =>
  ({
    "--godui-slider-range-start": String(box.start),
    "--godui-slider-range-size": String(box.size),
  }) as React.CSSProperties;

/** The range's `translate` + `scale` for a box, as WAAPI keyframe values. */
function boxFrame(box: Box, vertical: boolean): Keyframe {
  const at = `${round(box.start * 100)}%`;
  const length = round(box.size);
  return vertical
    ? { translate: `0px ${at}`, scale: `1 ${length}` }
    : { translate: `${at} 0px`, scale: `${length} 1` };
}

/** Sigmoid give: grows with the pull, never past `MAX_OVER`. */
const decay = (px: number) =>
  2 * (1 / (1 + Math.exp(-px / MAX_OVER)) - 0.5) * MAX_OVER;

/** A CSS time (`260ms`, `0.3s`) in milliseconds; `fallback` when unset. */
function toMs(value: string, fallback: number): number {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return fallback;
  return /\ds\s*$/.test(value) ? n * 1000 : n;
}

/**
 * Press state, glides and the rubber band, all imperative: a React render
 * between pointerdown and the first move would let a transition run on it.
 *
 * - `data-pressed` (root) from pointerdown until release; `data-dragging`
 *   once the pointer travels `SLOP`px; `data-active` on the thumb the press
 *   moves. The keyboard sets none of them.
 * - Every value commit, Radix rewrites the thumb wrappers' `left` and the
 *   range's `left/right`. A MutationObserver (it runs before paint) mirrors
 *   the range into vars on the track, and — unless the change came from a drag
 *   — starts thumb and range from where they're drawn on one clock.
 * - Dragging past an end writes the stretch onto the track and each thumb.
 */
type Steps = { step: number; min: number; max: number };

function useSliderMotion(
  rootRef: React.RefObject<HTMLSpanElement | null>,
  steps: React.RefObject<Steps>,
) {
  React.useEffect(() => {
    const root = rootRef.current;
    const view = root?.ownerDocument.defaultView;
    if (!root || !view) return;
    // Read at commit time: the latest step/min/max from render.
    const settings = steps;
    const vertical = () => root.getAttribute("data-orientation") === "vertical";
    const thumbs = () => [
      ...root.querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]'),
    ];
    const trackOf = () =>
      root.querySelector<HTMLElement>('[data-slot="slider-track"]');
    const rangeOf = () =>
      root.querySelector<HTMLElement>('[data-slot="slider-range"]');
    const reduced = () =>
      view.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    /** The root's rect and its local px per screen px (a scaled ancestor). */
    const frame = () => {
      const rect = root.getBoundingClientRect();
      const k = root.offsetWidth > 0 ? rect.width / root.offsetWidth : 1;
      return { rect, k: k > 0 ? k : 1 };
    };
    type Frame = ReturnType<typeof frame>;
    const centerOf = (el: Element, f: Frame): Point => {
      const r = el.getBoundingClientRect();
      return {
        x: (r.left + r.width / 2 - f.rect.left) / f.k,
        y: (r.top + r.height / 2 - f.rect.top) / f.k,
      };
    };
    /** Where Radix lays a thumb out: its wrapper, which we never move. */
    const spotOf = (thumb: HTMLElement, f: Frame) =>
      centerOf(thumb.parentElement ?? thumb, f);
    /** The thumb's current lift (`scale`, 1 at rest or mid-transition). */
    const liftOf = (thumb: HTMLElement) => {
      const n = Number.parseFloat(view.getComputedStyle(thumb).scale);
      return Number.isFinite(n) && n > 0 ? n : 1;
    };
    /**
     * What the rubber band's ride adds to a thumb's drawn center right now
     * (its `transform`, maybe mid spring-back, times the lift it sits inside),
     * in local px like `centerOf`.
     */
    const rideOf = (thumb: HTMLElement): Point => {
      const m = /matrix\(([^)]+)\)/.exec(
        view.getComputedStyle(thumb).transform ?? "",
      );
      if (!m) return { x: 0, y: 0 };
      const [, , , , e = 0, f = 0] = m[1].split(",").map(Number);
      const lift = liftOf(thumb);
      return { x: (e || 0) * lift, y: (f || 0) * lift };
    };
    /** One `step` along the track, in px. */
    const stepPx = () => {
      const { step, min, max } = settings.current;
      const track = trackOf();
      const len = track
        ? vertical()
          ? track.offsetHeight
          : track.offsetWidth
        : 0;
      return max > min ? (Math.abs(step) / (max - min)) * len : 0;
    };

    let spots = new Map<Element, Point>();
    let box: Box | null = null;
    const glides = new Map<Element, Animation>();
    let rangeGlide: Animation | null = null;
    let press: { id: number; x: number; y: number } | null = null;
    let dragging = false;
    let downJump = false;
    let key: Glide | null = null;

    const measure = (f = frame()) => {
      spots = new Map(thumbs().map((t) => [t, spotOf(t, f)]));
    };
    const writeBox = (next: Box) => {
      const track = trackOf();
      if (!track) return;
      for (const [name, value] of Object.entries(boxVars(next))) {
        if (track.style.getPropertyValue(name) !== value) {
          track.style.setProperty(name, value);
        }
      }
    };
    const stop = () => {
      for (const animation of glides.values()) animation.cancel();
      glides.clear();
      rangeGlide?.cancel();
      rangeGlide = null;
    };
    /** The range as drawn now (mid-glide included), from its rect. */
    const drawnBox = (): Box | null => {
      const range = rangeOf();
      const track = trackOf();
      if (!range || !track) return null;
      const r = range.getBoundingClientRect();
      const t = track.getBoundingClientRect();
      const v = vertical();
      const len = v ? t.height : t.width;
      if (!len) return null;
      return v
        ? { start: (r.top - t.top) / len, size: r.height / len }
        : { start: (r.left - t.left) / len, size: r.width / len };
    };
    const timing = (kind: Glide): KeyframeAnimationOptions => {
      const style = view.getComputedStyle(root);
      const token = (name: string) => style.getPropertyValue(name).trim();
      return kind === "step"
        ? {
            duration: toMs(token("--godui-duration-fast"), FAST_MS),
            easing: token("--ease-out-expo") || EXPO,
          }
        : {
            duration: toMs(token("--godui-duration-base"), BASE_MS),
            easing: token("--ease-spring-snappy") || SNAPPY,
          };
    };
    /** How a value change should move (null: snap). */
    const kindOf = (): Glide | null => {
      if (reduced()) return null;
      // Mid-drag only a coarse `step` glides; a fast drag on a fine slider
      // moves far per event but must still follow the pointer exactly.
      if (dragging) return stepPx() >= COARSE_STEP ? "step" : null;
      // A track press jumps the thumb; a wobble under the slop retargets
      // that glide. A held thumb nudged under the slop just follows.
      if (press) return downJump || glides.size > 0 ? "jump" : null;
      return key ?? "jump";
    };

    /**
     * After Radix committed a new layout: mirror the range, and (when `valued`)
     * start every thumb that's now off its spot, plus the range, from where
     * they're drawn, on one clock.
     */
    const commit = (valued: boolean, fresh: Set<Element> = new Set()) => {
      const f = frame();
      const v = vertical();
      // Where the glide starts = the old spot plus the glide offset still
      // drawn on top of the new one. The rubber band's ride is left out: it
      // lives on `transform` and springs home on its own.
      const from = new Map<Element, Point>();
      for (const thumb of thumbs()) {
        const old = spots.get(thumb);
        // A thumb Radix only just placed has no spot to glide from.
        if (!old || fresh.has(thumb)) continue;
        const spot = spotOf(thumb, f);
        const drawn = centerOf(thumb, f);
        const ride = rideOf(thumb);
        from.set(thumb, {
          x: old.x + drawn.x - spot.x - ride.x,
          y: old.y + drawn.y - spot.y - ride.y,
        });
      }
      const fromBox = rangeGlide ? drawnBox() : box;
      const kind = valued ? kindOf() : null;
      stop();
      const range = rangeOf();
      const next = range ? readBox(range, v) : null;
      if (next) writeBox(next);
      measure(f);
      box = next ?? box;
      if (!kind) return;
      const options = timing(kind);
      for (const thumb of thumbs()) {
        const start = from.get(thumb);
        const spot = spots.get(thumb);
        if (!start || !spot || typeof thumb.animate !== "function") continue;
        const dx = round(start.x - spot.x);
        const dy = round(start.y - spot.y);
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
        const animation = thumb.animate(
          [{ translate: `${dx}px ${dy}px` }, { translate: "0px 0px" }],
          options,
        );
        glides.set(thumb, animation);
        animation.onfinish = () => {
          if (glides.get(thumb) === animation) glides.delete(thumb);
        };
      }
      if (
        range &&
        next &&
        fromBox &&
        typeof range.animate === "function" &&
        (Math.abs(fromBox.start - next.start) > 1e-4 ||
          Math.abs(fromBox.size - next.size) > 1e-4)
      ) {
        const frames = [boxFrame(fromBox, v), boxFrame(next, v)];
        const animation = range.animate(frames, options);
        rangeGlide = animation;
        animation.onfinish = () => {
          if (rangeGlide === animation) rangeGlide = null;
        };
      }
    };

    const setActive = (active: Element | null) => {
      for (const thumb of thumbs()) {
        if (thumb === active) thumb.setAttribute("data-active", "");
        else thumb.removeAttribute("data-active");
      }
    };
    /** While pressed, the thumb that took a new value is the one in hand. */
    const follow = (changed: Map<Element, string | null>) => {
      const before = new Set(
        thumbs().map((t) =>
          changed.has(t) ? changed.get(t) : t.getAttribute("aria-valuenow"),
        ),
      );
      const moved = [...changed.keys()].filter(
        (t) => !before.has(t.getAttribute("aria-valuenow")),
      );
      if (moved.length === 1) setActive(moved[0]);
    };

    /** Stretch the track `over` px past its right/bottom end (< 0: left/top). */
    const stretch = (over: number) => {
      const track = trackOf();
      if (!track) return;
      const v = vertical();
      const len = v ? track.offsetHeight : track.offsetWidth;
      if (over === 0 || !len) {
        // One style change: the transitions return as the stretch goes, so
        // the band springs home. The origin stays put so the spring back
        // pivots where it stretched.
        root.removeAttribute("data-overdrag");
        track.style.removeProperty("--godui-slider-stretch");
        track.style.removeProperty("--godui-slider-thin");
        for (const thumb of thumbs()) {
          thumb.style.removeProperty("--godui-slider-ride");
        }
        return;
      }
      const give = Math.abs(over);
      // While stretched, the band follows the pointer with no transition. A
      // press mid spring-back doesn't set it, so the band's spring carries
      // on. The thumbs' ride drops its transition for any drag instead
      // (`data-dragging`): a dragged thumb sits exactly under the pointer.
      root.setAttribute("data-overdrag", "");
      track.style.setProperty(
        "--godui-slider-origin",
        v
          ? over > 0
            ? "50% 0%"
            : "50% 100%"
          : over > 0
            ? "0% 50%"
            : "100% 50%",
      );
      track.style.setProperty(
        "--godui-slider-stretch",
        String(round(1 + give / len)),
      );
      track.style.setProperty(
        "--godui-slider-thin",
        String(round(1 - (0.2 * give) / MAX_OVER)),
      );
      // Each thumb rides its point of the track: the far end moves the full
      // give, the anchored end not at all. (On `transform`, not `translate`:
      // Chrome won't composite a `translate` transition on an element whose
      // earlier `translate` glides were cancelled, i.e. a coarse drag.) The
      // lift's `scale` applies outside `transform`, so the ride is divided
      // by it to land on the band's end.
      const f = frame();
      const first = v ? track.offsetTop : track.offsetLeft;
      for (const thumb of thumbs()) {
        const spot = spotOf(thumb, f);
        const at = (v ? spot.y : spot.x) - first;
        const ride = round(
          (over * (over > 0 ? at : len - at)) / len / liftOf(thumb),
        );
        thumb.style.setProperty(
          "--godui-slider-ride",
          v ? `0px, ${ride}px` : `${ride}px, 0px`,
        );
      }
    };

    const onDown = (event: PointerEvent) => {
      if (root.hasAttribute("data-disabled")) return;
      press = { id: event.pointerId, x: event.clientX, y: event.clientY };
      dragging = false;
      downJump = true;
      view.setTimeout(() => {
        downJump = false;
      });
      root.setAttribute("data-pressed", "");
      const held = (event.target as Element | null)?.closest?.(
        '[data-slot="slider-thumb"]',
      );
      if (held) {
        setActive(held);
        return;
      }
      // Radix moves the closest thumb (first on a tie).
      const f = frame();
      const v = vertical();
      const at = v
        ? (event.clientY - f.rect.top) / f.k
        : (event.clientX - f.rect.left) / f.k;
      let best: Element | null = null;
      let distance = Number.POSITIVE_INFINITY;
      for (const thumb of thumbs()) {
        const spot = spotOf(thumb, f);
        const d = Math.abs((v ? spot.y : spot.x) - at);
        if (d < distance) {
          distance = d;
          best = thumb;
        }
      }
      setActive(best);
    };
    const onMove = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.id) return;
      if (
        !dragging &&
        Math.hypot(event.clientX - press.x, event.clientY - press.y) >= SLOP
      ) {
        dragging = true;
        root.setAttribute("data-dragging", "");
        // From here the thumb is the pointer's: drop any glide.
        stop();
      }
      if (!dragging || reduced()) return;
      const f = frame();
      const v = vertical();
      const at = v ? event.clientY : event.clientX;
      const low = v ? f.rect.top : f.rect.left;
      const high = v ? f.rect.bottom : f.rect.right;
      const past = at > high ? at - high : at < low ? at - low : 0;
      stretch(Math.sign(past) * decay(Math.abs(past) / f.k));
    };
    const onUp = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.id) return;
      press = null;
      dragging = false;
      downJump = false;
      root.removeAttribute("data-pressed");
      root.removeAttribute("data-dragging");
      setActive(null);
      stretch(0);
    };
    const onKey = (event: KeyboardEvent) => {
      key = STEP_KEYS.includes(event.key)
        ? event.shiftKey
          ? "jump"
          : "step"
        : JUMP_KEYS.includes(event.key)
          ? "jump"
          : null;
      view.setTimeout(() => {
        key = null;
      });
    };

    const observer = new MutationObserver((records) => {
      let valued = false;
      let moved = false;
      const changed = new Map<Element, string | null>();
      const fresh = new Set<Element>();
      for (const record of records) {
        const el = record.target as Element;
        if (record.type === "childList") {
          moved = true;
        } else if (record.attributeName === "aria-valuenow") {
          // No old value: Radix resolved the thumb's index (first paint).
          if (record.oldValue === null) {
            moved = true;
            fresh.add(el);
          } else if (record.oldValue !== el.getAttribute("aria-valuenow")) {
            valued = true;
            if (!changed.has(el)) changed.set(el, record.oldValue);
          }
        } else if (
          el.getAttribute("data-slot") === "slider-range" ||
          el.firstElementChild?.getAttribute("data-slot") === "slider-thumb"
        ) {
          // Radix's own writes: the range, a thumb's positioning wrapper. Our
          // writes (track, thumbs) land elsewhere and are ignored.
          moved = true;
        }
      }
      if (!valued && !moved) return;
      if (valued && press) follow(changed);
      commit(valued, fresh);
    });
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style", "aria-valuenow"],
      attributeOldValue: true,
    });
    // Size changes move the thumbs without a value change: re-measure, snap.
    const resizes =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => measure());
    resizes?.observe(root);
    root.addEventListener("pointerdown", onDown, true);
    root.addEventListener("pointermove", onMove, true);
    root.addEventListener("pointerup", onUp, true);
    root.addEventListener("pointercancel", onUp, true);
    root.addEventListener("lostpointercapture", onUp, true);
    root.addEventListener("keydown", onKey, true);
    commit(false);
    return () => {
      observer.disconnect();
      resizes?.disconnect();
      root.removeEventListener("pointerdown", onDown, true);
      root.removeEventListener("pointermove", onMove, true);
      root.removeEventListener("pointerup", onUp, true);
      root.removeEventListener("pointercancel", onUp, true);
      root.removeEventListener("lostpointercapture", onUp, true);
      root.removeEventListener("keydown", onKey, true);
      stop();
    };
  }, [rootRef, steps]);
}

function Slider({
  ref,
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );
  const direction = Direction.useDirection(props.dir);
  // The range's first box, in the server HTML too. Later values are mirrored
  // from Radix's own range style (see useSliderMotion), never re-rendered.
  const [rangeStyle] = React.useState(() =>
    boxVars(
      rangeBox(
        value ?? defaultValue ?? [min],
        min,
        max,
        props.orientation === "vertical"
          ? !props.inverted
          : (direction === "rtl") !== Boolean(props.inverted),
      ),
    ),
  );
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const setRootRef = useMergedRef(rootRef, ref);
  const steps = React.useRef<Steps>({ step: 1, min, max });
  steps.current = { step: props.step ?? 1, min, max };
  useSliderMotion(rootRef, steps);

  return (
    <SliderPrimitive.Root
      ref={setRootRef}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "group/slider relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        // Press: scaleY 1.5 (scaleX vertical) on `scale`. Rubber band: the
        // `transform` stretch, 1:1 while dragging, springing back on release.
        style={rangeStyle}
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
          "[transform-origin:var(--godui-slider-origin,50%_50%)] [transition:scale_var(--godui-duration-fast)_var(--ease-spring-snappy),transform_var(--godui-duration-slow)_var(--ease-spring-bouncy)] group-data-[overdrag]/slider:[transition:scale_var(--godui-duration-fast)_var(--ease-spring-snappy)] motion-reduce:transition-none data-[orientation=horizontal]:[transform:scale(var(--godui-slider-stretch,1),var(--godui-slider-thin,1))] data-[orientation=vertical]:[transform:scale(var(--godui-slider-thin,1),var(--godui-slider-stretch,1))] motion-safe:group-data-[pressed]/slider:data-[orientation=horizontal]:scale-y-150 motion-safe:group-data-[pressed]/slider:data-[orientation=vertical]:scale-x-150",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          // Full length (beats Radix's inline left/right), placed by the
          // track's vars: `translate` to the start edge, `scale` to length.
          className={cn(
            "absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            "inset-0! origin-top-left data-[orientation=horizontal]:[translate:calc(var(--godui-slider-range-start)*100%)_0] data-[orientation=horizontal]:[scale:var(--godui-slider-range-size)_1] data-[orientation=vertical]:[translate:0_calc(var(--godui-slider-range-start)*100%)] data-[orientation=vertical]:[scale:1_var(--godui-slider-range-size)]",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          // biome-ignore lint/suspicious/noArrayIndexKey: shadcn parity — thumbs are positional (one per value index)
          key={index}
          // shadcn's thumb, with its `ring-4 ring-ring/50` hover/focus ring
          // redrawn as a ::before ring (4px border around the 16px body:
          // -5px from the padding box) that fades and grows in.
          className="relative block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm [transform:translate(var(--godui-slider-ride,0px,0px))] [transition:scale_var(--godui-duration-base)_var(--ease-spring-bouncy),transform_var(--godui-duration-slow)_var(--ease-spring-bouncy)] group-data-[dragging]/slider:[transition:scale_var(--godui-duration-base)_var(--ease-spring-bouncy)] motion-reduce:transition-none motion-safe:group-data-[pressed]/slider:data-[active]:scale-[1.15] before:pointer-events-none before:absolute before:-inset-[5px] before:rounded-full before:border-4 before:border-ring/50 before:opacity-0 before:scale-60 before:transition-[opacity,scale] before:duration-(--godui-duration-fast) before:ease-out-expo hover:before:opacity-100 hover:before:scale-100 focus-visible:before:opacity-100 focus-visible:before:scale-100 motion-reduce:before:scale-100 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
