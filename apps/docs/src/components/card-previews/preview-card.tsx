"use client";

import Link from "fumadocs-core/link";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/cn";
import { cardPreviews } from "./registry";

type PreviewCardProps = {
  href: string;
  title: ReactNode;
  /** Description text — passed as children from MDX. */
  children?: ReactNode;
  className?: string;
};

/**
 * Component-index card with an optional live preview zone on top. Every preview
 * is statically imported (see registry), so it renders immediately — in the SSR
 * HTML and on hydration — with no intersection gate, no async chunk fetch, and
 * no Suspense fallback. The zone is therefore never empty, even mid-scroll.
 *
 * `content-visibility: auto` keeps that cheap: the browser skips render/paint
 * work for off-screen zones and does it synchronously as each card nears the
 * viewport, so a preview is always painted by the time it's visible. Previews
 * only animate while hovered (calm idle, motion on intent). Cards without a
 * registered preview fall back to the plain fumadocs Card look.
 */
export function PreviewCard({
  href,
  title,
  children,
  className,
}: PreviewCardProps) {
  const slug = href.split("/").filter(Boolean).pop() ?? "";
  const Preview = cardPreviews[slug];
  const [play, setPlay] = useState(false);

  // The card is a <div>, not an <a>, so previews that render their own anchors
  // or buttons don't nest inside a link. Navigation comes from a stretched
  // <Link> on the title (its ::after overlay covers the whole card).
  return (
    <div
      onPointerEnter={() => setPlay(true)}
      onPointerLeave={() => setPlay(false)}
      className={cn(
        "group relative block overflow-hidden rounded-xl border bg-fd-card text-fd-card-foreground transition-colors @max-lg:col-span-full hover:bg-fd-accent/40",
        className,
      )}
    >
      {Preview ? (
        <div
          data-play={play}
          className={cn(
            "preview-zone pointer-events-none relative flex h-[150px] items-center justify-center overflow-hidden border-b bg-[radial-gradient(oklch(0.7_0_0/0.12)_1px,transparent_1px)] [background-size:16px_16px]",
            // Skip off-screen render/paint cost for 100+ cards while keeping each
            // preview in the DOM; the browser paints it synchronously as it nears
            // the viewport. contain-intrinsic-size reserves the 150px height so
            // scroll position stays stable.
            "[content-visibility:auto] [contain-intrinsic-size:auto_150px]",
            // Hold every CSS animation still until the card is hovered, and always
            // when the user prefers reduced motion.
            "data-[play=false]:[&_*]:![animation-play-state:paused] motion-reduce:[&_*]:![animation-play-state:paused]",
          )}
        >
          <Preview play={play} />
        </div>
      ) : null}
      <div className="p-4">
        <h3 className="not-prose mb-1 font-medium text-sm">
          <Link
            href={href}
            data-card
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </h3>
        {children ? (
          <div className="prose-no-margin text-fd-muted-foreground text-sm empty:hidden">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
