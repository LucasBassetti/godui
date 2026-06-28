"use client";

import createGlobe, { type COBEOptions } from "cobe";
import * as React from "react";

export type GlobeProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Override any cobe option (markers, colors, glow, etc.). */
  config?: Partial<COBEOptions>;
};

const DEFAULT_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [0.23, 0.51, 0.96],
  glowColor: [1, 1, 1],
  markers: [
    { location: [37.7595, -122.4367], size: 0.05 },
    { location: [40.7128, -74.006], size: 0.08 },
    { location: [51.5074, -0.1278], size: 0.06 },
    { location: [35.6762, 139.6503], size: 0.07 },
    { location: [-23.5505, -46.6333], size: 0.06 },
    { location: [1.3521, 103.8198], size: 0.05 },
  ],
};

const Globe = React.forwardRef<HTMLDivElement, GlobeProps>(
  ({ config, className, style, ...props }, forwardedRef) => {
    const wrapRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => wrapRef.current as HTMLDivElement,
    );
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const phiRef = React.useRef(0);
    const widthRef = React.useRef(0);
    const pointerInteracting = React.useRef<number | null>(null);
    const pointerMovement = React.useRef(0);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;

      const onResize = () => {
        widthRef.current = wrap.offsetWidth;
      };
      window.addEventListener("resize", onResize);
      onResize();

      const merged: COBEOptions = {
        ...DEFAULT_CONFIG,
        ...config,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
      };

      const globe = createGlobe(canvas, merged);
      let raf = 0;
      // Honor reduced motion — hold the globe still instead of auto-rotating.
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      // Auto-rotate while idle; hand control to the pointer on drag.
      const tick = () => {
        if (pointerInteracting.current === null && !reduceMotion)
          phiRef.current += 0.005;
        globe.update({
          phi: phiRef.current + pointerMovement.current / 200,
          width: widthRef.current * 2,
          height: widthRef.current * 2,
        });
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      const reveal = requestAnimationFrame(() => {
        canvas.style.opacity = "1";
      });

      return () => {
        cancelAnimationFrame(raf);
        cancelAnimationFrame(reveal);
        globe.destroy();
        window.removeEventListener("resize", onResize);
      };
    }, [config]);

    const updateMovement = (clientX: number) => {
      if (pointerInteracting.current !== null) {
        pointerMovement.current = clientX - pointerInteracting.current;
      }
    };

    return (
      <div
        ref={wrapRef}
        data-slot="globe"
        className={`relative aspect-square w-full max-w-[600px] ${className ?? ""}`}
        style={style}
        {...props}
      >
        <canvas
          ref={canvasRef}
          className="size-full opacity-0 [contain:layout_paint_size] [transition:opacity_1s_ease]"
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX - pointerMovement.current;
            e.currentTarget.style.cursor = "grabbing";
          }}
          onPointerUp={(e) => {
            pointerInteracting.current = null;
            e.currentTarget.style.cursor = "grab";
          }}
          onPointerOut={(e) => {
            pointerInteracting.current = null;
            e.currentTarget.style.cursor = "grab";
          }}
          onPointerMove={(e) => updateMovement(e.clientX)}
          style={{ cursor: "grab" }}
        />
      </div>
    );
  },
);
Globe.displayName = "Globe";

export { Globe };
