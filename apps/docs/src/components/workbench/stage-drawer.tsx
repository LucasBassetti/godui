"use client";

import { motion, type PanInfo } from "framer-motion";
import type { ReactNode } from "react";
import { type DrawerTab, PanelBody } from "@/components/workbench/panel-body";
import { cn } from "@/lib/cn";

export type { DrawerTab };

const CLOSE_OFFSET = 120;
const CLOSE_VELOCITY = 600;

/**
 * A bottom sheet scoped to the Workbench stage — NOT a body-portaled modal
 * (unlike @godui/components Drawer). It's absolutely positioned inside the stage
 * so the site header + sidenav stay visible and interactive. Used on mobile; the
 * desktop presentation is the right-side <StagePanel>. Both share <PanelBody>.
 */
export function StageDrawer({
  open,
  onOpenChange,
  tab,
  onTabChange,
  hasCode,
  docs,
  code,
  lang,
  learn,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tab: DrawerTab;
  onTabChange: (tab: DrawerTab) => void;
  hasCode: boolean;
  docs: ReactNode;
  code: string;
  lang?: string;
  learn?: ReactNode;
}) {
  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.y > CLOSE_OFFSET || info.velocity.y > CLOSE_VELOCITY) {
      onOpenChange(false);
    }
  };

  return (
    // Stays mounted when closed (translated off-screen) so the active tab's text
    // remains in the DOM — the aeo.js AI view + crawlers read the article and skip
    // only display:none, so the default (Docs) content is what they see. `inert` +
    // aria-hidden neutralise the off-screen panel for humans and assistive tech.
    <div
      className={cn(
        "absolute inset-0 z-30 flex flex-col justify-end",
        open ? "" : "pointer-events-none",
      )}
      aria-hidden={!open}
      inert={!open}
    >
      <motion.button
        type="button"
        aria-label="Close panel"
        tabIndex={open ? 0 : -1}
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => onOpenChange(false)}
        className={cn(
          "absolute inset-0 cursor-default bg-[var(--foreground)]/25 backdrop-blur-[2px]",
          open ? "" : "pointer-events-none",
        )}
      />
      <motion.div
        role="dialog"
        aria-modal="false"
        aria-label="Component documentation"
        data-wb-surface
        initial={false}
        animate={{ y: open ? 0 : "100%" }}
        transition={{ type: "spring", damping: 34, stiffness: 340, mass: 0.9 }}
        drag={open ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={handleDragEnd}
        className="relative flex h-[90%] flex-col rounded-t-2xl border-fd-border border-t bg-fd-card shadow-2xl"
      >
        {/* Grab handle */}
        <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 cursor-grab rounded-full bg-fd-muted-foreground/30 active:cursor-grabbing" />
        <PanelBody
          open={open}
          onClose={() => onOpenChange(false)}
          tab={tab}
          onTabChange={onTabChange}
          hasCode={hasCode}
          docs={docs}
          code={code}
          lang={lang}
          learn={learn}
        />
      </motion.div>
    </div>
  );
}
