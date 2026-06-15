import * as React from "react";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "lead"
  | "large"
  | "small"
  | "muted"
  | "code";

export type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  variant?: TypographyVariant;
};

const variantConfig: Record<
  TypographyVariant,
  { tag: keyof React.JSX.IntrinsicElements; className: string }
> = {
  h1: {
    tag: "h1",
    className:
      "font-sans scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl",
  },
  h2: {
    tag: "h2",
    className:
      "font-sans scroll-m-20 text-3xl font-semibold tracking-tight",
  },
  h3: {
    tag: "h3",
    className:
      "font-sans scroll-m-20 text-2xl font-semibold tracking-tight",
  },
  h4: {
    tag: "h4",
    className:
      "font-sans scroll-m-20 text-xl font-semibold tracking-tight",
  },
  p: {
    tag: "p",
    className: "font-sans leading-7 [&:not(:first-child)]:mt-6",
  },
  lead: {
    tag: "p",
    className: "font-sans text-xl text-muted-foreground",
  },
  large: { tag: "div", className: "font-sans text-lg font-semibold" },
  small: {
    tag: "small",
    className: "font-sans text-sm font-medium leading-none",
  },
  muted: {
    tag: "p",
    className: "font-sans text-sm text-muted-foreground",
  },
  code: {
    tag: "code",
    className:
      "font-mono relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-semibold",
  },
};

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "p", ...props }, ref) => {
    const { tag: Tag, className: variantClassName } = variantConfig[variant];

    return React.createElement(Tag, {
      ref,
      className: `${variantClassName} ${className ?? ""}`,
      ...props,
    });
  },
);
Typography.displayName = "Typography";

export { Typography };
