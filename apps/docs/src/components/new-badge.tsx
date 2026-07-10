/**
 * Accent pill flagging a recently added component in the sidebar nav.
 * Right-aligned via `ml-auto`. Flat neon-blue tint — modern and readable on
 * both light and dark.
 */
export function NewBadge() {
  return (
    <span className="mr-1 ml-auto shrink-0 self-center rounded-full bg-sky-400/15 px-2 py-0.5 font-semibold text-[10px] text-sky-600 uppercase leading-none tracking-wide ring-1 ring-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300">
      New
    </span>
  );
}
