/**
 * Accent pill flagging a recently added component in the sidebar nav.
 * Right-aligned via `ml-auto`. Flat neon-blue tint — modern and readable on
 * both light and dark.
 *
 * Fully rounded pill, sized to its text with symmetric vertical padding and
 * centered as a unit in the nav row (`self-center`), so the label is truly
 * centered — no `self-stretch` height to amplify the cap-height metric bias.
 * Sits flush against the active pill's 8px right padding.
 */
export function NewBadge() {
  return (
    <span className="ml-auto inline-flex shrink-0 items-center self-center rounded-full bg-sky-400/15 px-1.5 pt-[3.5px] pb-[2.5px] font-semibold text-[8px] text-sky-600 uppercase leading-none tracking-wide ring-1 ring-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300">
      New
    </span>
  );
}
