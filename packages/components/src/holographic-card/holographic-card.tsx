"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type HolographicVariant = "rainbow" | "aurora" | "galaxy" | "gold";

export type HolographicCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Foil colorway. */
  variant?: HolographicVariant;
  /** Maximum tilt in degrees toward the pointer. */
  maxTilt?: number;
  /** Render a specular glare that tracks the pointer. */
  glare?: boolean;
  /** Overlay a fine glitter mask for a holo-flake finish. */
  sparkle?: boolean;
  /** Drive the tilt from the device gyroscope on touch devices. */
  gyroscope?: boolean;
};

// SPRING.bouncy — lively follow-through for pointer-tracked motion.
const SPRING = { stiffness: 170, damping: 12, mass: 0.1 } as const;

const ROOT_BASE =
  "relative isolate overflow-hidden rounded-2xl border border-white/10 text-white shadow-2xl [will-change:transform]";

// A dark, saturated base so the color-dodge foil reads as vivid iridescence
// rather than blowing out to white over a light surface.
const BASE: Record<HolographicVariant, string> = {
  rainbow:
    "[background:radial-gradient(120%_120%_at_30%_15%,#312e81_0%,#0b1020_55%,#020617_100%)]",
  aurora:
    "[background:radial-gradient(120%_120%_at_30%_15%,#0e7490_0%,#052e2b_55%,#020617_100%)]",
  galaxy:
    "[background:radial-gradient(120%_120%_at_30%_15%,#4c1d95_0%,#0a0a14_55%,#020617_100%)]",
  gold: "[background:radial-gradient(120%_120%_at_30%_15%,#78350f_0%,#1c1206_55%,#020617_100%)]",
};

// The iridescent foil per colorway. Hardcoded hues are intrinsic to the effect
// (like aurora-text / light-rays), not theme surfaces — the blend mode fuses
// them with the dark base.
const FOIL: Record<HolographicVariant, string> = {
  rainbow:
    "[background-image:linear-gradient(115deg,#ff2d95,#ffd84d,#4dff9e,#4dd2ff,#a24dff,#ff2d95)]",
  aurora:
    "[background-image:linear-gradient(115deg,#22d3ee,#34d399,#a3e635,#38bdf8,#22d3ee)]",
  galaxy:
    "[background-image:linear-gradient(115deg,#a855f7,#ec4899,#3b82f6,#c026d3,#a855f7)]",
  gold: "[background-image:linear-gradient(115deg,#b45309,#fbbf24,#fffbeb,#fbbf24,#b45309)]",
};

// Foil concentrates where the "light" (pointer) hits, so it catches highlights
// like real holo film instead of flooding the whole card.
const FOIL_LAYER =
  "pointer-events-none absolute inset-0 mix-blend-color-dodge [background-size:200%_200%] [background-position:var(--holo-x)_var(--holo-y)] [mask-image:radial-gradient(75%_75%_at_var(--holo-x)_var(--holo-y),#000_0%,rgba(0,0,0,0.4)_55%,transparent_100%)]";

const SPARKLE_LAYER =
  "pointer-events-none absolute inset-0 opacity-40 mix-blend-color-dodge [background-image:radial-gradient(rgba(255,255,255,0.9)_0.5px,transparent_1.6px)] [background-size:6px_6px] [mask-image:radial-gradient(45%_45%_at_var(--holo-x)_var(--holo-y),#000,transparent_75%)]";

const GLARE_LAYER =
  "pointer-events-none absolute inset-0 z-overlay mix-blend-soft-light [background:radial-gradient(40%_40%_at_var(--holo-x)_var(--holo-y),rgba(255,255,255,0.55),transparent_72%)]";

// Premium edge: a crisp top light-line plus an inner vignette to seat the card.
const EDGE_LAYER =
  "pointer-events-none absolute inset-0 z-overlay rounded-[inherit] [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.18),inset_0_0_36px_0_rgba(0,0,0,0.45)]";

