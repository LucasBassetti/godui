import type { MotionGrade } from "@godui/components";

/**
 * Per-component animated-property audits for the Learn Motion Score panel.
 * Keyed by the same component name as MOTION_NOTES / motionScore().
 * Each row is a property the real component animates; optional `tier` overrides
 * propTier() when the cost class isn't modeled by a single CSS property
 * (SVG goo, canvas/WebGL loops, etc.) so the worst row matches the header grade.
 */

export interface MotionScoreProperty {
  /** Normalised name for propTier() (lowercase, no hyphens). */
  prop: string;
  /** How the property reads in the table. */
  label: string;
  /** One line on what that property drives. */
  note: string;
  /** Optional override when propTier(prop) understates the real cost. */
  tier?: MotionGrade;
}

export interface MotionScorePanelEntry {
  /** Display name in the panel header. */
  title: string;
  properties: MotionScoreProperty[];
}

export const MOTION_SCORE_PANELS: Record<string, MotionScorePanelEntry> = {
  accordion: {
    title: "Accordion",
    properties: [
      {
        prop: "height",
        label: "height",
        note: "collapse to height:auto — sanctioned reveal pattern",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "agent-flow": {
    title: "Agent Flow",
    properties: [
      {
        prop: "boxshadow",
        label: "box-shadow",
        note: "node status glow shares its transition with border/background paint — isolating it wins nothing",
      },
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
      {
        prop: "pathlength",
        label: "pathLength",
        note: "SVG pathLength reveal",
        tier: "S",
      },
    ],
  },
  "agent-timeline": {
    title: "Agent Timeline",
    properties: [
      {
        prop: "height",
        label: "height",
        note: "timeline row collapse to height:auto",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "animated-beam": {
    title: "Animated Beam",
    properties: [
      {
        prop: "x1",
        label: "x1",
        note: "SVG endpoint geometry for the length-driven beam",
      },
      {
        prop: "x2",
        label: "x2",
        note: "SVG endpoint geometry for the length-driven beam",
      },
      {
        prop: "y1",
        label: "y1",
        note: "SVG endpoint geometry for the length-driven beam",
      },
      {
        prop: "y2",
        label: "y2",
        note: "SVG endpoint geometry for the length-driven beam",
      },
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
    ],
  },
  "animated-testimonials": {
    title: "Animated Testimonials",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
    ],
  },
  "animated-tooltip": {
    title: "Animated Tooltip",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "app-showcase": {
    title: "App Showcase",
    properties: [
      {
        prop: "width",
        label: "width",
        note: "pagination pill 8→24px, single element, per click",
      },
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "aurora-text": {
    title: "Aurora Text",
    properties: [
      {
        prop: "backgroundposition",
        label: "background-position",
        note: "Gradient text continuous keyframe loop",
      },
    ],
  },
  "avatar-group": {
    title: "Avatar Group",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Compositor transform (translate / scale / rotate)",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "beam-draw": {
    title: "Beam Draw",
    properties: [
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
      {
        prop: "pathlength",
        label: "pathLength",
        note: "SVG pathLength reveal",
        tier: "S",
      },
    ],
  },
  "bento-grid": {
    title: "Bento Grid",
    properties: [
      {
        prop: "boxshadow",
        label: "box-shadow",
        note: "hover-lift shadow; card is overflow-hidden so the shadow can't move to a clipped child without a wrapper restructure",
      },
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "blueprint-grid": {
    title: "Blueprint Grid",
    properties: [
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
    ],
  },
  "border-beam": {
    title: "Border Beam",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  breadcrumbs: {
    title: "Breadcrumbs",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "card-swap": {
    title: "Card Swap",
    properties: [
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  combobox: {
    title: "Combobox",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "command-palette": {
    title: "Command Palette",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
    ],
  },
  "comment-pin": {
    title: "Comment Pin",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  confetti: {
    title: "Confetti",
    properties: [
      {
        prop: "transform",
        label: "canvas paint",
        note: "canvas-confetti burst (~2s)",
        tier: "C",
      },
    ],
  },
  "container-scroll": {
    title: "Container Scroll",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
    ],
  },
  "context-menu": {
    title: "Context Menu",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "conversation-thread": {
    title: "Conversation Thread",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "cover-flow": {
    title: "Cover Flow",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  dock: {
    title: "Dock",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  drawer: {
    title: "Drawer",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "dropdown-menu": {
    title: "Dropdown Menu",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "dynamic-island": {
    title: "Dynamic Island",
    properties: [
      {
        prop: "width",
        label: "width",
        note: "signature shared-layout container morph",
      },
      {
        prop: "height",
        label: "height",
        note: "signature shared-layout container morph",
      },
      {
        prop: "borderradius",
        label: "border-radius",
        note: "signature shared-layout container morph",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
    ],
  },
  "elastic-text": {
    title: "Elastic Text",
    properties: [
      {
        prop: "fontvariationsettings",
        label: "font-variation-settings",
        note: "Weight morph re-rasterizes text each frame",
        tier: "C",
      },
    ],
  },
  "encrypted-card": {
    title: "Encrypted Card",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "filter-bar": {
    title: "Filter Bar",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Plus / summary / clear / popover fade",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Plus exit, clear pop-in, popover spring",
      },
      {
        prop: "translate",
        label: "translateX",
        note: "Summary slides in beside the facet label",
      },
    ],
  },
  "floating-toolbar": {
    title: "Floating Toolbar",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "flow-field": {
    title: "Flow Field",
    properties: [
      {
        prop: "opacity",
        label: "canvas paint",
        note: "2D canvas particle trails each frame",
        tier: "C",
      },
    ],
  },
  "fluid-cursor": {
    title: "Fluid Cursor",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  globe: {
    title: "Globe",
    properties: [
      {
        prop: "transform",
        label: "WebGL frame",
        note: "cobe auto-rotation render loop",
        tier: "C",
      },
    ],
  },
  "gooey-fab": {
    title: "Gooey FAB",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Blob open / satellite orbit",
      },
      {
        prop: "filter",
        label: "SVG goo filter",
        note: "feGaussianBlur + feColorMatrix blend while opening",
        tier: "C",
      },
    ],
  },
  "gooey-stack": {
    title: "Gooey Stack",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Card stack merge / expand",
      },
      {
        prop: "filter",
        label: "SVG goo filter",
        note: "Goo merge + animated blur",
        tier: "C",
      },
    ],
  },
  gravity: {
    title: "Gravity",
    properties: [
      {
        prop: "transform",
        label: "physics frame",
        note: "matter-js simulation each frame",
        tier: "C",
      },
    ],
  },
  "hero-parallax": {
    title: "Hero Parallax",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  highlighter: {
    title: "Highlighter",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Compositor transform (translate / scale / rotate)",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "hold-confirm-button": {
    title: "Hold Confirm Button",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "pathlength",
        label: "pathLength",
        note: "SVG pathLength reveal",
        tier: "S",
      },
    ],
  },
  "holographic-card": {
    title: "Holographic Card",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Pointer tilt",
      },
      {
        prop: "backgroundposition",
        label: "background-position",
        note: "Holographic sheen gradient follow",
      },
    ],
  },
  "image-accordion": {
    title: "Image Accordion",
    properties: [
      {
        prop: "flexgrow",
        label: "flex-grow",
        note: "panels share one flex track; siblings must reflow — no compositor equivalent",
      },
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "image-compare": {
    title: "Image Compare",
    properties: [
      {
        prop: "clippath",
        label: "clip-path",
        note: "Before/after reveal geometry (120ms one-shot)",
        tier: "C",
      },
      {
        prop: "translate",
        label: "translate",
        note: "Handle position",
      },
    ],
  },
  "image-trail": {
    title: "Image Trail",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "inertia-gallery": {
    title: "Inertia Gallery",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
    ],
  },
  lamp: {
    title: "Lamp",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "light-rays": {
    title: "Light Rays",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Compositor transform (translate / scale / rotate)",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
    ],
  },
  "liquid-glass-card": {
    title: "Liquid Glass Card",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Compositor transform (translate / scale / rotate)",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "liquid-glass-lens": {
    title: "Liquid Glass Lens",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Compositor transform (translate / scale / rotate)",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "liquid-image": {
    title: "Liquid Image",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Pointer-driven ripple",
      },
      {
        prop: "filter",
        label: "SVG displacement",
        note: "Displacement map driven each frame",
        tier: "C",
      },
    ],
  },
  "liquid-metaballs": {
    title: "Liquid Metaballs",
    properties: [
      {
        prop: "transform",
        label: "SVG + goo",
        note: "Circle positions through goo filter each frame",
        tier: "C",
      },
    ],
  },
  "live-cursors": {
    title: "Live Cursors",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "magic-button": {
    title: "Magic Button",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Push physics — shadow + front face lift and dip",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Brightness shift on hover / focus-visible",
      },
      {
        prop: "backgroundposition",
        label: "background-position",
        note: "Rainbow gradient keyframe loop",
      },
    ],
  },
  "magic-input": {
    title: "Magic Input",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Lift of edge + shadow layers on focus",
      },
      {
        prop: "backgroundsize",
        label: "background-size",
        note: "Determinate progress-bar fill",
      },
      {
        prop: "backgroundposition",
        label: "background-position",
        note: "Focused rainbow edge keyframe loop",
      },
    ],
  },
  "magic-tab": {
    title: "Magic Tab",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Selected tab face / indicator motion",
      },
      {
        prop: "backgroundposition",
        label: "background-position",
        note: "Selected tab rainbow keyframe loop",
      },
    ],
  },
  "magnetic-button": {
    title: "Magnetic Button",
    properties: [
      {
        prop: "transform",
        label: "x / y",
        note: "Magnetic pull — spring-driven translate toward the pointer",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Press dip to 0.97 on active",
      },
    ],
  },
  marquee: {
    title: "Marquee",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Compositor transform (translate / scale / rotate)",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "mask-button": {
    title: "Mask Button",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "mega-menu": {
    title: "Mega Menu",
    properties: [
      {
        prop: "height",
        label: "height",
        note: "panel + mobile-accordion shared-layout morph",
      },
      {
        prop: "width",
        label: "width",
        note: "panel shared-layout morph",
      },
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "morph-gallery": {
    title: "Morph Gallery",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "morphing-dialog": {
    title: "Morphing Dialog",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "notification-inbox": {
    title: "Notification Inbox",
    properties: [
      {
        prop: "height",
        label: "height",
        note: "stack item collapse to height:auto",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "number-ticker": {
    title: "Number Ticker",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Compositor transform (translate / scale / rotate)",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "orbit-carousel": {
    title: "Orbit Carousel",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "orbiting-circles": {
    title: "Orbiting Circles",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
    ],
  },
  "otp-input": {
    title: "OTP Input",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Active cell lifts to 1.05",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Character fade-in on fill",
      },
      {
        prop: "translate",
        label: "translateY",
        note: "Character rise on fill + error shake on x",
      },
    ],
  },
  "particle-dissolve": {
    title: "Particle Dissolve",
    properties: [
      {
        prop: "opacity",
        label: "canvas paint",
        note: "2D canvas dissolve particles",
        tier: "C",
      },
    ],
  },
  "pixel-grid": {
    title: "Pixel Grid",
    properties: [
      {
        prop: "opacity",
        label: "canvas paint",
        note: "2D canvas cell flicker each frame",
        tier: "C",
      },
    ],
  },
  "presence-facepile": {
    title: "Presence Facepile",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "progress-fold-button": {
    title: "Progress Fold Button",
    properties: [
      {
        prop: "rotate",
        label: "rotateX",
        note: "Front-face hinge fold on hover / focus / loading",
      },
      {
        prop: "scale",
        label: "scaleX",
        note: "Determinate fill from the left (0→progress)",
      },
      {
        prop: "translate",
        label: "translateX",
        note: "Indeterminate 40% segment sweep loop",
      },
    ],
  },
  "progressive-card-reveal": {
    title: "Progressive Card Reveal",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "prompt-composer": {
    title: "Prompt Composer",
    properties: [
      {
        prop: "height",
        label: "height",
        note: "textarea auto-grow to height:auto",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "prompt-suggestions": {
    title: "Prompt Suggestions",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "reorder-list": {
    title: "Reorder List",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "resizable-header": {
    title: "Resizable Header",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "scroll-progress": {
    title: "Scroll Progress",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "strokedashoffset",
        label: "stroke-dashoffset",
        note: "SVG stroke-dashoffset draw",
        tier: "S",
      },
    ],
  },
  "scroll-reveal": {
    title: "Scroll Reveal",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
    ],
  },
  "scroll-stack": {
    title: "Scroll Stack",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
    ],
  },
  "scroll-text-reveal": {
    title: "Scroll Text Reveal",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
    ],
  },
  "scroll-timeline": {
    title: "Scroll Timeline",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "segmented-control": {
    title: "Segmented Control",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "shimmer-button": {
    title: "Shimmer Button",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Shimmer sweep via translated highlight",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Highlight fade",
      },
    ],
  },
  "slide-confirm-button": {
    title: "Slide Confirm Button",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "pathlength",
        label: "pathLength",
        note: "SVG pathLength reveal",
        tier: "S",
      },
    ],
  },
  "source-citations": {
    title: "Source Citations",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "spin-viewer": {
    title: "Spin Viewer",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "spotlight-card": {
    title: "Spotlight Card",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "spotlight-reveal": {
    title: "Spotlight Reveal",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Reveal fade",
      },
      {
        prop: "backgroundposition",
        label: "mask / gradient",
        note: "Radial spotlight via CSS variables as the pointer moves",
        tier: "C",
      },
    ],
  },
  "stack-badge": {
    title: "Stack Badge",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  stepper: {
    title: "Stepper",
    properties: [
      {
        prop: "boxshadow",
        label: "box-shadow",
        note: "step-state shadow shares its transition with background/border/color paint",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "pathlength",
        label: "pathLength",
        note: "SVG pathLength reveal",
        tier: "S",
      },
    ],
  },
  "sticky-scroll": {
    title: "Sticky Scroll",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "store-badge": {
    title: "Store Badge",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "swipe-deck": {
    title: "Swipe Deck",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "tab-bar": {
    title: "Tab Bar",
    properties: [
      {
        prop: "width",
        label: "width",
        note: "active-tab label reveal to width:auto",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  terminal: {
    title: "Terminal",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
    ],
  },
  "text-animate": {
    title: "Text Animate",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "filter",
        label: "filter",
        note: "Filter (blur / brightness)",
      },
    ],
  },
  "text-scramble": {
    title: "Text Scramble",
    properties: [
      {
        prop: "transform",
        label: "transform",
        note: "Compositor transform (translate / scale / rotate)",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "three-d-marquee": {
    title: "3D Marquee",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
    ],
  },
  "tilt-card": {
    title: "Tilt Card",
    properties: [
      {
        prop: "translate",
        label: "translate",
        note: "Position / lift via translate",
      },
      {
        prop: "rotate",
        label: "rotate",
        note: "Rotation",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  toast: {
    title: "Toast",
    properties: [
      {
        prop: "height",
        label: "height",
        note: "toast stack expand/collapse — height to measured px",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "topographic-drift": {
    title: "Topographic Drift",
    properties: [
      {
        prop: "opacity",
        label: "canvas paint",
        note: "2D canvas marching-squares each frame",
        tier: "C",
      },
    ],
  },
  "voice-orb": {
    title: "Voice Orb",
    properties: [
      {
        prop: "scale",
        label: "scale",
        note: "Scale spring / press",
      },
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
    ],
  },
  "warp-starfield": {
    title: "Warp Starfield",
    properties: [
      {
        prop: "opacity",
        label: "canvas paint",
        note: "2D canvas starfield each frame",
        tier: "C",
      },
    ],
  },
  "world-map": {
    title: "World Map",
    properties: [
      {
        prop: "opacity",
        label: "opacity",
        note: "Fade / cross-fade",
      },
      {
        prop: "pathlength",
        label: "pathLength",
        note: "SVG pathLength reveal",
        tier: "S",
      },
    ],
  },
};
