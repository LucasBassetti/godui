"use client";

import * as React from "react";

export type ImageAccordionPanel = {
  /** Background image URL. */
  image: string;
  /** Panel title, shown in full when the panel is active. */
  title: string;
  /** Optional supporting line, revealed when the panel is active. */
  description?: string;
  /** Optional link — turns the panel into an anchor. */
  href?: string;
};

export type ImageAccordionProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  /** Panels, left to right. Provide 3–6 for the best effect. */
  panels: ImageAccordionPanel[];
  /** Index of the panel open by default. */
  defaultIndex?: number;
  /** How much wider the active panel grows relative to the others. */
  activeGrow?: number;
  /** Height of the accordion (any CSS length). */
  height?: string;
};

const ImageAccordion = React.forwardRef<HTMLDivElement, ImageAccordionProps>(
  (
    {
      panels,
      defaultIndex = 0,
      activeGrow = 5,
      height = "26rem",
      className,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );
    const [active, setActive] = React.useState(defaultIndex);

    return (
      <div
        ref={ref}
        data-slot="image-accordion"
        className={`flex flex-col gap-2 overflow-hidden sm:flex-row ${className ?? ""}`}
        style={{ height, ...style }}
        onPointerLeave={() => setActive(defaultIndex)}
        {...props}
      >
        {panels.map((panel, i) => {
          const isActive = i === active;
          const Tag = panel.href ? "a" : "button";
          return (
            <Tag
              // biome-ignore lint/suspicious/noArrayIndexKey: panels are a fixed ordered set
              key={i}
              {...(panel.href
                ? { href: panel.href }
                : { type: "button" as const })}
              data-active={isActive}
              aria-expanded={isActive}
              onPointerEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group relative block min-h-[3rem] min-w-0 overflow-hidden rounded-2xl text-left [transition:flex-grow_550ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none sm:min-h-0 sm:min-w-[2rem]"
              style={{ flexGrow: isActive ? activeGrow : 1, flexBasis: 0 }}
            >
              {/* Image — desaturated when idle, full color + zoomed when active */}
              <img
                src={panel.image}
                alt=""
                aria-hidden
                className="absolute inset-0 size-full scale-105 object-cover brightness-90 saturate-[0.6] [transition:transform_700ms_ease,filter_550ms_ease] group-data-[active=true]:scale-100 group-data-[active=true]:brightness-100 group-data-[active=true]:saturate-100 motion-reduce:transition-none"
              />
              {/* Legibility scrim */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
              />

              {/* Collapsed label — a vertical tab on idle panels */}
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-medium whitespace-nowrap text-white opacity-80 [writing-mode:vertical-rl] rotate-180 [transition:opacity_300ms_ease] group-data-[active=true]:opacity-0 max-sm:top-1/2 max-sm:bottom-auto max-sm:left-5 max-sm:-translate-y-1/2 max-sm:translate-x-0 max-sm:rotate-0 max-sm:[writing-mode:horizontal-tb]">
                {panel.title}
              </span>

              {/* Expanded caption — slides up and fades in only when active */}
              <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 [transition:opacity_400ms_ease,transform_500ms_ease] [transform:translateY(12px)] group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100 motion-reduce:transition-none">
                <span
                  aria-hidden
                  className="block h-px w-10 origin-left scale-x-0 bg-white/70 [transition:transform_500ms_ease_120ms] group-data-[active=true]:scale-x-100"
                />
                <h3 className="mt-3 text-xl font-semibold whitespace-nowrap text-white">
                  {panel.title}
                </h3>
                {panel.description ? (
                  <p className="mt-1 max-w-xs text-sm text-white/75">
                    {panel.description}
                  </p>
                ) : null}
              </div>
            </Tag>
          );
        })}
      </div>
    );
  },
);
ImageAccordion.displayName = "ImageAccordion";

export { ImageAccordion };
