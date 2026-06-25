"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type AccordionItem = {
  value: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export type AccordionProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  items: AccordionItem[];
  /** `single` keeps one panel open; `multiple` allows many. */
  type?: "single" | "multiple";
  /** Open value(s) on mount. */
  defaultValue?: string | string[];
  /** Allow closing the open panel in `single` mode. */
  collapsible?: boolean;
};

const ChevronIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4 shrink-0 text-muted-foreground [transition:transform_250ms_ease] group-data-[open=true]:rotate-180"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      type = "single",
      defaultValue,
      collapsible = true,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const [open, setOpen] = React.useState<string[]>(() => {
      if (defaultValue === undefined) return [];
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    });

    const toggle = (value: string) => {
      setOpen((current) => {
        const isOpen = current.includes(value);
        if (type === "single") {
          if (isOpen) return collapsible ? [] : current;
          return [value];
        }
        return isOpen
          ? current.filter((v) => v !== value)
          : [...current, value];
      });
    };

    return (
      <div
        ref={ref}
        className={`w-full divide-y divide-border overflow-hidden rounded-xl border border-border ${
          className ?? ""
        }`}
        {...props}
      >
        {items.map((item) => {
          const isOpen = open.includes(item.value);
          const panelId = `accordion-panel-${item.value}`;
          const triggerId = `accordion-trigger-${item.value}`;
          return (
            <div key={item.value} className="group" data-open={isOpen}>
              <h3 className="flex">
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  disabled={item.disabled}
                  onClick={() => toggle(item.value)}
                  className="flex flex-1 items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground [transition:background_150ms_ease] hover:bg-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {item.title}
                  {ChevronIcon}
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    key="content"
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{
                      height: { type: "spring", stiffness: 500, damping: 40 },
                      opacity: { duration: 0.2 },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-0 text-sm text-muted-foreground">
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  },
);
Accordion.displayName = "Accordion";

export { Accordion };
