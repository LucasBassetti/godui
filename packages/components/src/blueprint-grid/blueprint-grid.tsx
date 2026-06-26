"use client";

import * as React from "react";

export type BlueprintGridVariant = "lines" | "dots" | "perspective";

export type BlueprintGridProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Grid style: ruled `lines`, a `dots` matrix, or a floor-fading `perspective` grid. */
  variant?: BlueprintGridVariant;
  /** Cell size in px. */
  cellSize?: number;
  /** Line / dot color, any CSS color string. Defaults to the `--color-border` token. */
  color?: string;
  /** Render the diagonal light sweep traveling across the lattice. */
  sweep?: boolean;
  /** Seconds for one sweep pass. */
  sweepDuration?: number;
  /** Light up the grid in a glowing spotlight that follows the cursor. */
  spotlight?: boolean;
  /** Color the spotlit cells light up in. Defaults to the `--color-primary` token. */
  spotlightColor?: string;
  /** Radius (px) of the cursor spotlight. */
  spotlightRadius?: number;
};

/**
 * A technical blueprint lattice — ruled lines, a dot matrix, or a perspective
 * floor — with a diagonal light sweep and an optional cursor spotlight that
 * lights up nearby cells. Pure CSS. Drop it as the first child of a
 * `relative overflow-hidden` container.
 */
const BlueprintGrid = React.forwardRef<HTMLDivElement, BlueprintGridProps>(
  (
    {
      className,
      style,
      variant = "lines",
      cellSize = 32,
      color = "var(--border)",
      sweep = true,
      sweepDuration = 8,
      spotlight = true,
      spotlightColor = "var(--primary)",
      spotlightRadius = 200,
      ...props
    },
    ref,
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

    // The spotlight reacts to the pointer over the background *and* over any
    // content stacked above it: listen on the nearest positioned ancestor (the
    // `relative` wrapper) so movement anywhere in the hero is tracked.
    React.useEffect(() => {
      const root = rootRef.current;
      if (!root || !spotlight) return;
      const target = root.offsetParent ?? root;
      const onMove = (e: Event) => {
        const ev = e as PointerEvent;
        const rect = root.getBoundingClientRect();
        root.style.setProperty("--bx", `${ev.clientX - rect.left}px`);
        root.style.setProperty("--by", `${ev.clientY - rect.top}px`);
        root.style.setProperty("--bo", "1");
      };
      const onLeave = () => root.style.setProperty("--bo", "0");
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerleave", onLeave);
      return () => {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerleave", onLeave);
      };
    }, [spotlight]);

    const buildGrid = (c: string) =>
      variant === "dots"
        ? `radial-gradient(${c} 1px, transparent 1.5px)`
        : `linear-gradient(to right, ${c} 1px, transparent 1px), linear-gradient(to bottom, ${c} 1px, transparent 1px)`;
    const gridSize =
      variant === "dots"
        ? `${cellSize}px ${cellSize}px`
        : `${cellSize}px ${cellSize}px, ${cellSize}px ${cellSize}px`;

    const baseGrid: React.CSSProperties = {
      backgroundImage: buildGrid(color),
      backgroundSize: gridSize,
    };

    // Spotlight: an accent-colored copy of the grid plus a soft glow, both
    // clipped to a disc that follows the cursor.
    const spotMask = `radial-gradient(circle ${spotlightRadius}px at var(--bx, 50%) var(--by, 50%), #000 0%, #000 35%, transparent 75%)`;
    const spotStyle: React.CSSProperties = {
      backgroundImage: `radial-gradient(circle ${spotlightRadius}px at var(--bx, 50%) var(--by, 50%), color-mix(in oklab, ${spotlightColor}, transparent 78%), transparent 60%), ${buildGrid(spotlightColor)}`,
      backgroundSize: `auto, ${gridSize}`,
      opacity: "var(--bo)",
      WebkitMaskImage: spotMask,
      maskImage: spotMask,
    };

    return (
      <div
        ref={rootRef}
        data-slot="blueprint-grid"
        aria-hidden="true"
        className={`absolute inset-0 z-base overflow-hidden ${className ?? ""}`}
        style={
          {
            "--bo": "0",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {variant === "perspective" ? (
          <div className="absolute inset-0 [perspective:600px] [perspective-origin:50%_0%]">
            <div
              className="absolute right-[-50%] bottom-0 left-[-50%] h-[160%] origin-bottom opacity-50 [transform:rotateX(72deg)] [mask-image:linear-gradient(to_top,#000,transparent)]"
              style={baseGrid}
            />
          </div>
        ) : (
          <div className="absolute inset-0 opacity-50" style={baseGrid} />
        )}

        {/* Cursor spotlight: accent-colored cells + glow following the pointer. */}
        {spotlight && variant !== "perspective" && (
          <div
            className="absolute inset-0 [transition:opacity_300ms_ease-out]"
            style={spotStyle}
          />
        )}

        {/* Diagonal light sweep. */}
        {sweep && (
          <div
            className="absolute top-0 left-0 h-[140%] w-[55%] motion-reduce:hidden animate-blueprint-sweep [will-change:transform]"
            style={
              {
                "--blueprint-speed": `${sweepDuration}s`,
                backgroundImage: `linear-gradient(90deg, transparent, color-mix(in oklab, ${color}, transparent 20%), transparent)`,
                filter: "blur(14px)",
              } as React.CSSProperties
            }
          />
        )}
      </div>
    );
  },
);
BlueprintGrid.displayName = "BlueprintGrid";

export { BlueprintGrid };
