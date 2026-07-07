"use client";

import DottedMap from "dotted-map";
import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

/** A point on the globe. */
export type WorldMapPoint = {
  lat: number;
  lng: number;
  /** Optional label, exposed as the endpoint's `aria-label`. */
  label?: string;
};

/** A single arc drawn between two points. */
export type WorldMapConnection = {
  start: WorldMapPoint;
  end: WorldMapPoint;
};

export type WorldMapProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color"
> & {
  /** Arcs to draw. Defaults to a global sample set. */
  connections?: WorldMapConnection[];
  /** Color of the arcs and endpoint pins. Any CSS color. */
  lineColor?: string;
  /** Color of the land dots. Any CSS color (defaults to a muted token). */
  dotColor?: string;
  /** Re-draw the arcs on a loop. */
  loop?: boolean;
  /** Seconds for one arc to draw in. */
  duration?: number;
};

// A small, recognizable global sample so the default render looks alive.
const DEFAULT_CONNECTIONS: WorldMapConnection[] = [
  {
    start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
    end: { lat: 51.5074, lng: -0.1278, label: "London" },
  },
  {
    start: { lat: 51.5074, lng: -0.1278, label: "London" },
    end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
  },
  {
    start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
    end: { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
  },
  {
    start: { lat: 40.7128, lng: -74.006, label: "New York" },
    end: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
  },
  {
    start: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
    end: { lat: -33.8688, lng: 151.2093, label: "Sydney" },
  },
];

const pointKey = (p: WorldMapPoint) => `${p.lat},${p.lng}`;

const WorldMap = React.forwardRef<HTMLDivElement, WorldMapProps>(
  (
    {
      connections = DEFAULT_CONNECTIONS,
      lineColor = "var(--primary)",
      dotColor = "color-mix(in oklch, var(--muted-foreground) 40%, transparent)",
      loop = true,
      duration = 1.6,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const gradientId = React.useId();

    // The dot-grid map is deterministic, so the same markup renders on the
    // server and the client — no hydration mismatch. `currentColor` lets the
    // land dots follow `dotColor` (set as the wrapper's text color) so the map
    // stays theme-aware without regenerating the SVG.
    const { markup, width, height, map } = React.useMemo(() => {
      const map = new DottedMap({ height: 60, grid: "diagonal" });
      const svg = map.getSVG({
        radius: 0.22,
        color: "currentColor",
        shape: "circle",
        backgroundColor: "transparent",
      });
      // Strip the outer <svg> wrapper; we render the dots inside our own SVG so
      // the arcs share one coordinate space.
      const inner = svg.replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
      const { width, height } = map.image;
      return { markup: inner, width, height, map };
    }, []);

    const arcs = React.useMemo(() => {
      return connections
        .map((c) => {
          const a = map.getPin({ lat: c.start.lat, lng: c.start.lng });
          const b = map.getPin({ lat: c.end.lat, lng: c.end.lng });
          if (!a || !b) return null;
          const cx = (a.x + b.x) / 2;
          const bow = Math.hypot(b.x - a.x, b.y - a.y) * 0.35;
          const cy = Math.min(a.y, b.y) - bow;
          return {
            d: `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`,
            start: { ...a, label: c.start.label },
            end: { ...b, label: c.end.label },
          };
        })
        .filter((v): v is NonNullable<typeof v> => v !== null);
    }, [connections, map]);

    const pins = React.useMemo(() => {
      const seen = new Map<string, { x: number; y: number; label?: string }>();
      for (const arc of arcs) {
        seen.set(pointKey({ lat: arc.start.x, lng: arc.start.y }), {
          x: arc.start.x,
          y: arc.start.y,
          label: arc.start.label,
        });
        seen.set(pointKey({ lat: arc.end.x, lng: arc.end.y }), {
          x: arc.end.x,
          y: arc.end.y,
          label: arc.end.label,
        });
      }
      return [...seen.values()];
    }, [arcs]);

    return (
      <div
        ref={ref}
        data-slot="world-map"
        className={`relative w-full ${className ?? ""}`}
        style={{ aspectRatio: `${width} / ${height}`, ...style }}
        {...props}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
          role="presentation"
          className="absolute inset-0 size-full"
          style={{ color: dotColor }}
        >
          <title>World map</title>
          {/* Land dots */}
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: dot markup is generated locally from a static dataset, never user input. */}
          <g dangerouslySetInnerHTML={{ __html: markup }} />

          <defs>
            {/* Fade the arc ends so beams emerge from and dissolve into the pins. */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
              <stop offset="12%" stopColor={lineColor} stopOpacity="1" />
              <stop offset="88%" stopColor={lineColor} stopOpacity="1" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          {arcs.map((arc, i) => (
            <motion.path
              // biome-ignore lint/suspicious/noArrayIndexKey: arcs are positional and have no stable id.
              key={i}
              d={arc.d}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={0.35}
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      pathLength: {
                        duration,
                        delay: 0.4 + i * 0.3,
                        ease: [0.22, 1, 0.36, 1], // EASE.out
                        repeat: loop ? Number.POSITIVE_INFINITY : 0,
                        repeatDelay: loop ? connections.length * 0.3 : 0,
                        repeatType: "loop",
                      },
                    }
              }
            />
          ))}

          {pins.map((pin) => (
            <g key={`${pin.x},${pin.y}`}>
              {!reduceMotion && (
                <motion.circle
                  cx={pin.x}
                  cy={pin.y}
                  r={0.5}
                  fill={lineColor}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{
                    duration: 1.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: [0.22, 1, 0.36, 1], // EASE.out
                  }}
                  // fill-box so the ripple scales around the pin's own center.
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                />
              )}
              <circle cx={pin.x} cy={pin.y} r={0.5} fill={lineColor}>
                {pin.label ? <title>{pin.label}</title> : null}
              </circle>
            </g>
          ))}
        </svg>
      </div>
    );
  },
);
WorldMap.displayName = "WorldMap";

export { WorldMap };
