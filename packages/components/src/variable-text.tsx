"use client";

import {
  type AnimationPlaybackControls,
  animate,
  type Easing,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import * as React from "react";
import {
  type AxisRanges,
  type AxisValue,
  clamp,
  DEFAULT_SPRING,
  getTextContent,
  lerp,
  PRESET_DEFAULT_SPLIT,
  PRESET_DEFAULT_TRIGGER,
  resolveAxes,
  splitText,
  type VariableTextPreset,
  type VariableTextSplitBy,
  type VariableTextSpring,
  type VariableTextTrigger,
} from "./variable-text-utils";

export type {
  AxisValue,
  VariableTextPreset,
  VariableTextSplitBy,
  VariableTextSpring,
  VariableTextTrigger,
} from "./variable-text-utils";

export type VariableTextProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  weight?: AxisValue;
  width?: AxisValue;
  slant?: AxisValue;
  opticalSize?: AxisValue;
  preset?: VariableTextPreset;
  trigger?: VariableTextTrigger;
  splitBy?: VariableTextSplitBy;
  duration?: number;
  delay?: number;
  stagger?: number;
  loop?: boolean;
  spring?: VariableTextSpring;
  cursorRadius?: number;
  minWeight?: number;
  maxWeight?: number;
};

type SegmentMotionProps = {
  segment: string;
  index: number;
  axes: AxisRanges;
  active: boolean;
  reducedMotion: boolean;
  preset?: VariableTextPreset;
  trigger: VariableTextTrigger;
  duration: number;
  delay: number;
  stagger: number;
  loop: boolean;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  spotlight: ReturnType<typeof useMotionValue<number>>;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  getSegmentCenter: (index: number) => number;
  cursorRadius: number;
  minWeight: number;
  maxWeight: number;
  pointerInside: boolean;
};

const ELASTIC_RETURN_EASE = [0.34, 1.56, 0.64, 1] as const;

function getReturnAnimation(
  preset: VariableTextPreset | undefined,
  duration: number,
) {
  const usesElastic = preset === "elastic" || preset === "cursor";

  return {
    duration: usesElastic
      ? Math.max(duration * 0.5, 0.5)
      : Math.max(duration * 0.4, 0.35),
    ease: (usesElastic ? ELASTIC_RETURN_EASE : "easeOut") as Easing,
  };
}

function StaticSegment({
  segment,
  axes,
  className,
}: {
  segment: string;
  axes: AxisRanges;
  className?: string;
}) {
  return (
    <span
      className={`variable-text-segment ${className ?? ""}`}
      style={
        {
          "--vt-wght": axes.weight[0],
          "--vt-wdth": axes.width[0],
          "--vt-slnt": axes.slant[0],
          "--vt-opsz": axes.opticalSize[0],
        } as React.CSSProperties
      }
    >
      {segment}
    </span>
  );
}

