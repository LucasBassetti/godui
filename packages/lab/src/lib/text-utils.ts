import type { ReactNode } from "react";

export function getTextContent(children: ReactNode): string | null {
  const text = collectText(children);
  return text.length > 0 ? text : null;
}

function collectText(children: ReactNode): string {
  if (children == null || typeof children === "boolean") {
    return "";
  }
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(collectText).join("");
  }
  if (typeof children === "object" && "props" in children) {
    const props = (children as { props?: { children?: ReactNode } }).props;
    return collectText(props?.children ?? "");
  }
  return "";
}

export function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
