"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type ShowcaseDevice = "iphone" | "android";
export type ShowcaseMode = "scroll" | "loop" | "carousel" | "cluster";
export type ShowcaseFrameColor = "black" | "silver" | "gold";

export type AppShowcaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  /** Device frame to render. */
  device?: ShowcaseDevice;
  /** Interaction mode — the "wow" behavior of the screen. */
  mode?: ShowcaseMode;
  /** Single-screen source (`scroll` / `loop` modes). A tall screenshot pans best. */
  src?: string;
  /** Single-screen video source (`scroll` / `loop`). Rendered over the screen. */
  videoSrc?: string;
  /** Multiple screens for `carousel` / `cluster` modes. */
  screens?: string[];
  /** Bezel finish. */
  frameColor?: ShowcaseFrameColor;
  /** Autoplay the carousel / start the loop (ignored under reduced motion). */
  autoplay?: boolean;
  /** Carousel autoplay interval / loop pass, in seconds. */
  interval?: number;
  /** Frame width in px. Height derives from the device aspect ratio. */
  width?: number;
  /** Accessible label for the screen media. */
  alt?: string;
};

// SPRING.smooth — surfaces / shared-layout feel (matches the rest of GodUI).
const SPRING = { stiffness: 320, damping: 32, mass: 0.9 } as const;

// Device geometry as ratios of the frame width, so the phone looks identical at
// any `width` (fixed rem radii/notch would distort at small sizes).
const DEVICE: Record<
  ShowcaseDevice,
  { aspect: string; shellR: number; padR: number; screenR: number }
> = {
  iphone: {
    aspect: "aspect-[433/882]",
    shellR: 0.17,
    padR: 0.035,
    screenR: 0.13,
  },
  android: {
    aspect: "aspect-[9/19.5]",
    shellR: 0.11,
    padR: 0.028,
    screenR: 0.085,
  },
};

const FRAME_SHELL: Record<ShowcaseFrameColor, string> = {
  black: "bg-neutral-900 ring-1 ring-neutral-700/60",
  silver: "bg-neutral-300 ring-1 ring-neutral-100",
  gold: "bg-[#e6cfa6] ring-1 ring-[#f3e6cf]",
};

/** Renders an image or a video that fills the screen area. */
function ScreenMedia({
  src,
  videoSrc,
  alt,
  className,
}: {
  src?: string;
  videoSrc?: string;
  alt?: string;
  className?: string;
}) {
  if (videoSrc) {
    return (
      // Plain DOM <video> (no SVG foreignObject) sidesteps the Safari/iOS mask bug.
      <video
        className={`size-full object-cover ${className ?? ""}`}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  if (src) {
    return (
      <img
        className={`size-full object-cover ${className ?? ""}`}
        src={src}
        alt={alt ?? ""}
        draggable={false}
      />
    );
  }
  return <div className={`size-full bg-muted ${className ?? ""}`} />;
}

/** Static device shell with the notch / hole-punch and side buttons. */
const PhoneFrame = React.forwardRef<
  HTMLDivElement,
  {
    device: ShowcaseDevice;
    frameColor: ShowcaseFrameColor;
    width?: number;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
  }
>(({ device, frameColor, width, className, style, children }, ref) => {
  const geo = DEVICE[device];
  const w = width ?? 300;
  // All radii / padding / notch derive from the width → identical at every size.
  const pad = w * geo.padR;
  const shellRadius = w * geo.shellR;
  const screenRadius = w * geo.screenR;
  const notchW = w * 0.3;
  const notchH = w * 0.085;
  const notchTop = w * 0.025;
  const holeSize = w * 0.03;
  return (
    <div
      ref={ref}
      className={`relative ${geo.aspect} ${FRAME_SHELL[frameColor]} shadow-2xl ${className ?? ""}`}
      style={{
        width: `${w}px`,
        padding: `${pad}px`,
        borderRadius: `${shellRadius}px`,
        ...style,
      }}
    >
      {/* Side buttons */}
      <span
        aria-hidden
        className="absolute -left-[2px] top-[22%] h-[7%] w-[3px] rounded-l bg-neutral-700"
      />
      <span
        aria-hidden
        className="absolute -left-[2px] top-[33%] h-[10%] w-[3px] rounded-l bg-neutral-700"
      />
      <span
        aria-hidden
        className="absolute -right-[2px] top-[26%] h-[12%] w-[3px] rounded-r bg-neutral-700"
      />
      {/* Screen */}
      <div
        className="relative size-full overflow-hidden bg-black"
        style={{ borderRadius: `${screenRadius}px` }}
      >
        {children}
        {/* Notch / camera */}
        {device === "iphone" ? (
          <span
            aria-hidden
            className="absolute left-1/2 z-raised -translate-x-1/2 rounded-full bg-black"
            style={{
              top: `${notchTop}px`,
              width: `${notchW}px`,
              height: `${notchH}px`,
            }}
          />
        ) : (
          <span
            aria-hidden
            className="absolute left-1/2 z-raised -translate-x-1/2 rounded-full bg-black ring-2 ring-neutral-800"
            style={{
              top: `${notchTop}px`,
              width: `${holeSize}px`,
              height: `${holeSize}px`,
            }}
          />
        )}
      </div>
    </div>
  );
});
PhoneFrame.displayName = "PhoneFrame";

/** `scroll` mode: phone floats in on view and the screen pans with page scroll. */
function ScrollShowcase({
  device,
  frameColor,
  width,
  src,
  videoSrc,
  alt,
  reduce,
}: {
  device: ShowcaseDevice;
  frameColor: ShowcaseFrameColor;
  width?: number;
  src?: string;
  videoSrc?: string;
  alt?: string;
  reduce: boolean;
}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Pan the tall screenshot as the phone travels through the viewport.
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]),
    SPRING,
  );

  if (reduce) {
    return (
      <div ref={sectionRef}>
        <PhoneFrame device={device} frameColor={frameColor} width={width}>
          <ScreenMedia src={src} videoSrc={videoSrc} alt={alt} />
        </PhoneFrame>
      </div>
    );
  }

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 48, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", ...SPRING }}
      className="[transform-style:preserve-3d] [perspective:1200px]"
    >
      <PhoneFrame device={device} frameColor={frameColor} width={width}>
        {videoSrc ? (
          <ScreenMedia videoSrc={videoSrc} alt={alt} />
        ) : (
          // Tall image (200% high) panned by scroll.
          <motion.img
            src={src}
            alt={alt ?? ""}
            draggable={false}
            style={{ y }}
            className="absolute inset-x-0 top-0 h-[200%] w-full object-cover"
          />
        )}
      </PhoneFrame>
    </motion.div>
  );
}