function AnimatedSegment({
  segment,
  index,
  axes,
  active,
  reducedMotion,
  preset,
  trigger,
  duration,
  delay,
  stagger,
  loop,
  scrollProgress,
  spotlight,
  mouseX,
  getSegmentCenter,
  cursorRadius,
  minWeight,
  maxWeight,
  pointerInside,
}: SegmentMotionProps) {
  const weight = useMotionValue(axes.weight[0]);
  const width = useMotionValue(axes.width[0]);
  const slant = useMotionValue(axes.slant[0]);
  const opticalSize = useMotionValue(axes.opticalSize[0]);

  const scrollWeight = useTransform(scrollProgress, [0, 1], axes.weight);
  const scrollWidth = useTransform(scrollProgress, [0, 1], axes.width);
  const scrollSlant = useTransform(scrollProgress, [0, 1], axes.slant);
  const scrollOptical = useTransform(scrollProgress, [0, 1], axes.opticalSize);

  const focusWeight = useTransform(spotlight, (position) => {
    const distance = Math.abs(index - position);
    const influence = clamp(1 - distance / 2.5, 0, 1);
    return lerp(axes.weight[0], axes.weight[1], influence);
  });

  const cursorWeight = useTransform(mouseX, (x) => {
    const center = getSegmentCenter(index);
    const distance = Math.abs(x - center);
    const influence = clamp(1 - distance / cursorRadius, 0, 1);
    return lerp(minWeight, maxWeight, influence);
  });

  React.useEffect(() => {
    if (reducedMotion) {
      weight.set(axes.weight[0]);
      width.set(axes.width[0]);
      slant.set(axes.slant[0]);
      opticalSize.set(axes.opticalSize[0]);
      return;
    }

    if (!active) {
      const { duration: restDuration, ease: restEase } = getReturnAnimation(
        preset,
        duration,
      );

      const returnControls = [
        animate(weight, axes.weight[0], {
          duration: restDuration,
          ease: restEase,
        }),
        animate(width, axes.width[0], {
          duration: restDuration,
          ease: restEase,
        }),
        animate(slant, axes.slant[0], {
          duration: restDuration,
          ease: restEase,
        }),
        animate(opticalSize, axes.opticalSize[0], {
          duration: restDuration,
          ease: restEase,
        }),
      ];

      return () => {
        for (const control of returnControls) {
          control.stop();
        }
      };
    }

    let controls: AnimationPlaybackControls | undefined;

    const segmentDelay = delay + index * stagger;

    if (trigger === "scroll") {
      const unsubWeight = scrollWeight.on("change", (v) => weight.set(v));
      const unsubWidth = scrollWidth.on("change", (v) => width.set(v));
      const unsubSlant = scrollSlant.on("change", (v) => slant.set(v));
      const unsubOptical = scrollOptical.on("change", (v) =>
        opticalSize.set(v),
      );
      return () => {
        unsubWeight();
        unsubWidth();
        unsubSlant();
        unsubOptical();
      };
    }

    if (trigger === "cursor" || preset === "cursor") {
      if (!pointerInside) {
        const { duration: restDuration, ease: restEase } = getReturnAnimation(
          "cursor",
          duration,
        );
        const control = animate(weight, minWeight, {
          duration: restDuration,
          ease: restEase,
        });
        return () => control.stop();
      }

      const unsub = cursorWeight.on("change", (v) => weight.set(v));
      return unsub;
    }

    if (preset === "focus") {
      const unsub = focusWeight.on("change", (v) => weight.set(v));
      return unsub;
    }

    const repeat = loop ? Number.POSITIVE_INFINITY : 0;

    if (preset === "weight-wave") {
      controls = animate(
        weight,
        [axes.weight[0], axes.weight[1], axes.weight[0]],
        {
          duration,
          delay: segmentDelay,
          repeat,
          ease: "easeInOut",
        },
      );
      return () => controls?.stop();
    }

    if (preset === "elastic") {
      const elasticRepeat = trigger === "click" ? 0 : repeat;
      controls = animate(
        weight,
        [axes.weight[0], axes.weight[1], axes.weight[0]],
        {
          duration: Math.max(duration * 0.6, 0.8),
          delay: segmentDelay,
          repeat: elasticRepeat,
          ease: [0.34, 1.56, 0.64, 1],
        },
      );
      return () => controls?.stop();
    }

    if (preset === "accordion") {
      controls = animate(width, [axes.width[0], axes.width[1], axes.width[0]], {
        duration,
        delay: segmentDelay,
        repeat,
        ease: "easeInOut",
      });
      return () => controls?.stop();
    }

    if (preset === "italic-sway") {
      controls = animate(slant, [axes.slant[0], axes.slant[1], axes.slant[0]], {
        duration,
        delay: segmentDelay,
        repeat,
        ease: "easeInOut",
      });
      return () => controls?.stop();
    }

    if (preset === "breathing") {
      controls = animate(
        weight,
        [axes.weight[0], axes.weight[1], axes.weight[0]],
        { duration, delay: segmentDelay, repeat, ease: "easeInOut" },
      );
      const widthControls = animate(
        width,
        [axes.width[0], axes.width[1], axes.width[0]],
        { duration, delay: segmentDelay, repeat, ease: "easeInOut" },
      );
      return () => {
        controls?.stop();
        widthControls.stop();
      };
    }

    controls = animate(
      weight,
      [axes.weight[0], axes.weight[1], axes.weight[0]],
      {
        duration,
        delay: segmentDelay,
        repeat,
        ease: "easeInOut",
      },
    );

    return () => controls?.stop();
  }, [
    active,
    axes,
    cursorWeight,
    delay,
    duration,
    focusWeight,
    index,
    loop,
    minWeight,
    pointerInside,
    preset,
    reducedMotion,
    scrollOptical,
    scrollSlant,
    scrollWeight,
    scrollWidth,
    slant,
    stagger,
    trigger,
    weight,
    width,
    opticalSize,
  ]);

  if (reducedMotion) {
    return <StaticSegment segment={segment} axes={axes} />;
  }

  return (
    <motion.span
      className="variable-text-segment"
      style={
        {
          "--vt-wght": weight,
          "--vt-wdth": width,
          "--vt-slnt": slant,
          "--vt-opsz": opticalSize,
        } as React.CSSProperties
      }
      aria-hidden={segment.trim() === "" ? true : undefined}
    >
      {segment}
    </motion.span>
  );
}

