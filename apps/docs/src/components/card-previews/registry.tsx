import { type ComponentType, lazy } from "react";

/**
 * Shared prop contract for a card preview. `play` is true only while the card is
 * hovered (the unified skeletons mostly animate via CSS `group-hover`, so few
 * need it).
 */
export type CardPreviewProps = { play?: boolean };

type LazyPreview = ComponentType<CardPreviewProps>;

/**
 * Every component-index card renders a uniform skeleton preview from
 * `./previews/<slug>.tsx`: muted gray blocks plus a single accent highlight on a
 * dotted background, one visual language across the whole index.
 */
const CURATED_SLUGS = [
  // Buttons
  "gooey-fab",
  "hold-confirm-button",
  "magic-button",
  "magnetic-button",
  "mask-button",
  "progress-fold-button",
  "shimmer-button",
  "slide-confirm-button",
  // Inputs
  "magic-input",
  "otp-input",
  // Navigation
  "breadcrumbs",
  "combobox",
  "context-menu",
  "dock",
  "dropdown-menu",
  "filter-bar",
  "magic-tab",
  "mega-menu",
  "resizable-header",
  "segmented-control",
  "tab-bar",
  // Overlays
  "animated-tooltip",
  "command-palette",
  "drawer",
  "dynamic-island",
  "floating-toolbar",
  "morphing-dialog",
  "toast",
  // Layout
  "accordion",
  "animated-testimonials",
  "app-showcase",
  "avatar-group",
  "bento-grid",
  "card-swap",
  "container-scroll",
  "cover-flow",
  "hero-parallax",
  "image-accordion",
  "image-compare",
  "inertia-gallery",
  "morph-gallery",
  "orbit-carousel",
  "progressive-card-reveal",
  "reorder-list",
  "scroll-stack",
  "stack-badge",
  "stepper",
  "sticky-scroll",
  "store-badge",
  "swipe-deck",
  "three-d-marquee",
  "tilt-card",
  "holographic-card",
  // Text
  "aurora-text",
  "elastic-text",
  "highlighter",
  "number-ticker",
  "text-animate",
  "text-scramble",
  "scroll-text-reveal",
  // AI
  "agent-timeline",
  "conversation-thread",
  "prompt-composer",
  "prompt-suggestions",
  "source-citations",
  "voice-orb",
  // Collaboration
  "comment-pin",
  "live-cursors",
  "presence-facepile",
  // Visualizations
  "animated-beam",
  "globe",
  "gravity",
  "orbiting-circles",
  "scroll-timeline",
  "world-map",
  // Effects
  "beam-draw",
  "border-beam",
  "confetti",
  "fluid-cursor",
  "image-trail",
  "lamp",
  "liquid-image",
  "marquee",
  "particle-dissolve",
  "scroll-progress",
  "scroll-reveal",
  "spotlight-card",
  "spotlight-reveal",
  // Backgrounds
  "blueprint-grid",
  "decorative-background",
  "effect-background",
  "flow-field",
  "geometric-background",
  "gradient-background",
  "light-rays",
  "liquid-metaballs",
  "pixel-grid",
  "topographic-drift",
  "warp-starfield",
  // Glass
  "liquid-glass-card",
  "liquid-glass-lens",
] as const;

export const cardPreviews: Record<string, LazyPreview> = Object.fromEntries(
  CURATED_SLUGS.map((slug) => [slug, lazy(() => import(`./previews/${slug}`))]),
);
