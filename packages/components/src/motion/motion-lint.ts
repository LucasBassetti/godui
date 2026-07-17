/**
 * Motion performance linter — enforces the GodUI Motion Performance guideline:
 * animation must run on the compositor (transform / opacity / filter) so it never
 * touches the main thread and holds 60fps.
 *
 * Policy tiers:
 *  - FREE — transform family, opacity, filter/backdrop-filter, SVG path flow, and
 *    cheap one-shot paint (color / background-color / border-color / background /
 *    background-position). Always allowed.
 *  - GATED — layout props (width/height/inset/margin/padding/flex/gap/grid…),
 *    background-size, clip-path, border-radius, box-shadow, and any unrecognised
 *    animated property. Allowed ONLY with a {@link MOTION_ALLOWLIST} entry
 *    (file + prop) that documents why the morph is intrinsic.
 *  - BANNED — `transition-all` / `transition: all` (sweeps every property incl.
 *    layout) and any GATED prop animated in an infinite loop (ambient layout
 *    thrash). Never allowed, no allowlist escape.
 *
 * Consumed by motion-lint.test.ts (the CI gate); run standalone with
 * `pnpm --filter @godui/components test:motion`. Not shipped in any component.
 */

export type ViolationKind = "banned" | "gated";

export interface Violation {
  /** 1-based line number in the source file. */
  line: number;
  /** Canonical, normalised property name (lowercase, hyphens stripped). */
  prop: string;
  kind: ViolationKind;
  /** Trimmed source snippet the violation was found in. */
  raw: string;
}

/** Normalise a CSS/framer property token: lowercase, drop hyphens + vendor prefix. */
export function normalizeProp(p: string): string {
  return p
    .trim()
    .toLowerCase()
    .replace(/^-?(webkit|moz|ms|o)-/, "")
    .replace(/-/g, "");
}

// Compositor-cheap or cheap one-shot paint — never a performance problem.
const FREE = new Set(
  [
    // compositor-animatable
    "transform",
    "translate",
    "translatex",
    "translatey",
    "translatez",
    "translate3d",
    "scale",
    "scalex",
    "scaley",
    "scalez",
    "scale3d",
    "rotate",
    "rotatex",
    "rotatey",
    "rotatez",
    "rotate3d",
    "skew",
    "skewx",
    "skewy",
    "perspective",
    "transformperspective",
    "transformorigin",
    "opacity",
    "filter",
    "backdropfilter",
    "willchange",
    // framer transform shorthands
    "x",
    "y",
    "z",
    // SVG length-driven flow (sanctioned ambient motion)
    "pathlength",
    "pathoffset",
    "pathspacing",
    "strokedashoffset",
    "strokedasharray",
    "offsetdistance",
    // cheap one-shot paint
    "color",
    "background",
    "backgroundcolor",
    "backgroundposition",
    "bordercolor",
    "bordertopcolor",
    "borderrightcolor",
    "borderbottomcolor",
    "borderleftcolor",
    "outlinecolor",
    "textdecorationcolor",
    "caretcolor",
    "fill",
    "stroke",
    "accentcolor",
    // framer config keys (not animated CSS properties)
    "transition",
    "transitionend",
    // discrete / non-thrashing props framer snaps rather than tweens
    "zindex",
    "cursor",
    "pointerevents",
    "visibility",
    // no-op / keyword tokens that can appear in a transition list
    "none",
    "initial",
    "inherit",
    "unset",
    "",
  ].map((p) => p),
);

// Layout / paint-heavy props — allowed only via the allowlist.
const GATED = new Set([
  "width",
  "height",
  "minwidth",
  "minheight",
  "maxwidth",
  "maxheight",
  "top",
  "left",
  "right",
  "bottom",
  "inset",
  "insetinline",
  "insetblock",
  "margin",
  "margintop",
  "marginright",
  "marginbottom",
  "marginleft",
  "marginblock",
  "margininline",
  "padding",
  "paddingtop",
  "paddingright",
  "paddingbottom",
  "paddingleft",
  "paddingblock",
  "paddinginline",
  "flex",
  "flexgrow",
  "flexbasis",
  "flexshrink",
  "gap",
  "rowgap",
  "columngap",
  "gridtemplatecolumns",
  "gridtemplaterows",
  "backgroundsize",
  "clippath",
  "boxshadow",
  "borderradius",
  "bordertopleftradius",
  "bordertoprightradius",
  "borderbottomleftradius",
  "borderbottomrightradius",
  "fontsize",
  "lineheight",
  "letterspacing",
  "wordspacing",
]);

/** Classify a normalised property into a policy tier. Unknown props are gated. */
export function classifyProp(prop: string): "free" | "gated" {
  if (FREE.has(prop)) return "free";
  // Framer transition config keys / bare custom props we never treat as animated.
  if (prop.startsWith("--")) return "free";
  if (GATED.has(prop)) return "gated";
  // Conservative default: an unrecognised animated property must be signed off.
  return "gated";
}