const VariableText = React.forwardRef<HTMLElement, VariableTextProps>(
  (
    {
      children,
      className,
      weight,
      width,
      slant,
      opticalSize,
      preset = "breathing",
      trigger: triggerProp,
      splitBy: splitByProp,
      duration = 2,
      delay = 0,
      stagger = 0.03,
      loop = true,
      spring = DEFAULT_SPRING,
      cursorRadius = 120,
      minWeight,
      maxWeight,
      ...props
    },
    ref,
  ) => {
    const reducedMotion = useReducedMotion() ?? false;
    const containerRef = React.useRef<HTMLElement>(null);
    const mergedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const trigger =
      triggerProp ??
      PRESET_DEFAULT_TRIGGER[preset] ??
      ("auto" as VariableTextTrigger);
    const splitBy =
      splitByProp ??
      PRESET_DEFAULT_SPLIT[preset] ??
      ("character" as VariableTextSplitBy);

    const axes = React.useMemo(
      () =>
        resolveAxes(preset, {
          weight,
          width,
          slant,
          opticalSize,
        }),
      [preset, weight, width, slant, opticalSize],
    );

    const textContent = getTextContent(children);
    const segments = React.useMemo(() => {
      if (!textContent) {
        return null;
      }

      let offset = 0;
      return splitText(textContent, splitBy).map((segment) => {
        const item = {
          key: `${offset}-${segment}`,
          segment,
        };
        offset += Math.max(segment.length, 1);
        return item;
      });
    }, [textContent, splitBy]);

    const [hovering, setHovering] = React.useState(false);
    const [pointerInside, setPointerInside] = React.useState(false);
    const [clicked, setClicked] = React.useState(false);
    const [animationSeed, setAnimationSeed] = React.useState(0);
    const isInView = useInView(containerRef, { once: false, amount: 0.6 });

    const active = React.useMemo(() => {
      if (reducedMotion) {
        return false;
      }
      if (trigger === "hover") {
        return hovering;
      }
      if (trigger === "click") {
        return clicked;
      }
      if (trigger === "inView") {
        return isInView;
      }
      return true;
    }, [clicked, hovering, isInView, reducedMotion, trigger]);

    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start end", "end start"],
    });

    const spotlight = useMotionValue(0);
    const mouseX = useMotionValue(0);
    const segmentCentersRef = React.useRef<number[]>([]);

    const getSegmentCenter = React.useCallback(
      (index: number) => segmentCentersRef.current[index] ?? 0,
      [],
    );

    const resolvedMinWeight = minWeight ?? axes.weight[0];
    const resolvedMaxWeight = maxWeight ?? axes.weight[1];

    React.useEffect(() => {
      if (reducedMotion || !active || preset !== "focus") {
        return;
      }

      const controls = animate(
        spotlight,
        [0, Math.max(segments?.length ?? 1, 1) - 1],
        {
          duration,
          delay,
          repeat: loop ? Number.POSITIVE_INFINITY : 0,
          repeatType: "mirror",
          ease: "easeInOut",
        },
      );

      return () => controls.stop();
    }, [
      active,
      delay,
      duration,
      loop,
      preset,
      reducedMotion,
      segments?.length,
      spotlight,
    ]);

    const updateSegmentCenters = React.useCallback(() => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const spans = container.querySelectorAll(".variable-text-segment");
      segmentCentersRef.current = Array.from(spans).map((span) => {
        const rect = span.getBoundingClientRect();
        return rect.left + rect.width / 2;
      });
    }, []);

    React.useLayoutEffect(() => {
      updateSegmentCenters();
      if (typeof window === "undefined") {
        return;
      }
      window.addEventListener("resize", updateSegmentCenters);
      return () => window.removeEventListener("resize", updateSegmentCenters);
    }, [updateSegmentCenters]);

    const handleMouseMove = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        if (trigger !== "cursor" && preset !== "cursor") {
          return;
        }
        mouseX.set(event.clientX);
        updateSegmentCenters();
      },
      [mouseX, preset, trigger, updateSegmentCenters],
    );

    const handleMouseLeave = React.useCallback(() => {
      if (trigger === "hover") {
        setHovering(false);
      }
      if (trigger === "cursor" || preset === "cursor") {
        setPointerInside(false);
      }
    }, [preset, trigger]);

    const handleClick = React.useCallback(() => {
      setClicked((value) => {
        const next = !value;
        if (next) {
          setAnimationSeed((seed) => seed + 1);
        }
        return next;
      });
    }, []);

    if (!segments) {
      if (reducedMotion) {
        return (
          <span
            ref={mergedRef}
            className={`variable-text ${className ?? ""}`}
            style={
              {
                "--vt-wght": axes.weight[0],
                "--vt-wdth": axes.width[0],
                "--vt-slnt": axes.slant[0],
                "--vt-opsz": axes.opticalSize[0],
              } as React.CSSProperties
            }
            {...props}
          >
            {children}
          </span>
        );
      }

      return (
        <span
          ref={mergedRef}
          className={`variable-text ${className ?? ""}`}
          {...props}
        >
          {children}
        </span>
      );
    }

    const renderedSegments = segments.map(({ key, segment }, index) =>
      reducedMotion ? (
        <StaticSegment key={key} segment={segment} axes={axes} />
      ) : (
        <AnimatedSegment
          key={trigger === "click" ? `${key}-${animationSeed}` : key}
          segment={segment}
          index={index}
          axes={axes}
          active={active}
          reducedMotion={reducedMotion}
          preset={preset}
          trigger={trigger}
          duration={duration}
          delay={delay}
          stagger={stagger}
          loop={loop}
          scrollProgress={scrollYProgress}
          spotlight={spotlight}
          mouseX={mouseX}
          getSegmentCenter={getSegmentCenter}
          cursorRadius={cursorRadius}
          minWeight={resolvedMinWeight}
          maxWeight={resolvedMaxWeight}
          pointerInside={pointerInside}
        />
      ),
    );

    const needsPointerTracking =
      trigger === "cursor" || trigger === "hover" || preset === "cursor";

    const interactionProps = needsPointerTracking
      ? {
          onMouseEnter: () => {
            if (trigger === "hover") {
              setHovering(true);
            }
            if (trigger === "cursor" || preset === "cursor") {
              setPointerInside(true);
            }
          },
          onMouseLeave: handleMouseLeave,
          onMouseMove: handleMouseMove,
        }
      : undefined;

    if (trigger === "click") {
      return (
        <button
          ref={mergedRef}
          type="button"
          className={`variable-text ${className ?? ""}`}
          aria-label={String(textContent)}
          onClick={handleClick}
          {...interactionProps}
          {...props}
        >
          {renderedSegments}
        </button>
      );
    }

    return (
      <span
        ref={mergedRef}
        className={`variable-text ${className ?? ""}`}
        {...interactionProps}
        {...props}
      >
        {renderedSegments}
      </span>
    );
  },
);
VariableText.displayName = "VariableText";

export { VariableText };
