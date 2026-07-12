/**
 * Accent pill flagging a recently added component in the sidebar nav.
 * Right-aligned via `ml-auto`. Flat neon-blue tint — modern and readable on
 * both light and dark.
 *
 * Fully rounded pill. Inset a uniform 6px inside the active-item pill (radius
 * 9px, 8px x / 4px y padding — see `#nd-sidebar a.p-2` in globals.css):
 * `self-stretch` + `my-0.5` = the 4px vertical padding plus 2px; `-me-0.5`
 * pulls it 2px into the 8px right padding for a 6px right gap.
 */
export function NewBadge() {
  return (
    <span className="my-0.5 -me-0.5 ml-auto flex shrink-0 items-center self-stretch rounded-full bg-sky-400/15 px-2 font-semibold text-[10px] text-sky-600 uppercase leading-none tracking-wide ring-1 ring-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300">
      New
    </span>
  );
}
