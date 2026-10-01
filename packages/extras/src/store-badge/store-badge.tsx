"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";
import { encode } from "uqr";

export type StoreBadgeStore = "app-store" | "google-play";
export type StoreBadgeTheme = "dark" | "light";
export type QrCodeErrorCorrection = "L" | "M" | "Q" | "H";

const THEME: Record<StoreBadgeTheme, { shell: string; sheen: string }> = {
  // Hairline border is part of the official lockup (Apple keeps a gray edge).
  dark: {
    shell: "bg-black text-white ring-1 ring-white/20",
    sheen:
      "[background:linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.28)_50%,transparent_80%)]",
  },
  light: {
    shell: "bg-white text-black ring-1 ring-black/15",
    sheen:
      "[background:linear-gradient(105deg,transparent_20%,rgba(0,0,0,0.08)_50%,transparent_80%)]",
  },
};

const COPY: Record<StoreBadgeStore, { top: string; name: string }> = {
  "app-store": { top: "Download on the", name: "App Store" },
  "google-play": { top: "Get it on", name: "Google Play" },
};

function AppleLogo({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      role="presentation"
      width={size}
      height={size}
      className="shrink-0"
    >
      <title>Apple logo</title>
      <path d="M17.05 12.53c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.71-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.87-.76-1.48.02-2.84.86-3.6 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.08 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.29-.88-2.32-3.49zM14.86 5.6c.6-.74 1.01-1.75.9-2.77-.87.04-1.94.59-2.57 1.32-.56.64-1.05 1.68-.92 2.67.97.08 1.97-.5 2.59-1.22z" />
    </svg>
  );
}

function GooglePlayLogo({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
      width={size}
      height={size}
      className="shrink-0"
    >
      <title>Google Play logo</title>
      <path
        d="M3.6 2.3c-.24.25-.38.64-.38 1.15v17.1c0 .5.14.9.38 1.15l.06.06L13.2 12.1v-.2L3.66 2.24l-.06.06z"
        fill="#00d0ff"
      />
      <path
        d="M16.4 15.3l-3.2-3.2v-.2l3.2-3.2.07.04 3.79 2.15c1.08.61 1.08 1.62 0 2.24l-3.79 2.15-.07.04z"
        fill="#ffce00"
      />
      <path
        d="M16.47 15.26L13.2 12 3.6 21.7c.36.38.94.42 1.6.05l11.27-6.49z"
        fill="#ff3d47"
      />
      <path
        d="M16.47 8.74L5.2 2.25c-.66-.38-1.24-.33-1.6.05L13.2 12l3.27-3.26z"
        fill="#00f076"
      />
    </svg>
  );
}

export type QrCodeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color"
> & {
  /** The string encoded into the QR (a URL, deep link, etc.). */
  value: string;
  /** Rendered size in px. */
  size?: number;
  /** Error-correction level. Bumped to `Q` automatically when a `logo` is set. */
  ecc?: QrCodeErrorCorrection;
  /** Module (foreground) color. */
  color?: string;
  /** Background color behind the modules. Keep it light for scannability. */
  background?: string;
  /** Quiet-zone padding, in modules. */
  quietZone?: number;
  /** A node knocked out in the center (usually a small logo). */
  logo?: React.ReactNode;
  /** Accessible label. */
  label?: string;
};

/** A themeable QR code, encoded on the client and rendered as a crisp SVG. */
const QrCode = React.forwardRef<HTMLDivElement, QrCodeProps>(
  (
    {
      value,
      size = 160,
      ecc,
      color = "#0a0a0a",
      background = "#ffffff",
      quietZone = 2,
      logo,
      label,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const { path, dim } = React.useMemo(() => {
      const result = encode(value, {
        ecc: ecc ?? (logo ? "Q" : "M"),
        border: 0,
      });
      const n = result.size;
      const q = quietZone;
      let d = "";
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          if (result.data[y][x]) d += `M${x + q} ${y + q}h1v1h-1z`;
        }
      }
      return { path: d, dim: n + q * 2 };
    }, [value, ecc, logo, quietZone]);

    return (
      <div
        ref={ref}
        data-slot="qr-code"
        className={`relative inline-block ${className ?? ""}`}
        style={{ width: size, height: size, ...style }}
        {...props}
      >
        <svg
          viewBox={`0 0 ${dim} ${dim}`}
          width={size}
          height={size}
          role="img"
          aria-label={label ?? `QR code for ${value}`}
          shapeRendering="crispEdges"
        >
          <rect width={dim} height={dim} fill={background} />
          <path d={path} fill={color} />
        </svg>
        {logo ? (
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg"
            style={{
              width: `${size * 0.24}px`,
              height: `${size * 0.24}px`,
              background,
              padding: `${size * 0.03}px`,
            }}
          >
            {logo}
          </div>
        ) : null}
      </div>
    );
  },
);
QrCode.displayName = "QrCode";

// SPRING.snappy — menus / popovers pop.
const POP_SPRING = { type: "spring" as const, stiffness: 520, damping: 32 };

