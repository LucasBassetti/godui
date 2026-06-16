import type { Variants } from "framer-motion";

export type TextAnimateBy = "text" | "word" | "character" | "line";

export type TextAnimatePreset =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "blurInDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown";

export const STAGGER_BY_SPLIT: Record<TextAnimateBy, number> = {
  text: 0.06,
  word: 0.05,
  character: 0.03,
  line: 0.06,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

export const TEXT_ANIMATE_PRESETS: Record<
  TextAnimatePreset,
  { container: Variants; item: Variants }
> = {
  fadeIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 },
      },
      exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 },
      },
    },
  },
  blurIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.3 },
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        transition: { duration: 0.3 },
      },
    },
  },
  blurInUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
    },
  },
  blurInDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        y: -20,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
    },
  },
  slideUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: 20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      },
      exit: {
        y: -20,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  slideDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: -20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      },
      exit: {
        y: 20,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  slideLeft: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      },
      exit: {
        x: -20,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  slideRight: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: -20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      },
      exit: {
        x: 20,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  scaleUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 0.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: {
            type: "spring",
            damping: 15,
            stiffness: 300,
          },
        },
      },
      exit: {
        scale: 0.5,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  scaleDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 1.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: {
            type: "spring",
            damping: 15,
            stiffness: 300,
          },
        },
      },
      exit: {
        scale: 1.5,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
};

export type TextAnimateSegment = {
  key: string;
  segment: string;
};

export function splitTextAnimate(
  text: string,
  by: TextAnimateBy,
): TextAnimateSegment[] {
  const normalized = typeof text === "string" ? text : String(text ?? "");
  let raw: string[];

  switch (by) {
    case "word":
      raw = normalized.split(/(\s+)/);
      break;
    case "character":
      raw = [...normalized];
      break;
    case "line":
      raw = normalized.split("\n");
      break;
    case "text":
    default:
      raw = [normalized];
      break;
  }

  let offset = 0;
  return raw.map((segment) => {
    const item = {
      key: `${by}-${offset}-${segment}`,
      segment,
    };
    offset += Math.max(segment.length, 1);
    return item;
  });
}

export function resolveTextAnimateVariants(options: {
  animation: TextAnimatePreset;
  delay: number;
  staggerChildren: number;
  customVariants?: Variants;
}): { container: Variants; item: Variants } {
  const { animation, delay, staggerChildren, customVariants } = options;

  if (customVariants) {
    return {
      container: {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            opacity: { duration: 0.01, delay },
            delayChildren: delay,
            staggerChildren,
          },
        },
        exit: {
          opacity: 0,
          transition: {
            staggerChildren,
            staggerDirection: -1,
          },
        },
      },
      item: customVariants,
    };
  }

  const preset = TEXT_ANIMATE_PRESETS[animation];

  return {
    container: {
      ...preset.container,
      show: {
        ...preset.container.show,
        transition: {
          delayChildren: delay,
          staggerChildren,
        },
      },
      exit: {
        ...preset.container.exit,
        transition: {
          staggerChildren,
          staggerDirection: -1,
        },
      },
    },
    item: preset.item,
  };
}

export function getSegmentClassName(
  by: TextAnimateBy,
  segmentClassName?: string,
): string {
  const base =
    by === "line"
      ? "block"
      : by === "character"
        ? "inline-block"
        : "inline-block whitespace-pre";

  return segmentClassName ? `${base} ${segmentClassName}` : base;
}
