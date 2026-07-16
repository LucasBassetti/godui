import type { ComponentType } from "react";

/**
 * Shared prop contract for a card preview. `play` is true only while the card is
 * hovered (skeletons mostly animate via CSS `group-hover`, so few read it).
 */
export type CardPreviewProps = { play?: boolean };

type Preview = ComponentType<CardPreviewProps>;

import Accordion from "./previews/accordion";
import AgentFlow from "./previews/agent-flow";
import AgentTimeline from "./previews/agent-timeline";
import AnimatedBeam from "./previews/animated-beam";
import AnimatedTestimonials from "./previews/animated-testimonials";
import AnimatedTooltip from "./previews/animated-tooltip";
import AppShowcase from "./previews/app-showcase";
import AuroraText from "./previews/aurora-text";
import AvatarGroup from "./previews/avatar-group";
import BeamDraw from "./previews/beam-draw";
import BentoGrid from "./previews/bento-grid";
import BlueprintGrid from "./previews/blueprint-grid";
import BorderBeam from "./previews/border-beam";
import Breadcrumbs from "./previews/breadcrumbs";
import CardSwap from "./previews/card-swap";
import Combobox from "./previews/combobox";
import CommandPalette from "./previews/command-palette";
import CommentPin from "./previews/comment-pin";
import Confetti from "./previews/confetti";
import ContainerScroll from "./previews/container-scroll";
import ContextMenu from "./previews/context-menu";
import ConversationThread from "./previews/conversation-thread";
import CoverFlow from "./previews/cover-flow";
import DecorativeBackground from "./previews/decorative-background";
import Dock from "./previews/dock";
import Drawer from "./previews/drawer";
import DropdownMenu from "./previews/dropdown-menu";
import DynamicIsland from "./previews/dynamic-island";
import EffectBackground from "./previews/effect-background";
import ElasticText from "./previews/elastic-text";
import EncryptedCard from "./previews/encrypted-card";
import FilterBar from "./previews/filter-bar";
import FloatingToolbar from "./previews/floating-toolbar";
import FlowField from "./previews/flow-field";
import FluidCursor from "./previews/fluid-cursor";
import GeometricBackground from "./previews/geometric-background";
import Globe from "./previews/globe";
import GooeyFab from "./previews/gooey-fab";
import GooeyStack from "./previews/gooey-stack";
import GradientBackground from "./previews/gradient-background";
import Gravity from "./previews/gravity";
import HeroParallax from "./previews/hero-parallax";
import Highlighter from "./previews/highlighter";
import HoldConfirmButton from "./previews/hold-confirm-button";
import HolographicCard from "./previews/holographic-card";
import ImageAccordion from "./previews/image-accordion";
import ImageCompare from "./previews/image-compare";
import ImageTrail from "./previews/image-trail";
import InertiaGallery from "./previews/inertia-gallery";
import Lamp from "./previews/lamp";
import LightRays from "./previews/light-rays";
import LiquidGlassCard from "./previews/liquid-glass-card";
import LiquidGlassLens from "./previews/liquid-glass-lens";
import LiquidImage from "./previews/liquid-image";
import LiquidMetaballs from "./previews/liquid-metaballs";
import LiveCursors from "./previews/live-cursors";
import MagicButton from "./previews/magic-button";
import MagicInput from "./previews/magic-input";
import MagicTab from "./previews/magic-tab";
import MagneticButton from "./previews/magnetic-button";
import Marquee from "./previews/marquee";
import MaskButton from "./previews/mask-button";
import MegaMenu from "./previews/mega-menu";
import MorphGallery from "./previews/morph-gallery";
import MorphingDialog from "./previews/morphing-dialog";
import NumberTicker from "./previews/number-ticker";
import OrbitCarousel from "./previews/orbit-carousel";
import OrbitingCircles from "./previews/orbiting-circles";
import OtpInput from "./previews/otp-input";
import ParticleDissolve from "./previews/particle-dissolve";
import PixelGrid from "./previews/pixel-grid";
import PresenceFacepile from "./previews/presence-facepile";
import ProgressFoldButton from "./previews/progress-fold-button";
import ProgressiveCardReveal from "./previews/progressive-card-reveal";
import PromptComposer from "./previews/prompt-composer";
import PromptSuggestions from "./previews/prompt-suggestions";
import ReorderList from "./previews/reorder-list";
import ResizableHeader from "./previews/resizable-header";
import ScrollProgress from "./previews/scroll-progress";
import ScrollReveal from "./previews/scroll-reveal";
import ScrollStack from "./previews/scroll-stack";
import ScrollTextReveal from "./previews/scroll-text-reveal";
import ScrollTimeline from "./previews/scroll-timeline";
import SegmentedControl from "./previews/segmented-control";
import ShimmerButton from "./previews/shimmer-button";
import SlideConfirmButton from "./previews/slide-confirm-button";
import SourceCitations from "./previews/source-citations";
import SpinViewer from "./previews/spin-viewer";
import SpotlightCard from "./previews/spotlight-card";
import SpotlightReveal from "./previews/spotlight-reveal";
import StackBadge from "./previews/stack-badge";
import Stepper from "./previews/stepper";
import StickyScroll from "./previews/sticky-scroll";
import StoreBadge from "./previews/store-badge";
import SwipeDeck from "./previews/swipe-deck";
import TabBar from "./previews/tab-bar";
import Terminal from "./previews/terminal";
import TextAnimate from "./previews/text-animate";
import TextScramble from "./previews/text-scramble";
import ThreeDMarquee from "./previews/three-d-marquee";
import TiltCard from "./previews/tilt-card";
import Toast from "./previews/toast";
import TopographicDrift from "./previews/topographic-drift";
import VoiceOrb from "./previews/voice-orb";
import WarpStarfield from "./previews/warp-starfield";
import WorldMap from "./previews/world-map";