/**
 * The pro "scan to download" wrapper. On a fine pointer (desktop), hover/focus
 * reveals a QR popover so a laptop visitor can install on their phone. On a
 * coarse pointer (touch), the popover is skipped and the badge links normally.
 */
function QrPopover({
  url,
  label,
  caption,
  size,
  logo,
  children,
}: {
  url: string;
  label: string;
  caption?: string;
  size: number;
  logo?: React.ReactNode;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [coarse, setCoarse] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const show = () => !coarse && setOpen(true);
  const hide = () => setOpen(false);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: presentational hover/focus wrapper that reveals a QR popover; the child badge remains the interactive link
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {children}
      <AnimatePresence>
        {open ? (
          <motion.span
            className="absolute bottom-full left-1/2 z-popover mb-3 -translate-x-1/2"
            initial={
              reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            transition={reduce ? { duration: 0.15 } : POP_SPRING}
            style={{ transformOrigin: "bottom center" }}
            role="dialog"
            aria-label={label}
          >
            <span className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-popover p-3 text-popover-foreground shadow-xl">
              <QrCode value={url} size={size} logo={logo} label={label} />
              <span className="block max-w-[168px] text-center">
                <span className="block text-sm font-semibold leading-tight">
                  {label}
                </span>
                {caption ? (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {caption}
                  </span>
                ) : null}
              </span>
            </span>
            {/* Arrow */}
            <span className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-b border-r border-border bg-popover" />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

export type StoreBadgeProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> & {
  /** Which store this badge links to. */
  store: StoreBadgeStore;
  /** Dark (black) or light (white) finish. */
  theme?: StoreBadgeTheme;
  /** Badge height in px. Width and type scale with it. */
  height?: number;
  /**
   * Reveal a "scan to download" QR popover on hover/focus (desktop only).
   * Encodes `qrUrl` if set, otherwise the badge `href`.
   */
  qr?: boolean;
  /** Override what the QR encodes (defaults to `href`). */
  qrUrl?: string;
  /** Heading in the QR popover. */
  qrLabel?: string;
  /** Small line under the QR. */
  qrCaption?: string;
  /** QR render size in px. */
  qrSize?: number;
  /** A node knocked out in the QR center. */
  qrLogo?: React.ReactNode;
};

const StoreBadge = React.forwardRef<HTMLAnchorElement, StoreBadgeProps>(
  (
    {
      store,
      theme = "dark",
      height = 52,
      qr = false,
      qrUrl,
      qrLabel = "Scan to download",
      qrCaption = "Point your phone camera at the code",
      qrSize = 148,
      qrLogo,
      href,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const copy = COPY[store];
    const t = THEME[theme];
    // Proportions tuned to the official lockup so the badge reads authentic.
    const iconSize = Math.round(height * 0.52);
    const topSize = Math.max(9, Math.round(height * 0.17));
    const nameSize = Math.max(13, Math.round(height * 0.3));

    const badge = (
      <a
        ref={ref}
        href={href}
        data-slot="store-badge"
        data-store={store}
        className={`group/badge relative isolate inline-flex select-none items-center overflow-hidden transition-transform duration-200 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transition-none ${t.shell} ${className ?? ""}`}
        style={{
          height: `${height}px`,
          gap: `${Math.round(height * 0.17)}px`,
          paddingInline: `${Math.round(height * 0.3)}px`,
          borderRadius: `${Math.round(height * 0.18)}px`,
          ...style,
        }}
        {...props}
      >
        {store === "app-store" ? (
          <AppleLogo size={iconSize} />
        ) : (
          <GooglePlayLogo size={iconSize} />
        )}
        <span className="flex flex-col items-start leading-none">
          <span
            className="font-medium tracking-wide"
            style={{ fontSize: `${topSize}px`, opacity: 0.92 }}
          >
            {copy.top}
          </span>
          <span
            className="font-semibold leading-tight"
            style={{ fontSize: `${nameSize}px`, marginTop: height * 0.02 }}
          >
            {copy.name}
          </span>
        </span>
        {/* Sheen sweep on hover — a light bar crosses the badge once. */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-12deg] transition-transform duration-700 ease-out group-hover/badge:translate-x-[130%] motion-reduce:hidden ${t.sheen}`}
        />
      </a>
    );

    if (!qr) return badge;

    return (
      <QrPopover
        url={qrUrl ?? href ?? ""}
        label={qrLabel}
        caption={qrCaption}
        size={qrSize}
        logo={qrLogo}
      >
        {badge}
      </QrPopover>
    );
  },
);
StoreBadge.displayName = "StoreBadge";

export type StoreBadgeGroupProps = React.HTMLAttributes<HTMLDivElement>;

/** A convenience row for the App Store + Google Play dual-badge CTA. */
const StoreBadgeGroup = React.forwardRef<HTMLDivElement, StoreBadgeGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="store-badge-group"
      className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}
      {...props}
    />
  ),
);
StoreBadgeGroup.displayName = "StoreBadgeGroup";

export { QrCode, StoreBadge, StoreBadgeGroup };
