"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type Step = {
  label: React.ReactNode;
  description?: React.ReactNode;
};

export type StepperProps = React.HTMLAttributes<HTMLDivElement> & {
  steps: Step[];
  /** Zero-based index of the current step. Earlier steps render complete. */
  active: number;
  orientation?: "horizontal" | "vertical";
};

type StepState = "complete" | "active" | "upcoming";

function StepCircle({
  state,
  index,
  reduceMotion,
}: {
  state: StepState;
  index: number;
  reduceMotion: boolean | null;
}) {
  const base =
    "grid size-9 shrink-0 place-items-center rounded-full border-2 text-sm font-medium [transition:background-color_250ms_ease,border-color_250ms_ease,color_250ms_ease,box-shadow_250ms_ease]";
  const tone =
    state === "complete"
      ? "border-primary bg-primary text-primary-foreground"
      : state === "active"
        ? "border-primary bg-background text-foreground ring-4 ring-primary/15"
        : "border-border bg-background text-muted-foreground";
  return (
    <div className={`${base} ${tone}`}>
      {state === "complete" ? (
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </motion.svg>
      ) : (
        index + 1
      )}
    </div>
  );
}

function Connector({
  filled,
  orientation,
  reduceMotion,
}: {
  filled: boolean;
  orientation: "horizontal" | "vertical";
  reduceMotion: boolean | null;
}) {
  const horizontal = orientation === "horizontal";
  return (
    <div
      className={`relative overflow-hidden bg-border ${
        horizontal ? "mt-[17px] h-0.5 flex-1" : "my-1 w-0.5 flex-1 self-center"
      }`}
      style={horizontal ? undefined : { minHeight: 24 }}
    >
      <motion.span
        className={`absolute inset-0 bg-primary ${
          horizontal ? "origin-left" : "origin-top"
        }`}
        initial={false}
        animate={
          horizontal ? { scaleX: filled ? 1 : 0 } : { scaleY: filled ? 1 : 0 }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 320, damping: 32, mass: 0.9 }
        }
      />
    </div>
  );
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, active, orientation = "horizontal", className, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    const horizontal = orientation === "horizontal";

    const stateFor = (i: number): StepState =>
      i < active ? "complete" : i === active ? "active" : "upcoming";

    const Label = ({ step, state }: { step: Step; state: StepState }) => (
      <>
        <div
          className={`text-sm font-medium ${
            state === "upcoming" ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {step.label}
        </div>
        {step.description && (
          <div className="mt-0.5 text-xs text-muted-foreground">
            {step.description}
          </div>
        )}
      </>
    );

    if (horizontal) {
      return (
        <div
          ref={ref}
          className={`flex w-full items-start ${className ?? ""}`}
          {...props}
        >
          {steps.map((step, i) => {
            const state = stateFor(i);
            const isLast = i === steps.length - 1;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed ordered steps
              <React.Fragment key={i}>
                <div
                  className="flex w-24 shrink-0 flex-col items-center text-center"
                  aria-current={state === "active" ? "step" : undefined}
                >
                  <StepCircle
                    state={state}
                    index={i}
                    reduceMotion={reduceMotion}
                  />
                  <div className="mt-2">
                    <Label step={step} state={state} />
                  </div>
                </div>
                {!isLast && (
                  <Connector
                    filled={active > i}
                    orientation="horizontal"
                    reduceMotion={reduceMotion}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      );
    }

    return (
      <div ref={ref} className={`flex flex-col ${className ?? ""}`} {...props}>
        {steps.map((step, i) => {
          const state = stateFor(i);
          const isLast = i === steps.length - 1;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed ordered steps
              key={i}
              className="flex gap-4"
              aria-current={state === "active" ? "step" : undefined}
            >
              <div className="flex flex-col items-center">
                <StepCircle
                  state={state}
                  index={i}
                  reduceMotion={reduceMotion}
                />
                {!isLast && (
                  <Connector
                    filled={active > i}
                    orientation="vertical"
                    reduceMotion={reduceMotion}
                  />
                )}
              </div>
              <div className="pb-6 pt-1">
                <Label step={step} state={state} />
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
Stepper.displayName = "Stepper";

export { Stepper };
