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
   * Stage layout mode:
   * - `false` (default) — padded canvas, demo centered. Use for buttons,
   *   inputs, cards, image/media demos, and framed mini-scrollers.
   * - `true` — edge-to-edge. Use for backgrounds, docks, pointer playgrounds,
   *   and stage-fill scroll ports (`DemoScrollPort variant="fill"` /
   *   `DemoScene`). Do **not** nest `max-w-*` under fullWidth unless the demo
   *   intentionally builds an inset scene.
   */
  fullWidth?: boolean;
};

/**
 * Declares one stage example inside a <Workbench>. It renders nothing on its
 * own — <Workbench> reads its props (and `children` as the live demo), turning
 * each <Example> into a stage tab. Kept as a stable module identity so
 * `child.type === Example` matches across the server-MDX → client boundary.
 *
 * Structure rule: put every stage variant as an `<Example label="…">` — never
 * wrap them in `##` headings before Installation (headings land in the Docs
 * drawer, not as stage chrome).
 */
export function Example(_props: ExampleProps): null {
  return null;
}
