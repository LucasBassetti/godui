import type { ReactElement } from "react";
import type { InputType } from "storybook/internal/types";
import type { Category } from "./argtypes";

/**
 * Preset machinery for visual / effect components whose interesting props are
 * numbers and colors that don't make sense as a pile of raw sliders. Instead we
 * expose one curated `preset` selector that swaps a whole tuned look, plus any
 * orthogonal controls (e.g. an `interactive` toggle) the story declares
 * normally.
 *
 * Usage:
 *   const presets = {
 *     Aurora: { colors: [...], speed: 1, gooeyness: 16 },
 *     Sunset: { colors: [...], speed: 0.7, gooeyness: 22 },
 *   } satisfies PresetMap<LiquidMetaballsProps>;
 *
 *   const meta = {
 *     argTypes: {
 *       preset: presetSelect(presets, "Appearance"),
 *       interactive: toggle("Behavior"),
 *     },
 *     args: { preset: "Aurora", interactive: true },
 *     render: renderPreset(presets, (cfg) => <LiquidMetaballs {...cfg} />),
 *   };
 *
 * The chosen preset is spread first; any other declared args (the orthogonal
 * controls) are layered on top, so they always win. The synthetic `preset` key
 * is stripped before reaching the component.
 */
export type PresetMap<P> = Record<string, Partial<P>>;

/** Synthetic `preset` argType: a select over the preset names. */
export const presetSelect = (
  presets: PresetMap<unknown>,
  category?: Category,
): InputType => ({
  name: "Preset",
  control: { type: "select" },
  options: Object.keys(presets),
  table: category ? { category } : undefined,
});

/** Build a story `render` that resolves the active preset and merges overrides. */
export function renderPreset<
  P,
  A extends Partial<P> & { preset?: string } = Partial<P> & { preset?: string },
>(presets: PresetMap<P>, renderFn: (cfg: P) => ReactElement) {
  return (args: A): ReactElement => {
    const { preset, ...rest } = args;
    const base = (preset && presets[preset]) || {};
    return renderFn({ ...base, ...(rest as unknown as Partial<P>) } as P);
  };
}