/**
 * Every component-index card renders a uniform skeleton preview from
 * `./previews/<slug>.tsx`. All previews are lightweight (shared `_kit`, no heavy
 * deps) so they are statically imported and bundled together: each card renders
 * instantly on paint with no async chunk fetch, so scrolling never reveals an
 * empty preview zone.
 */
export const cardPreviews: Record<string, Preview> = {
  "gooey-fab": GooeyFab,
  "gooey-stack": GooeyStack,
  "hold-confirm-button": HoldConfirmButton,
  "magic-button": MagicButton,
  "magnetic-button": MagneticButton,
  "mask-button": MaskButton,
  "progress-fold-button": ProgressFoldButton,
  "shimmer-button": ShimmerButton,
  "slide-confirm-button": SlideConfirmButton,
  "magic-input": MagicInput,
  "otp-input": OtpInput,
  breadcrumbs: Breadcrumbs,
  combobox: Combobox,
  "context-menu": ContextMenu,
  dock: Dock,
  "dropdown-menu": DropdownMenu,
  "filter-bar": FilterBar,
  "magic-tab": MagicTab,
  "mega-menu": MegaMenu,
  "resizable-header": ResizableHeader,
  "segmented-control": SegmentedControl,
  "tab-bar": TabBar,
  "animated-tooltip": AnimatedTooltip,
  "command-palette": CommandPalette,
  drawer: Drawer,
  "dynamic-island": DynamicIsland,
  "floating-toolbar": FloatingToolbar,
  "morphing-dialog": MorphingDialog,
  toast: Toast,
  accordion: Accordion,
  "animated-testimonials": AnimatedTestimonials,
  "app-showcase": AppShowcase,
  "avatar-group": AvatarGroup,
  "bento-grid": BentoGrid,
  "card-swap": CardSwap,
  "container-scroll": ContainerScroll,
  "cover-flow": CoverFlow,
  "hero-parallax": HeroParallax,
  "image-accordion": ImageAccordion,
  "image-compare": ImageCompare,
  "inertia-gallery": InertiaGallery,
  "morph-gallery": MorphGallery,
  "orbit-carousel": OrbitCarousel,
  "progressive-card-reveal": ProgressiveCardReveal,
  "reorder-list": ReorderList,
  "scroll-stack": ScrollStack,
  "spin-viewer": SpinViewer,
  "stack-badge": StackBadge,
  stepper: Stepper,
  "sticky-scroll": StickyScroll,
  "store-badge": StoreBadge,
  "swipe-deck": SwipeDeck,
  "three-d-marquee": ThreeDMarquee,
  "tilt-card": TiltCard,
  "holographic-card": HolographicCard,
  "aurora-text": AuroraText,
  "elastic-text": ElasticText,
  highlighter: Highlighter,
  "number-ticker": NumberTicker,
  "text-animate": TextAnimate,
  "text-scramble": TextScramble,
  "scroll-text-reveal": ScrollTextReveal,
  "agent-flow": AgentFlow,
  "agent-timeline": AgentTimeline,
  "conversation-thread": ConversationThread,
  "prompt-composer": PromptComposer,
  "prompt-suggestions": PromptSuggestions,
  "source-citations": SourceCitations,
  "voice-orb": VoiceOrb,
  "comment-pin": CommentPin,
  "live-cursors": LiveCursors,
  "presence-facepile": PresenceFacepile,
  "animated-beam": AnimatedBeam,
  globe: Globe,
  gravity: Gravity,
  "orbiting-circles": OrbitingCircles,
  "scroll-timeline": ScrollTimeline,
  "world-map": WorldMap,
  "beam-draw": BeamDraw,
  "border-beam": BorderBeam,
  confetti: Confetti,
  "encrypted-card": EncryptedCard,
  "fluid-cursor": FluidCursor,
  "image-trail": ImageTrail,
  lamp: Lamp,
  "liquid-image": LiquidImage,
  marquee: Marquee,
  "particle-dissolve": ParticleDissolve,
  "scroll-progress": ScrollProgress,
  "scroll-reveal": ScrollReveal,
  "spotlight-card": SpotlightCard,
  "spotlight-reveal": SpotlightReveal,
  terminal: Terminal,
  "blueprint-grid": BlueprintGrid,
  "decorative-background": DecorativeBackground,
  "effect-background": EffectBackground,
  "flow-field": FlowField,
  "geometric-background": GeometricBackground,
  "gradient-background": GradientBackground,
  "light-rays": LightRays,
  "liquid-metaballs": LiquidMetaballs,
  "pixel-grid": PixelGrid,
  "topographic-drift": TopographicDrift,
  "warp-starfield": WarpStarfield,
  "liquid-glass-card": LiquidGlassCard,
  "liquid-glass-lens": LiquidGlassLens,
};
