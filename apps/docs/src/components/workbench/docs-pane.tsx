"use client";

import Link from "fumadocs-core/link";
import { DocsBody } from "fumadocs-ui/layouts/docs/page";
import { GraduationCap, PanelRightClose } from "lucide-react";
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/lib/cn";
import { useResizablePane } from "@/lib/use-resizable-pane";

/** Shared chrome for the header's outbound links (Learn, Playground). */
const HEADER_LINK =
  "inline-flex items-center gap-1.5 rounded-[10px] border border-fd-border bg-fd-card px-2.5 py-1.5 font-medium text-fd-muted-foreground text-xs transition-colors hover:text-fd-foreground active:scale-95";

/** Below this the stage stops being a usable preview, so the pane stops growing. */
const MIN_STAGE_PX = 420;
const PANE_MIN = 360;
const PANE_MAX = 720;
const PANE_DEFAULT = 440;

// Runs during the server render too (for the initial aria-valuemax), so it
// cannot assume a window.
const clampPane = (containerPx: number): [number, number] => {
  const viewportCap =
    typeof window === "undefined" ? PANE_MAX : window.innerWidth * 0.55;
  const max = Math.max(
    PANE_MIN,
    Math.min(PANE_MAX, viewportCap, containerPx - MIN_STAGE_PX),
  );
  return [PANE_MIN, max];
};

/**
 * The docs surface: a real grid column beside the stage, not an overlay.
 *
 * It stays mounted and in normal DOM whether open or collapsed — the grid
 * column clips it. That is deliberate: this element lives inside `#nd-page`,
 * which is what aeo.js and crawlers scan, so the prose ships in the server HTML
 * instead of needing an off-screen duplicate. When collapsed it is `inert`, so
 * the clipped content can't be tabbed into while still being readable to
 * crawlers (they skip only `display:none` / `visibility:hidden`).
 */
export function DocsPane({
  open,
  onOpenChange,
  docs,
  learnHref,
  playgroundHref,
  containerRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  docs: ReactNode;
  learnHref?: string;
  /** Storybook page for this component, when one exists. */
  playgroundHref?: string;
  containerRef: RefObject<HTMLElement | null>;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const { separatorProps, dragging } = useResizablePane({
    axis: "x",
    cssVar: "--wb-panel-user",
    storageKey: "panelW",
    defaultPx: PANE_DEFAULT,
    clamp: clampPane,
    // Handle is on the pane's left edge, so dragging left grows it.
    invert: true,
    containerRef,
    label: "Resize documentation panel",
  });

  // The scroll container is the pane, not the document, so anchor links inside
  // the docs need to be resolved here. No timeout is needed — unlike the old
  // portaled drawer, this content is server-rendered and already laid out.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id || !open) return;
    const el = scrollerRef.current?.querySelector<HTMLElement>(
      `[id="${CSS.escape(id)}"]`,
    );
    el?.scrollIntoView({ block: "start" });
  }, [open]);

  const collapse = useCallback(() => onOpenChange(false), [onOpenChange]);

  return (
    <aside
      id="wb-docs-pane"
      data-wb-pane
      data-wb-surface
      aria-label="Component documentation"
      inert={!open}
      // Chrome (border/radius/shadow) is in globals.css so the desktop panel and
      // the mobile sheet can wear different shells without a class-name branch.
      className="wb-docs-pane relative flex flex-col overflow-hidden bg-fd-card max-xl:border-fd-border max-xl:border-t max-xl:shadow-2xl"
    >
      {/* Desktop resize handle. Sits just INSIDE the left edge — the pane clips
          its own overflow to honour the rounded corners, so a handle hanging
          outside would be invisible and unclickable. 12px of hit area, with a
          2px rail that only paints on hover/focus/drag. */}
      <div
        {...separatorProps}
        className={cn(
          "group absolute inset-y-0 left-0 z-30 hidden w-3 cursor-col-resize touch-none focus-visible:outline-none max-xl:!hidden xl:block",
          !open && "pointer-events-none",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-3 left-0 w-0.5 rounded-full transition-colors group-hover:bg-fd-primary/50 group-focus-visible:bg-fd-primary",
            dragging ? "bg-fd-primary" : "bg-transparent",
          )}
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-fd-border/70 border-b px-4 py-2.5">
        <span className="font-medium text-fd-muted-foreground text-xs uppercase tracking-wide">
          Documentation
        </span>
        <div className="flex items-center gap-1.5">
          {learnHref ? (
            <Link href={learnHref} className={HEADER_LINK}>
              <GraduationCap className="size-3.5" aria-hidden />
              Learn
            </Link>
          ) : null}
          {playgroundHref ? (
            <a
              href={playgroundHref}
              target="_blank"
              rel="noreferrer"
              className={HEADER_LINK}
            >
              <StorybookIcon />
              Playground
            </a>
          ) : null}
          <button
            type="button"
            aria-label="Collapse documentation"
            title="Collapse documentation"
            onClick={collapse}
            className="inline-flex size-8 items-center justify-center rounded-[10px] border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:text-fd-foreground active:scale-95"
          >
            <PanelRightClose className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        id="wb-docs-pane-body"
        ref={scrollerRef}
        tabIndex={-1}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:outline-none"
      >
        <DocsBody className="px-5 pt-1 pb-8">{docs}</DocsBody>
      </div>
    </aside>
  );
}

/**
 * Storybook's mark. Naming the destination beats a generic external-link arrow —
 * "Playground" says what you get, the logo says where you land.
 */
function StorybookIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5 shrink-0"
      fill="currentColor"
    >
      <path d="M16.71.243l-.12 2.71a.18.18 0 00.29.15l1.06-.8.9.7a.18.18 0 00.28-.14l-.1-2.62 1.33-.1a1.2 1.2 0 011.29 1.1v21.72a1.2 1.2 0 01-1.27 1.03l-16.15-.72a1.2 1.2 0 01-1.15-1.2V2.5A1.2 1.2 0 014.2 1.3zM13.4 9.4c0 .4 2.7.2 3.06-.06 0-2.75-1.47-4.2-4.17-4.2-2.7 0-4.2 1.47-4.2 3.68 0 3.85 5.2 3.92 5.2 6.02 0 .6-.3.95-.93.95-.83 0-1.16-.42-1.12-1.86 0-.31-3.16-.41-3.26 0-.24 3.5 1.94 4.5 4.42 4.5 2.4 0 4.29-1.28 4.29-3.63 0-4.13-5.28-4.02-5.28-6.06 0-.83.61-.94.98-.94.38 0 1.07.07 1.01 1.6z" />
    </svg>
  );
}
