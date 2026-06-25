"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type Avatar = {
  src?: string;
  alt?: string;
  /** Fallback initials shown when no `src` (or it fails to load). */
  fallback?: string;
  href?: string;
};

export type AvatarGroupSize = "sm" | "md" | "lg";

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  avatars: Avatar[];
  /** Maximum avatars shown before collapsing into a `+N` chip. */
  max?: number;
  size?: AvatarGroupSize;
  /** Spread the stack apart on hover. */
  spreadOnHover?: boolean;
};

const sizeClasses: Record<AvatarGroupSize, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
};

const overlap: Record<AvatarGroupSize, number> = {
  sm: 10,
  md: 12,
  lg: 14,
};

function Initials({ avatar }: { avatar: Avatar }) {
  const [errored, setErrored] = React.useState(false);
  const label = avatar.fallback ?? avatar.alt?.slice(0, 2).toUpperCase() ?? "?";
  if (avatar.src && !errored) {
    return (
      <img
        src={avatar.src}
        alt={avatar.alt ?? ""}
        onError={() => setErrored(true)}
        className="size-full object-cover"
      />
    );
  }
  return (
    <span className="flex size-full items-center justify-center bg-muted font-medium text-muted-foreground">
      {label}
    </span>
  );
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      avatars,
      max = 4,
      size = "md",
      spreadOnHover = true,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const visible = avatars.slice(0, max);
    const overflow = avatars.length - visible.length;
    const margin = -overlap[size];

    return (
      <motion.div
        ref={ref}
        initial="rest"
        whileHover={spreadOnHover && !reduceMotion ? "spread" : undefined}
        animate="rest"
        className={`group flex items-center ${className ?? ""}`}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {visible.map((avatar, i) => {
          const ringClasses =
            "ring-2 ring-background rounded-full overflow-hidden bg-background shadow-sm";
          const inner = (
            // biome-ignore lint/correctness/useJsxKeyInIterable: keyed on the wrapper element returned below
            <motion.div
              variants={{
                rest: { marginLeft: i === 0 ? 0 : margin, y: 0 },
                spread: { marginLeft: i === 0 ? 0 : 4, y: -2 },
              }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              whileHover={reduceMotion ? undefined : { y: -6, scale: 1.06 }}
              style={{ zIndex: i }}
              className={`relative ${sizeClasses[size]} ${ringClasses}`}
            >
              <Initials avatar={avatar} />
            </motion.div>
          );
          return avatar.href ? (
            <a
              // biome-ignore lint/suspicious/noArrayIndexKey: stable avatar order
              key={i}
              href={avatar.href}
              aria-label={avatar.alt}
              className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
            >
              {inner}
            </a>
          ) : (
            // biome-ignore lint/suspicious/noArrayIndexKey: stable avatar order
            <React.Fragment key={i}>{inner}</React.Fragment>
          );
        })}

        {overflow > 0 && (
          <motion.div
            variants={{
              rest: { marginLeft: margin },
              spread: { marginLeft: 4 },
            }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{ zIndex: visible.length }}
            className={`relative flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground ring-2 ring-background ${sizeClasses[size]}`}
          >
            +{overflow}
          </motion.div>
        )}
      </motion.div>
    );
  },
);
AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
