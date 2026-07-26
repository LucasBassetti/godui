"use client";

import { motion } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { type DrawerTab, PanelBody } from "@/components/workbench/panel-body";

/**
 * Desktop docs surface: a full-viewport-height rail pinned to the right edge that
 * slides in on `transform` and pushes the whole app left. The shift itself is
 * driven by CSS — this component only toggles `data-wb-panel="open"` on the docs
 * layout grid, which sets the `--wb-panel-w` right offset on the fixed header +
 * TOC and reserves space in the main column (see globals.css). Portaled to
 * <body> so the stage frame's `overflow-hidden` can't clip it, and kept mounted
 * (off-screen + inert) when closed so the docs stay in the DOM for aeo.js.
 */
export function StagePanel({
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
  // Portal target (document.body) only exists on the client; render null on the
  // server + first hydration pass, then flip after mount. Setting state in this
  // mount effect is the canonical portal-hydration pattern (server render must
  // match the first client render), so the set-state-in-effect rule is expected.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- mount gate for createPortal
  useEffect(() => setMounted(true), []);

  // Drive the app-wide left shift by flagging the docs layout grid.
  useEffect(() => {
    const layout = document.getElementById("nd-docs-layout");
    if (!layout) return;
    if (open) layout.setAttribute("data-wb-panel", "open");
    else layout.removeAttribute("data-wb-panel");
    return () => layout.removeAttribute("data-wb-panel");
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <motion.aside
      aria-label="Component documentation"
      data-wb-surface
      aria-hidden={!open}
      inert={!open}
      initial={false}
      animate={{ x: open ? 0 : "100%" }}
      transition={{ type: "spring", damping: 36, stiffness: 360, mass: 0.9 }}
      className="fixed top-0 right-0 z-50 flex h-[100dvh] w-[var(--wb-panel-w,420px)] flex-col border-fd-border border-l bg-fd-card shadow-2xl"
    >
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
    </motion.aside>,
    document.body,
  );
}
