"use client";

import Link from "fumadocs-core/link";
import { type ReactNode, Suspense, useEffect, useRef, useState } from "react";
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
 * Component-index card with an optional live preview zone on top. When a preview
 * is registered for the card's slug it lazy-mounts once the card scrolls near the
 * viewport and only animates while hovered (calm idle, motion on intent). Cards
 * without a registered preview fall back to the plain fumadocs Card look.
 */
export function PreviewCard({
  href,
  title,
  children,
  className,
}: PreviewCardProps) {
  const slug = href.split("/").filter(Boolean).pop() ?? "";
  const Preview = cardPreviews[slug];

  const zoneRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!Preview) return;
    const el = zoneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [Preview]);

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
          ref={zoneRef}
          data-play={play}
          className={cn(
            "preview-zone pointer-events-none relative flex h-[150px] items-center justify-center overflow-hidden border-b bg-[radial-gradient(oklch(0.7_0_0/0.12)_1px,transparent_1px)] [background-size:16px_16px]",
            // Hold every CSS animation still until the card is hovered, and always
            // when the user prefers reduced motion.
            "data-[play=false]:[&_*]:![animation-play-state:paused] motion-reduce:[&_*]:![animation-play-state:paused]",
          )}
        >
          {inView ? (
            <Suspense fallback={null}>
              <Preview play={play} />
            </Suspense>
          ) : null}
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
