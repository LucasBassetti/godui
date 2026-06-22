import Link from "fumadocs-core/link";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/cn";

export type Crumb = { name: string; url?: string };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="-mb-2 flex items-center gap-1.5 text-fd-muted-foreground text-sm"
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;

        return (
          <Fragment key={crumb.name}>
            {i > 0 && (
              <ChevronRight className="size-3.5 shrink-0" aria-hidden />
            )}
            {crumb.url && !isLast ? (
              <Link
                href={crumb.url}
                className="transition-colors hover:text-fd-foreground"
              >
                {crumb.name}
              </Link>
            ) : (
              <span className={cn(isLast && "text-fd-foreground")}>
                {crumb.name}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