/** `loop` mode: the screen auto-scrolls on a gentle infinite loop while in view. */
function LoopShowcase({
  device,
  frameColor,
  width,
  src,
  videoSrc,
  alt,
  autoplay,
  interval,
  reduce,
}: {
  device: ShowcaseDevice;
  frameColor: ShowcaseFrameColor;
  width?: number;
  src?: string;
  videoSrc?: string;
  alt?: string;
  autoplay: boolean;
  interval: number;
  reduce: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = autoplay && inView && !reduce && !videoSrc;

  return (
    <PhoneFrame ref={ref} device={device} frameColor={frameColor} width={width}>
      {videoSrc ? (
        <ScreenMedia videoSrc={videoSrc} alt={alt} />
      ) : (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`flex flex-col ${running ? "animate-app-showcase-scroll" : ""} motion-reduce:animate-none`}
            style={{
              willChange: "transform",
              ["--as-loop" as string]: `${interval * 6}s`,
            }}
          >
            <img
              src={src}
              alt={alt ?? ""}
              draggable={false}
              className="w-full"
            />
            {/* Duplicate for a seamless wrap. */}
            <img
              src={src}
              alt=""
              aria-hidden
              draggable={false}
              className="w-full"
            />
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}

/** `carousel` mode: cross-fade through screens with dot controls. */
function CarouselShowcase({
  device,
  frameColor,
  width,
  screens,
  alt,
  autoplay,
  interval,
  reduce,
}: {
  device: ShowcaseDevice;
  frameColor: ShowcaseFrameColor;
  width?: number;
  screens: string[];
  alt?: string;
  autoplay: boolean;
  interval: number;
  reduce: boolean;
}) {
  const [index, setIndex] = React.useState(0);
  const count = screens.length;

  React.useEffect(() => {
    if (!autoplay || reduce || count < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      interval * 1000,
    );
    return () => window.clearInterval(id);
  }, [autoplay, reduce, count, interval]);

  return (
    <div className="flex flex-col items-center gap-4">
      <PhoneFrame device={device} frameColor={frameColor} width={width}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={index}
            src={screens[index]}
            alt={alt ?? `Screen ${index + 1}`}
            draggable={false}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{
              duration: reduce ? 0 : 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 size-full object-cover"
          />
        </AnimatePresence>
      </PhoneFrame>
      {count > 1 ? (
        <div className="flex items-center gap-2" role="tablist">
          {screens.map((s, i) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to screen ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full [transition:width_200ms_ease,background-color_200ms_ease] ${
                i === index
                  ? "w-6 bg-primary"
                  : "w-2 bg-[var(--muted-foreground)]/30 hover:bg-[var(--muted-foreground)]/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

type ClusterLayout = {
  depth: number;
  transform: string;
  z: number;
};

// Depth per phone: back phones move more (parallax), front least.
const CLUSTER_LAYOUT: ClusterLayout[] = [
  { depth: 26, transform: "translateX(-58%) rotate(-8deg) scale(0.82)", z: 0 },
  { depth: 0, transform: "translateX(0%) rotate(0deg) scale(1)", z: 2 },
  { depth: 26, transform: "translateX(58%) rotate(8deg) scale(0.82)", z: 0 },
];

/** One phone in the cluster — owns its parallax transforms (hooks live here). */
function ClusterPhone({
  layout,
  sx,
  sy,
  reduce,
  device,
  frameColor,
  width,
  src,
  alt,
}: {
  layout: ClusterLayout;
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
  reduce: boolean;
  device: ShowcaseDevice;
  frameColor: ShowcaseFrameColor;
  width?: number;
  src: string;
  alt?: string;
}) {
  const x = useTransform(sx, [-0.5, 0.5], [-layout.depth, layout.depth]);
  const y = useTransform(
    sy,
    [-0.5, 0.5],
    [-layout.depth / 2, layout.depth / 2],
  );
  return (
    // Outer div owns the static cluster placement; inner motion.div the parallax.
    <div
      className="absolute"
      style={{ transform: layout.transform, zIndex: layout.z }}
    >
      <motion.div style={reduce ? undefined : { x, y }}>
        <PhoneFrame device={device} frameColor={frameColor} width={width}>
          <ScreenMedia src={src} alt={alt} />
        </PhoneFrame>
      </motion.div>
    </div>
  );
}

/** `cluster` mode: 2–3 phones at depth with pointer parallax. */
function ClusterShowcase({
  device,
  frameColor,
  width,
  screens,
  alt,
  reduce,
}: {
  device: ShowcaseDevice;
  frameColor: ShowcaseFrameColor;
  width?: number;
  screens: string[];
  alt?: string;
  reduce: boolean;
}) {
  const phones = screens.slice(0, 3);
  const ref = React.useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative flex items-center justify-center [perspective:1400px]"
      style={{ minHeight: width ? `${width * 2.0}px` : "480px" }}
    >
      {phones.map((src, i) => (
        <ClusterPhone
          key={src}
          layout={CLUSTER_LAYOUT[i] ?? CLUSTER_LAYOUT[1]}
          sx={sx}
          sy={sy}
          reduce={reduce}
          device={device}
          frameColor={frameColor}
          width={width}
          src={src}
          alt={alt}
        />
      ))}
    </div>
  );
}

const AppShowcase = React.forwardRef<HTMLDivElement, AppShowcaseProps>(
  (
    {
      device = "iphone",
      mode = "scroll",
      src,
      videoSrc,
      screens,
      frameColor = "black",
      autoplay = true,
      interval = 4,
      width = 300,
      alt,
      className,
      ...props
    },
    ref,
  ) => {
    const reduce = useReducedMotion() ?? false;
    const list = screens ?? (src ? [src] : []);

    let body: React.ReactNode;
    if (mode === "loop") {
      body = (
        <LoopShowcase
          device={device}
          frameColor={frameColor}
          width={width}
          src={src ?? list[0]}
          videoSrc={videoSrc}
          alt={alt}
          autoplay={autoplay}
          interval={interval}
          reduce={reduce}
        />
      );
    } else if (mode === "carousel") {
      body = (
        <CarouselShowcase
          device={device}
          frameColor={frameColor}
          width={width}
          screens={list}
          alt={alt}
          autoplay={autoplay}
          interval={interval}
          reduce={reduce}
        />
      );
    } else if (mode === "cluster") {
      body = (
        <ClusterShowcase
          device={device}
          frameColor={frameColor}
          width={width}
          screens={list}
          alt={alt}
          reduce={reduce}
        />
      );
    } else {
      body = (
        <ScrollShowcase
          device={device}
          frameColor={frameColor}
          width={width}
          src={src ?? list[0]}
          videoSrc={videoSrc}
          alt={alt}
          reduce={reduce}
        />
      );
    }

    return (
      <div
        ref={ref}
        data-slot="app-showcase"
        data-device={device}
        data-mode={mode}
        className={`flex items-center justify-center ${className ?? ""}`}
        {...props}
      >
        {body}
      </div>
    );
  },
);
AppShowcase.displayName = "AppShowcase";

export { AppShowcase };
