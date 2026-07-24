import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
  type ComponentProps,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { BackgroundShowcase } from "@/components/background-showcase";
import { PreviewCard } from "@/components/card-previews/preview-card";
import { ComponentInstall } from "@/components/component-install";
import { ComponentPreview } from "@/components/component-preview";
import { LangBadge } from "@/components/lang-badge";
import { AccordionAnatomy } from "@/components/learn/accordion-anatomy";
import { AccordionHeight } from "@/components/learn/accordion-height";
import { AccordionResult } from "@/components/learn/accordion-result";
import { AgentFlowAnatomy } from "@/components/learn/agent-flow-anatomy";
import { AgentFlowBorderTrace } from "@/components/learn/agent-flow-border-trace";
import { AgentFlowPacket } from "@/components/learn/agent-flow-packet";
import { AgentFlowResult } from "@/components/learn/agent-flow-result";
import { AgentTimelineAnatomy } from "@/components/learn/agent-timeline-anatomy";
import { AgentTimelineExpand } from "@/components/learn/agent-timeline-expand";
import { AgentTimelineRail } from "@/components/learn/agent-timeline-rail";
import { AgentTimelineResult } from "@/components/learn/agent-timeline-result";
import { AnimatedBeamAnatomy } from "@/components/learn/animated-beam-anatomy";
import { AnimatedBeamGradient } from "@/components/learn/animated-beam-gradient";
import { AnimatedBeamMeasure } from "@/components/learn/animated-beam-measure";
import { AnimatedBeamResult } from "@/components/learn/animated-beam-result";
import { AnimatedTestimonialsAnatomy } from "@/components/learn/animated-testimonials-anatomy";
import { AnimatedTestimonialsResult } from "@/components/learn/animated-testimonials-result";
import { AnimatedTestimonialsStack } from "@/components/learn/animated-testimonials-stack";
import { AnimatedTestimonialsWords } from "@/components/learn/animated-testimonials-words";
import { AnimatedTooltipAnatomy } from "@/components/learn/animated-tooltip-anatomy";
import { AnimatedTooltipResult } from "@/components/learn/animated-tooltip-result";
import { AnimatedTooltipSpring } from "@/components/learn/animated-tooltip-spring";
import { AnimatedTooltipTilt } from "@/components/learn/animated-tooltip-tilt";
import { AppShowcaseAnatomy } from "@/components/learn/app-showcase-anatomy";
import { AppShowcaseLoop } from "@/components/learn/app-showcase-loop";
import { AppShowcaseResult } from "@/components/learn/app-showcase-result";
import { AppShowcaseScroll } from "@/components/learn/app-showcase-scroll";
import { AuroraTextAnatomy } from "@/components/learn/aurora-text-anatomy";
import { AuroraTextLifecycle } from "@/components/learn/aurora-text-lifecycle";
import { AuroraTextResult } from "@/components/learn/aurora-text-result";
import { AuroraTextSweep } from "@/components/learn/aurora-text-sweep";
import { AvatarGroupAnatomy } from "@/components/learn/avatar-group-anatomy";
import { AvatarGroupResult } from "@/components/learn/avatar-group-result";
import { AvatarGroupSpread } from "@/components/learn/avatar-group-spread";
import { BeamDrawAnatomy } from "@/components/learn/beam-draw-anatomy";
import { BeamDrawResult } from "@/components/learn/beam-draw-result";
import { BeamDrawScroll } from "@/components/learn/beam-draw-scroll";
import { BeamDrawSpring } from "@/components/learn/beam-draw-spring";
import { BentoGridAnatomy } from "@/components/learn/bento-grid-anatomy";
import { BentoGridGlow } from "@/components/learn/bento-grid-glow";
import { BentoGridResult } from "@/components/learn/bento-grid-result";
import { BentoGridStagger } from "@/components/learn/bento-grid-stagger";
import { BlueprintGridAnatomy } from "@/components/learn/blueprint-grid-anatomy";
import { BlueprintGridPerspective } from "@/components/learn/blueprint-grid-perspective";
import { BlueprintGridResult } from "@/components/learn/blueprint-grid-result";
import { BlueprintGridSweep } from "@/components/learn/blueprint-grid-sweep";
import { BorderBeamAnatomy } from "@/components/learn/border-beam-anatomy";
import { BorderBeamPath } from "@/components/learn/border-beam-path";
import { BorderBeamRainbow } from "@/components/learn/border-beam-rainbow";
import { BorderBeamResult } from "@/components/learn/border-beam-result";
import { BreadcrumbsAnatomy } from "@/components/learn/breadcrumbs-anatomy";
import { BreadcrumbsCollapse } from "@/components/learn/breadcrumbs-collapse";
import { BreadcrumbsPill } from "@/components/learn/breadcrumbs-pill";
import { BreadcrumbsResult } from "@/components/learn/breadcrumbs-result";
import { CardSwapAnatomy } from "@/components/learn/card-swap-anatomy";
import { CardSwapCycle } from "@/components/learn/card-swap-cycle";
import { CardSwapResult } from "@/components/learn/card-swap-result";
import { CardSwapTilt } from "@/components/learn/card-swap-tilt";
import { ComboboxAnatomy } from "@/components/learn/combobox-anatomy";
import { ComboboxHighlight } from "@/components/learn/combobox-highlight";
import { ComboboxRace } from "@/components/learn/combobox-race";
import { ComboboxResult } from "@/components/learn/combobox-result";
import { ComboboxStagger } from "@/components/learn/combobox-stagger";
import { CommandPaletteAnatomy } from "@/components/learn/command-palette-anatomy";
import { CommandPaletteEnter } from "@/components/learn/command-palette-enter";
import { CommandPaletteHighlight } from "@/components/learn/command-palette-highlight";
import { CommandPaletteResult } from "@/components/learn/command-palette-result";
import { CommentPinAnatomy } from "@/components/learn/comment-pin-anatomy";
import { CommentPinResolved } from "@/components/learn/comment-pin-resolved";
import { CommentPinResult } from "@/components/learn/comment-pin-result";
import { CommentPinSpring } from "@/components/learn/comment-pin-spring";
import { ConfettiAnatomy } from "@/components/learn/confetti-anatomy";
import { ConfettiApi } from "@/components/learn/confetti-api";
import { ConfettiOrigin } from "@/components/learn/confetti-origin";
import { ConfettiResult } from "@/components/learn/confetti-result";
import { ContainerScrollAnatomy } from "@/components/learn/container-scroll-anatomy";
import { ContainerScrollResult } from "@/components/learn/container-scroll-result";
import { ContainerScrollScrub } from "@/components/learn/container-scroll-scrub";
import { ContextMenuAnatomy } from "@/components/learn/context-menu-anatomy";
import { ContextMenuFlip } from "@/components/learn/context-menu-flip";
import { ContextMenuResult } from "@/components/learn/context-menu-result";
import { ContextMenuSpring } from "@/components/learn/context-menu-spring";
import { ConversationThreadAnatomy } from "@/components/learn/conversation-thread-anatomy";
import { ConversationThreadResult } from "@/components/learn/conversation-thread-result";
import { ConversationThreadScroll } from "@/components/learn/conversation-thread-scroll";
import { ConversationThreadStream } from "@/components/learn/conversation-thread-stream";
import { CoverFlowAnatomy } from "@/components/learn/cover-flow-anatomy";
import { CoverFlowFan } from "@/components/learn/cover-flow-fan";
import { CoverFlowResult } from "@/components/learn/cover-flow-result";
import { DockAnatomy } from "@/components/learn/dock-anatomy";
import { DockMagnify } from "@/components/learn/dock-magnify";
import { DockResult } from "@/components/learn/dock-result";
import { DrawerAnatomy } from "@/components/learn/drawer-anatomy";
import { DrawerDismiss } from "@/components/learn/drawer-dismiss";
import { DrawerResult } from "@/components/learn/drawer-result";
import { DrawerSpring } from "@/components/learn/drawer-spring";
import { DropdownMenuAnatomy } from "@/components/learn/dropdown-menu-anatomy";
import { DropdownMenuResult } from "@/components/learn/dropdown-menu-result";
import { DropdownMenuSpring } from "@/components/learn/dropdown-menu-spring";
import { DropdownMenuSubmenu } from "@/components/learn/dropdown-menu-submenu";
import { DynamicIslandAnatomy } from "@/components/learn/dynamic-island-anatomy";
import { DynamicIslandCrossfade } from "@/components/learn/dynamic-island-crossfade";
import { DynamicIslandResult } from "@/components/learn/dynamic-island-result";
import { DynamicIslandShell } from "@/components/learn/dynamic-island-shell";
import { ElasticTextAnatomy } from "@/components/learn/elastic-text-anatomy";
import { ElasticTextResult } from "@/components/learn/elastic-text-result";
import { ElasticTextSpotlight } from "@/components/learn/elastic-text-spotlight";
import { ElasticTextSpring } from "@/components/learn/elastic-text-spring";
import { EncryptedCardAnatomy } from "@/components/learn/encrypted-card-anatomy";
import { EncryptedCardMask } from "@/components/learn/encrypted-card-mask";
import { EncryptedCardResult } from "@/components/learn/encrypted-card-result";
import { EncryptedCardScramble } from "@/components/learn/encrypted-card-scramble";
import { FilterBarAnatomy } from "@/components/learn/filter-bar-anatomy";
import { FilterBarResult } from "@/components/learn/filter-bar-result";
import { FilterBarSpring } from "@/components/learn/filter-bar-spring";
import { FloatingToolbarAnatomy } from "@/components/learn/floating-toolbar-anatomy";
import { FloatingToolbarEnter } from "@/components/learn/floating-toolbar-enter";
import { FloatingToolbarMagnetic } from "@/components/learn/floating-toolbar-magnetic";
import { FloatingToolbarResult } from "@/components/learn/floating-toolbar-result";
import { FlowFieldAnatomy } from "@/components/learn/flow-field-anatomy";
import { FlowFieldLifecycle } from "@/components/learn/flow-field-lifecycle";
import { FlowFieldResult } from "@/components/learn/flow-field-result";
import { FlowFieldTrails } from "@/components/learn/flow-field-trails";
import { FluidCursorAnatomy } from "@/components/learn/fluid-cursor-anatomy";
import { FluidCursorLerp } from "@/components/learn/fluid-cursor-lerp";
import { FluidCursorLifecycle } from "@/components/learn/fluid-cursor-lifecycle";
import { FluidCursorResult } from "@/components/learn/fluid-cursor-result";
import { FoldProgress } from "@/components/learn/fold-progress";
import { FoldStages } from "@/components/learn/fold-stages";
import { GlobeAnatomy } from "@/components/learn/globe-anatomy";
import { GlobeLifecycle } from "@/components/learn/globe-lifecycle";
import { GlobeResult } from "@/components/learn/globe-result";
import { GlobeRotate } from "@/components/learn/globe-rotate";
import { GooeyFabResult } from "@/components/learn/gooey-fab-result";
import { GooeyFilter } from "@/components/learn/gooey-filter";
import { GooeyLayers } from "@/components/learn/gooey-layers";
import { GooeySpring } from "@/components/learn/gooey-spring";
import { GooeyStackAnatomy } from "@/components/learn/gooey-stack-anatomy";
import { GooeyStackFilter } from "@/components/learn/gooey-stack-filter";
import { GooeyStackNearness } from "@/components/learn/gooey-stack-nearness";
import { GooeyStackResult } from "@/components/learn/gooey-stack-result";
import { GravityAnatomy } from "@/components/learn/gravity-anatomy";
import { GravityLifecycle } from "@/components/learn/gravity-lifecycle";
import { GravityResult } from "@/components/learn/gravity-result";
import { GravitySync } from "@/components/learn/gravity-sync";
import { HeroParallaxAnatomy } from "@/components/learn/hero-parallax-anatomy";
import { HeroParallaxResult } from "@/components/learn/hero-parallax-result";
import { HeroParallaxScrub } from "@/components/learn/hero-parallax-scrub";
import { HighlighterAnatomy } from "@/components/learn/highlighter-anatomy";
import { HighlighterDraw } from "@/components/learn/highlighter-draw";
import { HighlighterLifecycle } from "@/components/learn/highlighter-lifecycle";
import { HighlighterResult } from "@/components/learn/highlighter-result";
import { HoldCancel } from "@/components/learn/hold-cancel";
import { HoldConfirmResult } from "@/components/learn/hold-confirm-result";
import { HoldFill } from "@/components/learn/hold-fill";
import { HolographicCardAnatomy } from "@/components/learn/holographic-card-anatomy";
import { HolographicCardFoil } from "@/components/learn/holographic-card-foil";
import { HolographicCardResult } from "@/components/learn/holographic-card-result";
import { ImageAccordionAnatomy } from "@/components/learn/image-accordion-anatomy";
import { ImageAccordionGrow } from "@/components/learn/image-accordion-grow";
import { ImageAccordionResult } from "@/components/learn/image-accordion-result";
import { ImageCompareAnatomy } from "@/components/learn/image-compare-anatomy";
import { ImageCompareResult } from "@/components/learn/image-compare-result";
import { ImageCompareScrub } from "@/components/learn/image-compare-scrub";
import { ImageTrailAnatomy } from "@/components/learn/image-trail-anatomy";
import { ImageTrailResult } from "@/components/learn/image-trail-result";
import { ImageTrailThreshold } from "@/components/learn/image-trail-threshold";
import { ImageTrailWaapi } from "@/components/learn/image-trail-waapi";
import { InertiaGalleryAnatomy } from "@/components/learn/inertia-gallery-anatomy";
import { InertiaGalleryDrag } from "@/components/learn/inertia-gallery-drag";
import { InertiaGalleryFalloff } from "@/components/learn/inertia-gallery-falloff";
import { InertiaGalleryResult } from "@/components/learn/inertia-gallery-result";
import { LampAnatomy } from "@/components/learn/lamp-anatomy";
import { LampIgnite } from "@/components/learn/lamp-ignite";
import { LampResult } from "@/components/learn/lamp-result";
import { LampRise } from "@/components/learn/lamp-rise";
import { LayerReveal } from "@/components/learn/layer-reveal";
import { LightRaysAnatomy } from "@/components/learn/light-rays-anatomy";
import { LightRaysGrain } from "@/components/learn/light-rays-grain";
import { LightRaysResult } from "@/components/learn/light-rays-result";
import { LightRaysSweep } from "@/components/learn/light-rays-sweep";
import { LiquidGlassCardAnatomy } from "@/components/learn/liquid-glass-card-anatomy";
import { LiquidGlassCardDispersion } from "@/components/learn/liquid-glass-card-dispersion";
import { LiquidGlassCardResult } from "@/components/learn/liquid-glass-card-result";
import { LiquidGlassCardSheen } from "@/components/learn/liquid-glass-card-sheen";
import { LiquidGlassLensAnatomy } from "@/components/learn/liquid-glass-lens-anatomy";
import { LiquidGlassLensMap } from "@/components/learn/liquid-glass-lens-map";
import { LiquidGlassLensParent } from "@/components/learn/liquid-glass-lens-parent";
import { LiquidGlassLensResult } from "@/components/learn/liquid-glass-lens-result";
import { LiquidImageAnatomy } from "@/components/learn/liquid-image-anatomy";
import { LiquidImageEdge } from "@/components/learn/liquid-image-edge";
import { LiquidImageLerp } from "@/components/learn/liquid-image-lerp";
import { LiquidImageResult } from "@/components/learn/liquid-image-result";
import { LiquidImageTrigger } from "@/components/learn/liquid-image-trigger";
import { LiquidMetaballsAnatomy } from "@/components/learn/liquid-metaballs-anatomy";
import { LiquidMetaballsCursor } from "@/components/learn/liquid-metaballs-cursor";
import { LiquidMetaballsGoo } from "@/components/learn/liquid-metaballs-goo";
import { LiquidMetaballsResult } from "@/components/learn/liquid-metaballs-result";
import { LiveCursorsAnatomy } from "@/components/learn/live-cursors-anatomy";
import { LiveCursorsPresence } from "@/components/learn/live-cursors-presence";
import { LiveCursorsResult } from "@/components/learn/live-cursors-result";
import { LiveCursorsSpring } from "@/components/learn/live-cursors-spring";
import { MagicInputAnatomy } from "@/components/learn/magic-input-anatomy";
import { MagicInputLifecycle } from "@/components/learn/magic-input-lifecycle";
import { MagicInputLift } from "@/components/learn/magic-input-lift";
import { MagicInputRainbow } from "@/components/learn/magic-input-rainbow";
import { MagicInputResult } from "@/components/learn/magic-input-result";
import { MagicTabAnatomy } from "@/components/learn/magic-tab-anatomy";
import { MagicTabLift } from "@/components/learn/magic-tab-lift";
import { MagicTabRainbow } from "@/components/learn/magic-tab-rainbow";
import { MagicTabResult } from "@/components/learn/magic-tab-result";
import { MagneticParallax } from "@/components/learn/magnetic-parallax";
import { MagneticPull } from "@/components/learn/magnetic-pull";
import { MagneticResult } from "@/components/learn/magnetic-result";
import { MarqueeAnatomy } from "@/components/learn/marquee-anatomy";
import { MarqueeFade } from "@/components/learn/marquee-fade";
import { MarqueeResult } from "@/components/learn/marquee-result";
import { MarqueeTrack } from "@/components/learn/marquee-track";
import { MaskFlipbook } from "@/components/learn/mask-flipbook";
import { MaskResult } from "@/components/learn/mask-result";
import { MaskTwinLabels } from "@/components/learn/mask-twin-labels";
import { MegaMenuAnatomy } from "@/components/learn/mega-menu-anatomy";
import { MegaMenuHighlight } from "@/components/learn/mega-menu-highlight";
import { MegaMenuMorph } from "@/components/learn/mega-menu-morph";
import { MegaMenuResult } from "@/components/learn/mega-menu-result";
import { MorphGalleryAnatomy } from "@/components/learn/morph-gallery-anatomy";
import { MorphGalleryMorph } from "@/components/learn/morph-gallery-morph";
import { MorphGalleryResult } from "@/components/learn/morph-gallery-result";
import { MorphingDialogAnatomy } from "@/components/learn/morphing-dialog-anatomy";
import { MorphingDialogBackdrop } from "@/components/learn/morphing-dialog-backdrop";
import { MorphingDialogResult } from "@/components/learn/morphing-dialog-result";
import { MorphingDialogSpring } from "@/components/learn/morphing-dialog-spring";
import { MotionScorePanel } from "@/components/learn/motion-score-panel";
import { NotificationInboxAnatomy } from "@/components/learn/notification-inbox-anatomy";
import { NotificationInboxBadge } from "@/components/learn/notification-inbox-badge";
import { NotificationInboxResult } from "@/components/learn/notification-inbox-result";
import { NotificationInboxSwipe } from "@/components/learn/notification-inbox-swipe";
import { NumberTickerAnatomy } from "@/components/learn/number-ticker-anatomy";
import { NumberTickerResult } from "@/components/learn/number-ticker-result";
import { NumberTickerSpring } from "@/components/learn/number-ticker-spring";
import { NumberTickerView } from "@/components/learn/number-ticker-view";
import { OrbitCarouselAnatomy } from "@/components/learn/orbit-carousel-anatomy";
import { OrbitCarouselOrbit } from "@/components/learn/orbit-carousel-orbit";
import { OrbitCarouselResult } from "@/components/learn/orbit-carousel-result";
import { OrbitingCirclesAnatomy } from "@/components/learn/orbiting-circles-anatomy";
import { OrbitingCirclesCounter } from "@/components/learn/orbiting-circles-counter";
import { OrbitingCirclesResult } from "@/components/learn/orbiting-circles-result";
import { OrbitingCirclesRings } from "@/components/learn/orbiting-circles-rings";
import { OtpAnatomy } from "@/components/learn/otp-anatomy";
import { OtpCaret } from "@/components/learn/otp-caret";
import { OtpResult } from "@/components/learn/otp-result";
import { OtpShake } from "@/components/learn/otp-shake";
import { ParticleDissolveAnatomy } from "@/components/learn/particle-dissolve-anatomy";
import { ParticleDissolveCycle } from "@/components/learn/particle-dissolve-cycle";
import { ParticleDissolveResult } from "@/components/learn/particle-dissolve-result";
import { ParticleDissolveTrigger } from "@/components/learn/particle-dissolve-trigger";
import { PixelGridAnatomy } from "@/components/learn/pixel-grid-anatomy";
import { PixelGridFlicker } from "@/components/learn/pixel-grid-flicker";
import { PixelGridResult } from "@/components/learn/pixel-grid-result";
import { PixelGridReveal } from "@/components/learn/pixel-grid-reveal";
import { PresenceFacepileAnatomy } from "@/components/learn/presence-facepile-anatomy";
import { PresenceFacepileEnter } from "@/components/learn/presence-facepile-enter";
import { PresenceFacepileResult } from "@/components/learn/presence-facepile-result";
import { PresenceFacepileStatus } from "@/components/learn/presence-facepile-status";
import { ProgressFoldResult } from "@/components/learn/progress-fold-result";
import { ProgressiveCardRevealAnatomy } from "@/components/learn/progressive-card-reveal-anatomy";
import { ProgressiveCardRevealFunnel } from "@/components/learn/progressive-card-reveal-funnel";
import { ProgressiveCardRevealResult } from "@/components/learn/progressive-card-reveal-result";
import { PromptComposerAnatomy } from "@/components/learn/prompt-composer-anatomy";
import { PromptComposerChips } from "@/components/learn/prompt-composer-chips";
import { PromptComposerResult } from "@/components/learn/prompt-composer-result";
import { PromptComposerSendMorph } from "@/components/learn/prompt-composer-send-morph";
import { PromptSuggestionsAnatomy } from "@/components/learn/prompt-suggestions-anatomy";
import { PromptSuggestionsHover } from "@/components/learn/prompt-suggestions-hover";
import { PromptSuggestionsResult } from "@/components/learn/prompt-suggestions-result";
import { PromptSuggestionsStagger } from "@/components/learn/prompt-suggestions-stagger";
import { PushPhysics } from "@/components/learn/push-physics";
import { RainbowSweep } from "@/components/learn/rainbow-sweep";
import { ReorderListAnatomy } from "@/components/learn/reorder-list-anatomy";
import { ReorderListFlow } from "@/components/learn/reorder-list-flow";
import { ReorderListResult } from "@/components/learn/reorder-list-result";
import { ResizableHeaderAnatomy } from "@/components/learn/resizable-header-anatomy";
import { ResizableHeaderMorph } from "@/components/learn/resizable-header-morph";
import { ResizableHeaderPills } from "@/components/learn/resizable-header-pills";
import { ResizableHeaderResult } from "@/components/learn/resizable-header-result";
import { ResultPreview } from "@/components/learn/result-preview";
import { ScrollProgressAnatomy } from "@/components/learn/scroll-progress-anatomy";
import { ScrollProgressCircle } from "@/components/learn/scroll-progress-circle";
import { ScrollProgressResult } from "@/components/learn/scroll-progress-result";
import { ScrollProgressSpring } from "@/components/learn/scroll-progress-spring";
import { ScrollRevealAnatomy } from "@/components/learn/scroll-reveal-anatomy";
import { ScrollRevealResult } from "@/components/learn/scroll-reveal-result";
import { ScrollRevealSkew } from "@/components/learn/scroll-reveal-skew";
import { ScrollRevealSpring } from "@/components/learn/scroll-reveal-spring";
import { ScrollScene } from "@/components/learn/scroll-scene";
import { ScrollStackAnatomy } from "@/components/learn/scroll-stack-anatomy";
import { ScrollStackBury } from "@/components/learn/scroll-stack-bury";
import { ScrollStackResult } from "@/components/learn/scroll-stack-result";
import { ScrollTextRevealAnatomy } from "@/components/learn/scroll-text-reveal-anatomy";
import { ScrollTextRevealLatch } from "@/components/learn/scroll-text-reveal-latch";
import { ScrollTextRevealResult } from "@/components/learn/scroll-text-reveal-result";
import { ScrollTextRevealScrub } from "@/components/learn/scroll-text-reveal-scrub";
import { ScrollTimelineAnatomy } from "@/components/learn/scroll-timeline-anatomy";
import { ScrollTimelineResult } from "@/components/learn/scroll-timeline-result";
import { ScrollTimelineScrub } from "@/components/learn/scroll-timeline-scrub";
import { ScrollTimelineSpring } from "@/components/learn/scroll-timeline-spring";
import { SegmentedControlAnatomy } from "@/components/learn/segmented-control-anatomy";
import { SegmentedControlResult } from "@/components/learn/segmented-control-result";
import { SegmentedControlSlide } from "@/components/learn/segmented-control-slide";
import { ShimmerLayers } from "@/components/learn/shimmer-layers";
import { ShimmerResult } from "@/components/learn/shimmer-result";
import { ShimmerSpeed } from "@/components/learn/shimmer-speed";
import { SlideAnatomy } from "@/components/learn/slide-anatomy";
import { SlideConfirmResult } from "@/components/learn/slide-confirm-result";
import { SlideThreshold } from "@/components/learn/slide-threshold";
import { SourceCitationsAnatomy } from "@/components/learn/source-citations-anatomy";
import { SourceCitationsList } from "@/components/learn/source-citations-list";
import { SourceCitationsResult } from "@/components/learn/source-citations-result";
import { SourceCitationsTooltip } from "@/components/learn/source-citations-tooltip";
import { SpinViewerAnatomy } from "@/components/learn/spin-viewer-anatomy";
import { SpinViewerDrag } from "@/components/learn/spin-viewer-drag";
import { SpinViewerResult } from "@/components/learn/spin-viewer-result";
import { SpotlightCardAnatomy } from "@/components/learn/spotlight-card-anatomy";
import { SpotlightCardBorder } from "@/components/learn/spotlight-card-border";
import { SpotlightCardFollow } from "@/components/learn/spotlight-card-follow";
import { SpotlightCardResult } from "@/components/learn/spotlight-card-result";
import { SpotlightRevealAnatomy } from "@/components/learn/spotlight-reveal-anatomy";
import { SpotlightRevealFollow } from "@/components/learn/spotlight-reveal-follow";
import { SpotlightRevealMask } from "@/components/learn/spotlight-reveal-mask";
import { SpotlightRevealResult } from "@/components/learn/spotlight-reveal-result";
import { StackBadgeAnatomy } from "@/components/learn/stack-badge-anatomy";
import { StackBadgeResult } from "@/components/learn/stack-badge-result";
import { StackBadgeStagger } from "@/components/learn/stack-badge-stagger";
import { StepperAnatomy } from "@/components/learn/stepper-anatomy";
import { StepperProgress } from "@/components/learn/stepper-progress";
import { StepperResult } from "@/components/learn/stepper-result";
import { StickyScrollAnatomy } from "@/components/learn/sticky-scroll-anatomy";
import { StickyScrollIo } from "@/components/learn/sticky-scroll-io";
import { StickyScrollResult } from "@/components/learn/sticky-scroll-result";
import { StoreBadgeAnatomy } from "@/components/learn/store-badge-anatomy";
import { StoreBadgeResult } from "@/components/learn/store-badge-result";
import { StoreBadgeSheen } from "@/components/learn/store-badge-sheen";
import { SwipeDeckAnatomy } from "@/components/learn/swipe-deck-anatomy";
import { SwipeDeckFling } from "@/components/learn/swipe-deck-fling";
import { SwipeDeckResult } from "@/components/learn/swipe-deck-result";
import { TabBarAnatomy } from "@/components/learn/tab-bar-anatomy";
import { TabBarBlob } from "@/components/learn/tab-bar-blob";
import { TabBarPop } from "@/components/learn/tab-bar-pop";
import { TabBarResult } from "@/components/learn/tab-bar-result";
import { TerminalAnatomy } from "@/components/learn/terminal-anatomy";
import { TerminalLifecycle } from "@/components/learn/terminal-lifecycle";
import { TerminalResult } from "@/components/learn/terminal-result";
import { TerminalTyping } from "@/components/learn/terminal-typing";
import { TextAnimateAnatomy } from "@/components/learn/text-animate-anatomy";
import { TextAnimatePresets } from "@/components/learn/text-animate-presets";
import { TextAnimateResult } from "@/components/learn/text-animate-result";
import { TextAnimateStagger } from "@/components/learn/text-animate-stagger";
import { TextScrambleAnatomy } from "@/components/learn/text-scramble-anatomy";
import { TextScrambleCycle } from "@/components/learn/text-scramble-cycle";
import { TextScrambleResult } from "@/components/learn/text-scramble-result";
import { TextScrambleTrigger } from "@/components/learn/text-scramble-trigger";
import { ThreeDMarqueeAnatomy } from "@/components/learn/three-d-marquee-anatomy";
import { ThreeDMarqueeBob } from "@/components/learn/three-d-marquee-bob";
import { ThreeDMarqueeResult } from "@/components/learn/three-d-marquee-result";
import { TiltCardAnatomy } from "@/components/learn/tilt-card-anatomy";
import { TiltCardResult } from "@/components/learn/tilt-card-result";
import { TiltCardSpring } from "@/components/learn/tilt-card-spring";
import { ToastAnatomy } from "@/components/learn/toast-anatomy";
import { ToastExpand } from "@/components/learn/toast-expand";
import { ToastResult } from "@/components/learn/toast-result";
import { ToastSwipe } from "@/components/learn/toast-swipe";
import { TopographicDriftAnatomy } from "@/components/learn/topographic-drift-anatomy";
import { TopographicDriftDrift } from "@/components/learn/topographic-drift-drift";
import { TopographicDriftMarch } from "@/components/learn/topographic-drift-march";
import { TopographicDriftResult } from "@/components/learn/topographic-drift-result";
import { VoiceOrbAmpSplit } from "@/components/learn/voice-orb-amp-split";
import { VoiceOrbAnatomy } from "@/components/learn/voice-orb-anatomy";
import { VoiceOrbResult } from "@/components/learn/voice-orb-result";
import { VoiceOrbStates } from "@/components/learn/voice-orb-states";
import { WarpStarfieldAnatomy } from "@/components/learn/warp-starfield-anatomy";
import { WarpStarfieldParallax } from "@/components/learn/warp-starfield-parallax";
import { WarpStarfieldResult } from "@/components/learn/warp-starfield-result";
import { WarpStarfieldWarp } from "@/components/learn/warp-starfield-warp";
import { WorldMapAnatomy } from "@/components/learn/world-map-anatomy";
import { WorldMapDraw } from "@/components/learn/world-map-draw";
import { WorldMapPulse } from "@/components/learn/world-map-pulse";
import { WorldMapResult } from "@/components/learn/world-map-result";
import { MCPInstall } from "@/components/mcp-install";

