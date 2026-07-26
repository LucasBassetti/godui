"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { Crumb } from "@/app/docs/_components/breadcrumbs";

export type BadgeTone = "sky" | "amber" | "emerald" | "violet";
/** One compact meta item shown in the title chip (dot + label + hover tooltip). */
export type BadgeItem = {
  tone: BadgeTone;
  label: string;
  /** Short tooltip heading. */
  title?: string;
  /** Longer tooltip body. */
  detail?: string;
  /** Optional "learn more" link in the tooltip. */
  href?: string;
  hrefLabel?: string;
};

/**
 * Page-level metadata the MDX body doesn't own. Set by the docs page and read by
 * <Workbench> to render the title chip, breadcrumb and dock links.
 */
export type WorkbenchMeta = {
  title: string;
  description?: string;
  /** Compact meta items (dot + label) rendered under the title. */
  badges?: BadgeItem[];
  /** Route to the component's Learn article, when one exists. */
  learnHref?: string;
  /** Base docs route (used to restore the URL when the Learn drawer closes). */
  docsHref?: string;
  /** Pre-rendered Learn article body, shown in the Learn drawer tab. */
  learn?: ReactNode;
  /**
   * When set, the drawer opens to this tab on mount (used by the `…/learn`
   * route so a refresh/deep-link opens the Learn drawer + scrolls to the hash).
   */
  initialDrawerTab?: "docs" | "code" | "learn";
  breadcrumbs: Crumb[];
};

const WorkbenchMetaContext = createContext<WorkbenchMeta | null>(null);

export function WorkbenchProvider({
  value,
  children,
}: {
  value: WorkbenchMeta;
  children: ReactNode;
}) {
  return (
    <WorkbenchMetaContext.Provider value={value}>
      {children}
    </WorkbenchMetaContext.Provider>
  );
}

export function useWorkbenchMeta(): WorkbenchMeta {
  const ctx = useContext(WorkbenchMetaContext);
  if (!ctx) {
    throw new Error(
      "useWorkbenchMeta must be used within <WorkbenchProvider>.",
    );
  }
  return ctx;
}
