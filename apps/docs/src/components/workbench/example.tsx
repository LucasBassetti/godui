import type { ReactNode } from "react";

export type ExampleProps = {
  /** Tab label. When there is a single example the tabs are hidden. */
  label?: string;
  /** The rendered demo shown on the stage. */
  children: ReactNode;
  /** Source shown in the Code panel of the stage drawer. */
  code?: string;
  /** Language for the Code panel (default "tsx"). */
  lang?: string;
  /**
   * Storybook docs id, e.g. "buttons-gooey-fab". When set, the dock shows a
   * "Playground" link to the live Storybook page.
   */
  story?: string;
  /**
   * When true the demo fills the stage edge-to-edge instead of sitting centered
   * in a padded canvas. Use for full-bleed UI (docks, nav bars, heroes).
   */
  fullWidth?: boolean;
};

/**
 * Declares one stage example inside a <Workbench>. It renders nothing on its
 * own — <Workbench> reads its props (and `children` as the live demo), turning
 * each <Example> into a stage tab. Kept as a stable module identity so
 * `child.type === Example` matches across the server-MDX → client boundary.
 */
export function Example(_props: ExampleProps): null {
  return null;
}
