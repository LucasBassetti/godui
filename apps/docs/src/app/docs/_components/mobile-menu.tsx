import Link from "fumadocs-core/link";
import { Component, Sparkles } from "lucide-react";
import { ANIMATED_ICONS_URL } from "./docs-header";

const itemClass =
  "flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground text-sm transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 [&_svg]:size-4 [&_svg]:shrink-0";

/**
 * Mobile-only "Menu" section rendered as the sidebar drawer banner. The same
 * links live in the header nav on desktop (hidden on mobile), so this surfaces
 * them inside the drawer. `md:hidden` keeps it out of the desktop sidebar.
 */
export function MobileMenu() {
  return (
    <div className="flex flex-col gap-1 md:hidden">
      <p className="px-2 pb-1 font-medium text-fd-muted-foreground/60 text-xs uppercase tracking-wide">
        Menu
      </p>
      <Link href="/docs/components" className={itemClass}>
        <Component />
        Components
      </Link>
      <a
        href={ANIMATED_ICONS_URL}
        target="_blank"
        rel="noreferrer"
        className={itemClass}
      >
        <Sparkles />
        Animated Icons
      </a>
    </div>
  );
}