/** Split a CSS list on top-level commas, ignoring commas inside `fn(...)`. */
function splitTopLevel(value: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (c === "(") depth++;
    else if (c === ")") depth--;
    else if (c === "," && depth === 0) {
      out.push(value.slice(start, i));
      start = i + 1;
    }
  }
  out.push(value.slice(start));
  return out;
}

/** Property name = first token of a transition segment (Tailwind uses `_` for spaces). */
function transitionPropOf(segment: string): string {
  return normalizeProp(segment.trim().split(/[_\s]/)[0] ?? "");
}

const lineAt = (source: string, index: number): number =>
  source.slice(0, index).split("\n").length;

/**
 * Extract the balanced `{ ... }` object literal that starts at or after `from`.
 * Returns the inner body (without the outer braces) and the end index, or null.
 */
function matchObject(
  source: string,
  from: number,
): { body: string; end: number } | null {
  const open = source.indexOf("{", from);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    const c = source[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return { body: source.slice(open + 1, i), end: i };
    }
  }
  return null;
}

/** Top-level object keys (identifiers or quoted) at depth 1 of an object body. */
function topLevelKeys(body: string): string[] {
  const keys: string[] = [];
  let depth = 0;
  const keyRe = /(?:^|[,{])\s*["']?([A-Za-z_$][\w-]*)["']?\s*:/g;
  // Walk char-by-char to only pick depth-0 keys.
  let i = 0;
  let segStart = 0;
  const segments: string[] = [];
  for (; i < body.length; i++) {
    const c = body[i];
    if (c === "{" || c === "[" || c === "(") depth++;
    else if (c === "}" || c === "]" || c === ")") depth--;
    else if (c === "," && depth === 0) {
      segments.push(body.slice(segStart, i));
      segStart = i + 1;
    }
  }
  segments.push(body.slice(segStart));
  for (const seg of segments) {
    const m = /^\s*["']?([A-Za-z_$][\w-]*)["']?\s*:/.exec(seg);
    if (m) keys.push(m[1]);
  }
  void keyRe;
  return keys;
}

const FRAMER_MOTION_PROPS = [
  "animate",
  "whileHover",
  "whileTap",
  "whileDrag",
  "whileFocus",
  "whileInView",
  "exit",
  "initial",
];

/**
 * Scan a single source file for motion-performance violations.
 * Pure string analysis — no AST, no filesystem.
 */
export function scanSource(source: string): Violation[] {
  const found: Violation[] = [];
  const push = (
    index: number,
    prop: string,
    kind: ViolationKind,
    raw: string,
  ) => found.push({ line: lineAt(source, index), prop, kind, raw: raw.trim() });

  // 1. `transition-all` utility — sweeps every property, including layout.
  for (const m of source.matchAll(/\btransition-all\b/g)) {
    push(m.index, "all", "banned", "transition-all");
  }

  // 2. `transition-shadow` utility — box-shadow paint.
  for (const m of source.matchAll(/\btransition-shadow\b/g)) {
    push(m.index, "boxshadow", "gated", "transition-shadow");
  }

  // 3. Arbitrary `[transition:...]` / `[transition-property:...]` class values.
  for (const m of source.matchAll(/\[transition(?:-property)?:([^\]]+)\]/g)) {
    for (const seg of splitTopLevel(m[1])) {
      const prop = transitionPropOf(seg);
      if (prop === "all") {
        push(m.index, "all", "banned", m[0]);
        continue;
      }
      if (classifyProp(prop) === "gated") push(m.index, prop, "gated", m[0]);
    }
  }

  // 4. Inline `transition:`/`transitionProperty:` string values (style objects).
  for (const m of source.matchAll(
    /transition(?:Property)?:\s*["'`]([^"'`]+)["'`]/g,
  )) {
    for (const seg of splitTopLevel(m[1])) {
      const prop = transitionPropOf(seg);
      if (prop === "all") {
        push(m.index, "all", "banned", m[0]);
        continue;
      }
      if (classifyProp(prop) === "gated") push(m.index, prop, "gated", m[0]);
    }
  }

  // 5. Framer Motion animated-prop objects: animate / whileHover / exit / …
  for (const prop of FRAMER_MOTION_PROPS) {
    const re = new RegExp(`\\b${prop}\\s*=\\s*\\{`, "g");
    for (const m of source.matchAll(re)) {
      const obj = matchObject(source, m.index + m[0].length - 1);
      if (!obj) continue;
      // JSX object props read `={{ ... }}`, so matchObject returns the outer
      // expression `{ ... }` wrapping the real object literal. Unwrap one layer
      // so the animated keys sit at depth 0.
      let body = obj.body.trim();
      if (body.startsWith("{") && body.endsWith("}")) body = body.slice(1, -1);
      const ambient = /\brepeat\s*:\s*(Infinity|\d)/.test(body);
      for (const key of topLevelKeys(body)) {
        const n = normalizeProp(key);
        if (classifyProp(n) !== "gated") continue;
        push(m.index, n, ambient ? "banned" : "gated", `${prop}={{…${key}…}}`);
      }
    }
  }

  // Dedupe on (line, prop, kind).
  const seen = new Set<string>();
  return found.filter((v) => {
    const k = `${v.line}:${v.prop}:${v.kind}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