function Table(props: ComponentProps<"table">) {
  return (
    <div className="docs-table-wrapper not-prose my-6 overflow-x-auto">
      <table className="docs-table w-full text-sm" {...props} />
    </div>
  );
}

/** Pull the Shiki `language-xxx` class off the inner <code> element. */
function langFromChildren(children: ReactNode): string {
  const code = (Array.isArray(children) ? children[0] : children) as
    | ReactElement<{ className?: string }>
    | undefined;
  const className = isValidElement(code) ? (code.props.className ?? "") : "";
  return /language-(\w+)/.exec(className)?.[1] ?? "txt";
}

/**
 * Override the default `pre` so every fenced code block (Usage, etc.) gets the
 * same title bar as the install steps: a lang badge, the optional filename, and
 * the bordered copy button. A non-breaking space forces the bar to render even
 * when the fence has no `title="…"`.
 */
function CodeBlockWithHeader({
  title,
  children,
  ...props
}: ComponentProps<typeof CodeBlock>) {
  return (
    <CodeBlock
      {...props}
      title={title ?? " "}
      icon={<LangBadge lang={langFromChildren(children)} />}
    >
      <Pre>{children}</Pre>
    </CodeBlock>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    pre: CodeBlockWithHeader,
    table: Table,
    ComponentPreview,
    ComponentInstall,
    MCPInstall,
    BackgroundShowcase,
    PreviewCard,
    AccordionAnatomy,
    AccordionHeight,
    AccordionResult,
    AgentFlowAnatomy,
    AgentFlowBorderTrace,
    AgentFlowPacket,
    AgentFlowResult,
    AgentTimelineAnatomy,
    AgentTimelineExpand,
    AgentTimelineRail,
    AgentTimelineResult,
    AnimatedBeamAnatomy,
    AnimatedBeamGradient,
    AnimatedBeamMeasure,
    AnimatedBeamResult,
    AnimatedTestimonialsAnatomy,
    AnimatedTestimonialsResult,
    AnimatedTestimonialsStack,
    AnimatedTestimonialsWords,
    AnimatedTooltipAnatomy,
    AnimatedTooltipResult,
    AnimatedTooltipSpring,
    AnimatedTooltipTilt,
    AppShowcaseAnatomy,
    AppShowcaseLoop,
    AppShowcaseResult,
    AppShowcaseScroll,
    AuroraTextAnatomy,
    AuroraTextLifecycle,
    AuroraTextResult,
    AuroraTextSweep,
    AvatarGroupAnatomy,
    AvatarGroupResult,
    AvatarGroupSpread,
    BeamDrawAnatomy,
    BeamDrawResult,
    BeamDrawScroll,
    BeamDrawSpring,
    BentoGridAnatomy,
    BentoGridGlow,
    BentoGridResult,
    BentoGridStagger,
    BlueprintGridAnatomy,
    BlueprintGridPerspective,
    BlueprintGridResult,
    BlueprintGridSweep,
    BorderBeamAnatomy,
    BorderBeamPath,
    BorderBeamRainbow,
    BorderBeamResult,
    BreadcrumbsAnatomy,
    BreadcrumbsCollapse,
    BreadcrumbsPill,
    BreadcrumbsResult,
    CardSwapAnatomy,
    CardSwapCycle,
    CardSwapResult,
    CardSwapTilt,
    ComboboxAnatomy,
    ComboboxHighlight,
    ComboboxRace,
    ComboboxResult,
    ComboboxStagger,
    CommandPaletteAnatomy,
    CommandPaletteEnter,
    CommandPaletteHighlight,
    CommandPaletteResult,
    CommentPinAnatomy,
    CommentPinResolved,
    CommentPinResult,
    CommentPinSpring,
    ConfettiAnatomy,
    ConfettiApi,
    ConfettiOrigin,
    ConfettiResult,
    ContainerScrollAnatomy,
    ContainerScrollResult,
    ContainerScrollScrub,
    ContextMenuAnatomy,
    ContextMenuFlip,
    ContextMenuResult,
    ContextMenuSpring,
    ConversationThreadAnatomy,
    ConversationThreadResult,
    ConversationThreadScroll,
    ConversationThreadStream,
    CoverFlowAnatomy,
    CoverFlowFan,
    CoverFlowResult,
    DockAnatomy,
    DockMagnify,
    DockResult,
    DrawerAnatomy,
    DrawerDismiss,
    DrawerResult,
    DrawerSpring,
    DropdownMenuAnatomy,
    DropdownMenuResult,
    DropdownMenuSpring,
    DropdownMenuSubmenu,
    DynamicIslandAnatomy,
    DynamicIslandCrossfade,
    DynamicIslandResult,
    DynamicIslandShell,
    ElasticTextAnatomy,
    ElasticTextResult,
    ElasticTextSpotlight,
    ElasticTextSpring,
    EncryptedCardAnatomy,
    EncryptedCardMask,
    EncryptedCardResult,
    EncryptedCardScramble,
    FilterBarAnatomy,
    FilterBarResult,
    FilterBarSpring,
    FloatingToolbarAnatomy,
    FloatingToolbarEnter,
    FloatingToolbarMagnetic,
    FloatingToolbarResult,
    FlowFieldAnatomy,
    FlowFieldLifecycle,
    FlowFieldResult,
    FlowFieldTrails,
    FluidCursorAnatomy,
    FluidCursorLerp,
    FluidCursorLifecycle,
    FluidCursorResult,
    FoldProgress,
    FoldStages,
    GlobeAnatomy,
    GlobeLifecycle,
    GlobeResult,
    GlobeRotate,
    GooeyFabResult,
    GooeyFilter,
    GooeyLayers,
    GooeySpring,
    GooeyStackAnatomy,
    GooeyStackFilter,
    GooeyStackNearness,
    GooeyStackResult,
    GravityAnatomy,
    GravityLifecycle,
    GravityResult,
    GravitySync,
    HeroParallaxAnatomy,
    HeroParallaxResult,
    HeroParallaxScrub,
    HighlighterAnatomy,
    HighlighterDraw,
    HighlighterLifecycle,
    HighlighterResult,
    HoldCancel,
    HoldConfirmResult,
    HoldFill,
    HolographicCardAnatomy,
    HolographicCardFoil,
    HolographicCardResult,
    ImageAccordionAnatomy,
    ImageAccordionGrow,
    ImageAccordionResult,
    ImageCompareAnatomy,
    ImageCompareResult,
    ImageCompareScrub,
    ImageTrailAnatomy,
    ImageTrailResult,
    ImageTrailThreshold,
    ImageTrailWaapi,
    InertiaGalleryAnatomy,
    InertiaGalleryDrag,
    InertiaGalleryFalloff,
    InertiaGalleryResult,
    LampAnatomy,
    LampIgnite,
    LampResult,
    LampRise,
    LayerReveal,
    LightRaysAnatomy,
    LightRaysGrain,
    LightRaysResult,
    LightRaysSweep,
    LiquidGlassCardAnatomy,
    LiquidGlassCardDispersion,
    LiquidGlassCardResult,
    LiquidGlassCardSheen,
    LiquidGlassLensAnatomy,
    LiquidGlassLensMap,
    LiquidGlassLensParent,
    LiquidGlassLensResult,
    LiquidImageAnatomy,
    LiquidImageEdge,
    LiquidImageLerp,
    LiquidImageResult,
    LiquidImageTrigger,
    LiquidMetaballsAnatomy,
    LiquidMetaballsCursor,
    LiquidMetaballsGoo,
    LiquidMetaballsResult,
    LiveCursorsAnatomy,
    LiveCursorsPresence,
    LiveCursorsResult,
    LiveCursorsSpring,
    MagicInputAnatomy,
    MagicInputLifecycle,
    MagicInputLift,
    MagicInputRainbow,
    MagicInputResult,
    MagicTabAnatomy,
    MagicTabLift,
    MagicTabRainbow,
    MagicTabResult,
    MagneticParallax,
    MagneticPull,
    MagneticResult,
    MarqueeAnatomy,
    MarqueeFade,
    MarqueeResult,
    MarqueeTrack,
    MaskFlipbook,
    MaskResult,
    MaskTwinLabels,
    MegaMenuAnatomy,
    MegaMenuHighlight,
    MegaMenuMorph,
    MegaMenuResult,
    MorphGalleryAnatomy,
    MorphGalleryMorph,
    MorphGalleryResult,
    MorphingDialogAnatomy,
    MorphingDialogBackdrop,
    MorphingDialogResult,
    MorphingDialogSpring,
    MotionScorePanel,
    NotificationInboxAnatomy,
    NotificationInboxBadge,
    NotificationInboxResult,
    NotificationInboxSwipe,
    NumberTickerAnatomy,
    NumberTickerResult,
    NumberTickerSpring,
    NumberTickerView,
    OrbitCarouselAnatomy,
    OrbitCarouselOrbit,
    OrbitCarouselResult,
    OrbitingCirclesAnatomy,
    OrbitingCirclesCounter,
    OrbitingCirclesResult,
    OrbitingCirclesRings,
    OtpAnatomy,
    OtpCaret,
    OtpResult,
    OtpShake,
    ParticleDissolveAnatomy,
    ParticleDissolveCycle,
    ParticleDissolveResult,
    ParticleDissolveTrigger,
    PixelGridAnatomy,
    PixelGridFlicker,
    PixelGridResult,
    PixelGridReveal,
    PresenceFacepileAnatomy,
    PresenceFacepileEnter,
    PresenceFacepileResult,
    PresenceFacepileStatus,
    ProgressFoldResult,
    ProgressiveCardRevealAnatomy,
    ProgressiveCardRevealFunnel,
    ProgressiveCardRevealResult,
    PromptComposerAnatomy,
    PromptComposerChips,
    PromptComposerResult,
    PromptComposerSendMorph,
    PromptSuggestionsAnatomy,
    PromptSuggestionsHover,
    PromptSuggestionsResult,
    PromptSuggestionsStagger,
    PushPhysics,
    RainbowSweep,
    ReorderListAnatomy,
    ReorderListFlow,
    ReorderListResult,
    ResizableHeaderAnatomy,
    ResizableHeaderMorph,
    ResizableHeaderPills,
    ResizableHeaderResult,
    ResultPreview,
    ScrollProgressAnatomy,
    ScrollProgressCircle,
    ScrollProgressResult,
    ScrollProgressSpring,
    ScrollRevealAnatomy,
    ScrollRevealResult,
    ScrollRevealSkew,
    ScrollRevealSpring,
    ScrollScene,
    ScrollStackAnatomy,
    ScrollStackBury,
    ScrollStackResult,
    ScrollTextRevealAnatomy,
    ScrollTextRevealLatch,
    ScrollTextRevealResult,
    ScrollTextRevealScrub,
    ScrollTimelineAnatomy,
    ScrollTimelineResult,
    ScrollTimelineScrub,
    ScrollTimelineSpring,
    SegmentedControlAnatomy,
    SegmentedControlResult,
    SegmentedControlSlide,
    ShimmerLayers,
    ShimmerResult,
    ShimmerSpeed,
    SlideAnatomy,
    SlideConfirmResult,
    SlideThreshold,
    SourceCitationsAnatomy,
    SourceCitationsList,
    SourceCitationsResult,
    SourceCitationsTooltip,
    SpinViewerAnatomy,
    SpinViewerDrag,
    SpinViewerResult,
    SpotlightCardAnatomy,
    SpotlightCardBorder,
    SpotlightCardFollow,
    SpotlightCardResult,
    SpotlightRevealAnatomy,
    SpotlightRevealFollow,
    SpotlightRevealMask,
    SpotlightRevealResult,
    StackBadgeAnatomy,
    StackBadgeResult,
    StackBadgeStagger,
    StepperAnatomy,
    StepperProgress,
    StepperResult,
    StickyScrollAnatomy,
    StickyScrollIo,
    StickyScrollResult,
    StoreBadgeAnatomy,
    StoreBadgeResult,
    StoreBadgeSheen,
    SwipeDeckAnatomy,
    SwipeDeckFling,
    SwipeDeckResult,
    TabBarAnatomy,
    TabBarBlob,
    TabBarPop,
    TabBarResult,
    TerminalAnatomy,
    TerminalLifecycle,
    TerminalResult,
    TerminalTyping,
    TextAnimateAnatomy,
    TextAnimatePresets,
    TextAnimateResult,
    TextAnimateStagger,
    TextScrambleAnatomy,
    TextScrambleCycle,
    TextScrambleResult,
    TextScrambleTrigger,
    ThreeDMarqueeAnatomy,
    ThreeDMarqueeBob,
    ThreeDMarqueeResult,
    TiltCardAnatomy,
    TiltCardResult,
    TiltCardSpring,
    ToastAnatomy,
    ToastExpand,
    ToastResult,
    ToastSwipe,
    TopographicDriftAnatomy,
    TopographicDriftDrift,
    TopographicDriftMarch,
    TopographicDriftResult,
    VoiceOrbAmpSplit,
    VoiceOrbAnatomy,
    VoiceOrbResult,
    VoiceOrbStates,
    WarpStarfieldAnatomy,
    WarpStarfieldParallax,
    WarpStarfieldResult,
    WarpStarfieldWarp,
    WorldMapAnatomy,
    WorldMapDraw,
    WorldMapPulse,
    WorldMapResult,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