const HolographicCard = React.forwardRef<HTMLDivElement, HolographicCardProps>(
  (
    {
      variant = "rainbow",
      maxTilt = 14,
      glare = true,
      sparkle = true,
      gyroscope = false,
      className,
      style,
      children,
      onPointerMove,
      onPointerLeave,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );
    const reduceMotion = useReducedMotion();

    // Pointer normalized to -0.5..0.5 over the card, spring-smoothed.
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const sx = useSpring(px, SPRING);
    const sy = useSpring(py, SPRING);

    const rotateX = useTransform(sy, [-0.5, 0.5], [maxTilt, -maxTilt]);
    const rotateY = useTransform(sx, [-0.5, 0.5], [-maxTilt, maxTilt]);
    const holoX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
    const holoY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);

    // Optional gyroscope tilt for touch devices (opt-in). iOS 13+ gates the
    // sensor behind a permission prompt that must fire from a user gesture, so
    // we request it on the first tap, then map beta/gamma onto the same values.
    React.useEffect(() => {
      if (!gyroscope || reduceMotion) return;
      if (
        typeof window === "undefined" ||
        !("DeviceOrientationEvent" in window)
      )
        return;

      let attached = false;
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return;
        // gamma: left/right (-45..45), beta: front/back (0..90 upright).
        px.set(Math.max(-0.5, Math.min(0.5, e.gamma / 45)));
        py.set(Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 45)));
      };
      const attach = () => {
        if (attached) return;
        attached = true;
        window.addEventListener("deviceorientation", handleOrientation);
      };

      const orientationEvent = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      const requestOnTap = () => {
        orientationEvent
          .requestPermission?.()
          .then((state) => {
            if (state === "granted") attach();
          })
          .catch(() => {});
        window.removeEventListener("pointerdown", requestOnTap);
      };

      if (typeof orientationEvent.requestPermission === "function") {
        window.addEventListener("pointerdown", requestOnTap);
      } else {
        attach();
      }

      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
        window.removeEventListener("pointerdown", requestOnTap);
      };
    }, [gyroscope, reduceMotion, px, py]);

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!reduceMotion) {
        const el = ref.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          px.set((e.clientX - rect.left) / rect.width - 0.5);
          py.set((e.clientY - rect.top) / rect.height - 0.5);
        }
      }
      onPointerMove?.(e);
    };

    const handleLeave = (e: React.PointerEvent<HTMLDivElement>) => {
      px.set(0);
      py.set(0);
      onPointerLeave?.(e);
    };

    // Reduced motion: a still card with the foil resting at center — no tilt,
    // no pointer tracking, no gyroscope.
    if (reduceMotion) {
      return (
        <div
          ref={ref}
          data-slot="holographic-card"
          className={`${ROOT_BASE} ${className ?? ""}`}
          style={
            {
              "--holo-x": "50%",
              "--holo-y": "40%",
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          <div aria-hidden className={`absolute inset-0 ${BASE[variant]}`} />
          <div
            aria-hidden
            className={`${FOIL_LAYER} ${FOIL[variant]} opacity-50`}
          />
          <div className="relative z-raised">{children}</div>
          <div aria-hidden className={EDGE_LAYER} />
        </div>
      );
    }

    return (
      // Outer wrapper owns the perspective so the tilt reads as real depth.
      <div className="[perspective:1200px]">
        <motion.div
          ref={ref}
          data-slot="holographic-card"
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          whileHover={{ scale: 1.03 }}
          style={
            {
              rotateX,
              rotateY,
              "--holo-x": holoX,
              "--holo-y": holoY,
              ...style,
            } as React.ComponentProps<typeof motion.div>["style"]
          }
          className={`${ROOT_BASE} ${className ?? ""}`}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          <div aria-hidden className={`absolute inset-0 ${BASE[variant]}`} />
          <div
            aria-hidden
            className={`${FOIL_LAYER} ${FOIL[variant]} opacity-60`}
          />
          {sparkle ? <div aria-hidden className={SPARKLE_LAYER} /> : null}
          <div className="relative z-raised">{children}</div>
          {glare ? <div aria-hidden className={GLARE_LAYER} /> : null}
          <div aria-hidden className={EDGE_LAYER} />
        </motion.div>
      </div>
    );
  },
);
HolographicCard.displayName = "HolographicCard";

export { HolographicCard };
