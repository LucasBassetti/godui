"use client";

import { Download, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/cn";
import { useWorkbenchShortcuts } from "@/lib/use-workbench-shortcuts";

/**
 * Template stage — bounded Workbench frame with a looping preview video.
 * Top-right rail mirrors the Docs chip format: Download + Live preview, then
 * fullscreen. No title chip, grads, or Docs pane.
 */
export function TemplateShowcase({
  video,
  poster,
  downloadHref,
  previewHref,
}: {
  /** Source of the looping preview video (e.g. `/portfolio.mp4`). */
  video: string;
  /** Optional still shown before the video loads / decodes. */
  poster?: string;
  /** Where "Download" points — the template's source repository. */
  downloadHref: string;
  /** Where "Live preview" points — the deployed template. */
  previewHref: string;
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => setFullscreen((v) => !v);

  useWorkbenchShortcuts({
    toggleDocs: () => {},
    toggleCode: () => {},
    replay: () => {},
    toggleFullscreen,
    toggleView: () => {},
    prevExample: () => {},
    nextExample: () => {},
    escape: () => {
      if (fullscreen) toggleFullscreen();
    },
  });

  return (
    <div
      data-wb-solo
      className={cn(
        "workbench-root overflow-hidden bg-fd-background",
        fullscreen
          ? "fixed inset-0 z-50"
          : // Mobile: short auto-height stage so the whole video is visible
            // instead of a cover-cropped middle strip. Desktop: fill the viewport.
            "relative h-auto p-3 sm:h-[calc(100dvh-3.5rem)] sm:p-4",
      )}
    >
      <div
        className={cn(
          "stage-frame relative min-h-0 min-w-0 overflow-hidden bg-fd-background",
          // Mobile height comes from the video's aspect ratio; desktop fills its
          // grid row (aspect-auto lets the grid drive height again).
          fullscreen ? "aspect-auto" : "aspect-video sm:aspect-auto",
          fullscreen
            ? ""
            : "rounded-[20px] border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.10)]",
        )}
      >
        <div id="wb-stage" className="relative min-h-0 overflow-hidden">
          <div className="workbench-canvas absolute inset-0" aria-hidden />

          {/* Slight zoom crops letterboxed bars in the source video; the stage
              clips the overflow. */}
          <video
            className="absolute inset-0 size-full scale-[1.12] object-cover"
            src={video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />

          {/* Desktop only: top-right rail overlaid on the video, beside the
              fullscreen toggle. Mobile actions live below the stage (see below). */}
          <div className="pointer-events-none absolute inset-x-4 top-4 z-20 hidden items-start justify-end gap-4 sm:flex">
            <div className="pointer-events-auto flex shrink-0 flex-nowrap items-center gap-1.5">
              <RailLink href={downloadHref} label="Download">
                <Download className="size-4" aria-hidden />
                <span className="font-medium text-[13px]">Download</span>
              </RailLink>
              <RailLink href={previewHref} label="Live preview">
                <ExternalLink className="size-4" aria-hidden />
                <span className="font-medium text-[13px]">Live preview</span>
              </RailLink>
              <span
                aria-hidden
                className="mx-0.5 h-5 w-px bg-fd-border max-lg:hidden"
              />
              <ToolButton
                label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                hint="F"
                active={fullscreen}
                onClick={toggleFullscreen}
                className="max-lg:hidden"
              >
                {fullscreen ? (
                  <Minimize2 className="size-4" aria-hidden />
                ) : (
                  <Maximize2 className="size-4" aria-hidden />
                )}
              </ToolButton>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile only: actions in normal flow below the video, centered.
          col-span-full pushes it to a new full-width row (the workbench-root
          grid's second column is the 0px docs-pane slot). */}
      <div className="col-span-full mt-3 flex items-center justify-center gap-2 sm:hidden">
        <RailLink href={downloadHref} label="Download" variant="outline">
          <Download className="size-4" aria-hidden />
          <span className="font-medium text-[13px]">Download</span>
        </RailLink>
        <RailLink href={previewHref} label="Live preview">
          <ExternalLink className="size-4" aria-hidden />
          <span className="font-medium text-[13px]">Live preview</span>
        </RailLink>
      </div>
    </div>
  );
}

/** Wide rail chip — same shell as the Workbench Docs button, as a link. */
function RailLink({
  href,
  label,
  variant = "default",
  children,
}: {
  href: string;
  label: string;
  variant?: "default" | "outline";
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-[10px] border px-2.5 transition-colors active:scale-95",
        variant === "outline"
          ? "border-fd-primary/60 bg-transparent text-fd-primary hover:bg-fd-primary/10"
          : "border-fd-border bg-fd-card text-fd-muted-foreground hover:text-fd-foreground",
      )}
    >
      {children}
    </a>
  );
}

function ToolButton({
  label,
  active,
  hint,
  onClick,
  children,
  className,
}: {
  label: string;
  active?: boolean;
  hint?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={hint ? `${label} (${hint})` : label}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-[10px] border transition-colors active:scale-95",
        className,
        active
          ? "border-fd-primary/45 bg-fd-primary/10 text-fd-primary"
          : "border-fd-border bg-fd-card text-fd-muted-foreground hover:text-fd-foreground",
      )}
    >
      {children}
    </button>
  );
}
