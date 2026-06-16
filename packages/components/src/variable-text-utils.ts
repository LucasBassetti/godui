import type { ReactNode } from "react";

export type VariableTextPreset =
  | "weight-pulse"
  | "weight-wave"
  | "accordion"
  | "breathing"
  | "italic-sway"
  | "focus"
  | "elastic"
  | "cursor"
  | "scroll";

export type VariableTextTrigger =
  | "auto"
  | "hover"
  | "click"
  | "cursor"
  | "scroll"
  | "inView";

export type VariableTextSplitBy = "character" | "word" | "line" | "none";

export type AxisValue = number | [number, number];

export type VariableTextSpring = {
  stiffness: number;
  damping: number;
  mass: number;
};

export type AxisRanges = {
  weight: [number, number];
  width: [number, number];
  slant: [number, number];
  opticalSize: [number, number];
};

export const DEFAULT_SPRING: VariableTextSpring = {
  stiffness: 120,
  damping: 20,
  mass: 1,
};

export const DEFAULT_AXES: AxisRanges = {
  weight: [400, 400],
  width: [100, 100],
  slant: [0, 0],
  opticalSize: [14, 14],
};

export const PRESET_AXES: Record<VariableTextPreset, AxisRanges> = {
  "weight-pulse": {
    weight: [400, 900],
    width: [100, 100],
    slant: [0, 0],
    opticalSize: [14, 14],
  },
  "weight-wave": {
    weight: [400, 900],
    width: [100, 100],
    slant: [0, 0],
    opticalSize: [14, 14],
  },
  accordion: {
    weight: [400, 400],
    width: [75, 125],
    slant: [0, 0],
    opticalSize: [14, 14],
  },
  breathing: {
    weight: [400, 700],
    width: [100, 115],
    slant: [0, 0],
    opticalSize: [14, 14],
  },
  "italic-sway": {
    weight: [400, 400],
    width: [100, 100],
    slant: [0, -10],
    opticalSize: [14, 14],
  },
  focus: {
    weight: [300, 900],
    width: [100, 100],
    slant: [0, 0],
    opticalSize: [14, 14],
  },
  elastic: {
    weight: [400, 900],
    width: [100, 100],
    slant: [0, 0],
    opticalSize: [14, 14],
  },
  cursor: {
    weight: [300, 900],
    width: [100, 100],
    slant: [0, 0],
    opticalSize: [14, 14],
  },
  scroll: {
    weight: [300, 900],
    width: [75, 125],
    slant: [0, -10],
    opticalSize: [14, 14],
  },
};

export const PRESET_DEFAULT_TRIGGER: Partial<
  Record<VariableTextPreset, VariableTextTrigger>
> = {
  cursor: "cursor",
  scroll: "scroll",
};

export const PRESET_DEFAULT_SPLIT: Partial<
  Record<VariableTextPreset, VariableTextSplitBy>
> = {
  "weight-wave": "character",
  focus: "character",
  cursor: "character",
  accordion: "none",
  "italic-sway": "none",
  elastic: "none",
};

export function resolveAxis(
  value: AxisValue | undefined,
  fallback: [number, number],
): [number, number] {
  if (value === undefined) {
    return fallback;
  }
  if (typeof value === "number") {
    return [value, value];
  }
  return value;
}

export function resolveAxes(
  preset: VariableTextPreset | undefined,
  options: {
    weight?: AxisValue;
    width?: AxisValue;
    slant?: AxisValue;
    opticalSize?: AxisValue;
  },
): AxisRanges {
  const base = preset ? PRESET_AXES[preset] : DEFAULT_AXES;

  return {
    weight: resolveAxis(options.weight, base.weight),
    width: resolveAxis(options.width, base.width),
    slant: resolveAxis(options.slant, base.slant),
    opticalSize: resolveAxis(options.opticalSize, base.opticalSize),
  };
}

export function splitText(
  text: string,
  splitBy: VariableTextSplitBy,
): string[] {
  if (splitBy === "none") {
    return [text];
  }
  if (splitBy === "character") {
    return [...text];
  }
  if (splitBy === "word") {
    return text.split(/(\s+)/).filter((part) => part.length > 0);
  }
  return text.split("\n");
}

export function getTextContent(children: ReactNode): string | null {
  if (typeof children === "string") {
    return children;
  }
  if (typeof children === "number") {
    return String(children);
  }
  return null;
}

export function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
