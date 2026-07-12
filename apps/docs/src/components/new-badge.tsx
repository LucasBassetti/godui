/**
 * Accent pill flagging a recently added component in the sidebar nav.
 * Right-aligned via `ml-auto`. Flat neon-blue tint — modern and readable on
 * both light and dark.
 *
 * Concentric with the active-item pill (radius 9px, 8px x / 4px y padding — see
 * `#nd-sidebar a.p-2` in globals.css): the badge is inset a uniform 8px inside
 * that pill (`self-stretch` + `my-1` = the 4px vertical padding plus 4px; no
 * negative right margin, so it sits flush against the 8px right padding), so its
 * `rounded-[1px]` (9 − 8) corners nest concentrically inside the pill's.
 */
export function NewBadge() {
  return (
    <span className="my-1 ml-auto flex shrink-0 items-center self-stretch rounded-[1px] bg-sky-400/15 px-2 font-semibold text-[10px] text-sky-600 uppercase leading-none tracking-wide ring-1 ring-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300">
      New
    </span>
  );
}
