import {
  classifyProp,
  isCompositorProp,
  normalizeProp,
  splitTopLevel,
  type Violation,
} from "./scan-source";

const lineAt = (css: string, index: number): number =>
  css.slice(0, index).split("\n").length;

const KEYWORDS = new Set(["none", "initial", "inherit", "unset", ""]);

const violates = (prop: string, strict: boolean): boolean => {
  if (KEYWORDS.has(prop)) return false;
  return strict ? !isCompositorProp(prop) : classifyProp(prop) === "gated";
};

// Keyframe-only declarations that aren't animated properties.
const KEYFRAME_META = new Set([
  "animationtimingfunction",
  "animationcomposition",
]);

// Tokens in a `transition` shorthand that are not the property.
const TIME = /^-?[\d.]+m?s$/;
const EASING =
  /^(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end|allow-discrete|normal)$|^(cubic-bezier|linear|steps)\(/;

/** Split a shorthand segment on spaces that aren't inside `fn(...)`. */
function tokens(segment: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < segment.length; i++) {
    const c = segment[i];
    if (c === "(") depth++;
    else if (c === ")") depth--;
    else if (/\s/.test(c) && depth === 0) {
      if (i > start) out.push(segment.slice(start, i));
      start = i + 1;
    }
  }
  if (segment.length > start) out.push(segment.slice(start));
  return out;
}

/** Property of one `transition` shorthand segment; `all` when omitted. */
function shorthandProp(segment: string): string {
  for (const token of tokens(segment.trim())) {
    if (TIME.test(token) || EASING.test(token)) continue;
    return normalizeProp(token);
  }
  return "all";
}

/**
 * Scan CSS text for motion violations: every declaration inside `@keyframes`,
 * plus `transition` / `transition-property` lists anywhere. Static declarations
 * outside keyframes (e.g. `width: 10px`) are not animation and are ignored.
 */
export function scanCss(
  css: string,
  { strict = false }: { strict?: boolean } = {},
): Violation[] {
  const out: Violation[] = [];

  for (const m of css.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
    const start = m.index + m[0].length;
    let depth = 1;
    let end = css.length;
    for (let i = start; i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) {
        end = i;
        break;
      }
    }
    const body = css.slice(start, end);
    for (const d of body.matchAll(/([a-zA-Z-]+)\s*:\s*[^;{}]+;?/g)) {
      const prop = normalizeProp(d[1]);
      if (KEYFRAME_META.has(prop)) continue;
      if (violates(prop, strict)) {
        out.push({
          line: lineAt(css, start + d.index),
          prop,
          kind: "gated",
          raw: d[0].trim(),
        });
      }
    }
  }

  for (const m of css.matchAll(
    /(?<![\w-])transition(-property)?\s*:\s*([^;{}]+)/g,
  )) {
    for (const seg of splitTopLevel(m[2])) {
      const prop = m[1] ? normalizeProp(seg) : shorthandProp(seg);
      if (prop === "all") {
        out.push({
          line: lineAt(css, m.index),
          prop,
          kind: "banned",
          raw: m[0].trim(),
        });
      } else if (violates(prop, strict)) {
        out.push({
          line: lineAt(css, m.index),
          prop,
          kind: "gated",
          raw: m[0].trim(),
        });
      }
    }
  }

  return out;
}

type CssNode = string | { [key: string]: CssNode };

/** Registry `css` JSON → CSS text (same shape the docs Manual tab prints). */
export function cssObjectToString(
  node: Record<string, unknown>,
  depth = 0,
): string {
  const pad = "  ".repeat(depth);
  return Object.entries(node as Record<string, CssNode>)
    .map(([key, value]) =>
      typeof value === "string"
        ? `${pad}${key}: ${value};`
        : `${pad}${key} {\n${cssObjectToString(value, depth + 1)}\n${pad}}`,
    )
    .join("\n");
}
