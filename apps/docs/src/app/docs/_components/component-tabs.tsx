import Link from "fumadocs-core/link";
import { cn } from "@/lib/cn";

export type ComponentTab = { label: string; href: string; active: boolean };

/**
 * Segmented Docs | Learn control shown with the breadcrumb on component pages
 * that have a Learn article. Tabs are real routes, so they render as links
 * (not buttons). Visual language matches <Segmented>.
 *
 * On mobile the parent stacks this below the breadcrumb so long component
 * names aren't forced to wrap beside the control.
 */
export function ComponentTabs({
  tabs,
  className,
}: {
  tabs: ComponentTab[];
  className?: string;
}) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.active),
  );

  return (
    <div
      className={cn(
        "relative inline-grid h-8 shrink-0 rounded-[10px] border border-fd-border bg-[var(--muted)] p-[3px]",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-[3px] left-[3px] rounded-[7px] bg-[var(--card)] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{
          width: `calc((100% - 6px) / ${tabs.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? "page" : undefined}
          className={cn(
            "relative z-[1] inline-flex items-center justify-center whitespace-nowrap rounded-[7px] px-2.5 py-[3px] font-medium text-[13px] leading-[18px] transition-colors sm:px-3",
            tab.active
              ? "text-[var(--foreground)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
