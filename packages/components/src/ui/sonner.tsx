"use client";

// GodUI Sonner — mirrors shadcn/ui new-york-v4 components/ui/sonner.tsx (registry snapshot 2026-10-01).
// Motion: sonner's own transform/opacity transitions on a spring; its height
// and box-shadow/background transitions are overridden, so toast heights snap
// and buttons only fade. User toastOptions are merged, not replaced. GPU-only.

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { cn } from "@/lib/utils";

// Sonner transitions `transform, opacity, height, box-shadow` on every toast
// and injects its CSS unlayered, which beats anything in Tailwind's
// @layer utilities whatever the specificity — so the overrides are !important.
// Only transition-property and the easing are forced; sonner's swipe rule
// still zeroes the duration, so dragging stays 1:1. Heights snap.
const GODUI_TOAST =
  "[transition-property:transform,opacity]! ease-spring-snappy!";
// Buttons transition box-shadow / background; keep only opacity.
const GODUI_BUTTON = "[transition-property:opacity]!";

const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          toast: cn(GODUI_TOAST, toastOptions?.classNames?.toast),
          actionButton: cn(
            GODUI_BUTTON,
            toastOptions?.classNames?.actionButton,
          ),
          cancelButton: cn(
            GODUI_BUTTON,
            toastOptions?.classNames?.cancelButton,
          ),
          closeButton: cn(GODUI_BUTTON, toastOptions?.classNames?.closeButton),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
