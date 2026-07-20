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
import { BreadcrumbsAnatomy } from "@/components/learn/breadcrumbs-anatomy";
import { BreadcrumbsCollapse } from "@/components/learn/breadcrumbs-collapse";
import { BreadcrumbsPill } from "@/components/learn/breadcrumbs-pill";
import { BreadcrumbsResult } from "@/components/learn/breadcrumbs-result";
import { ComboboxAnatomy } from "@/components/learn/combobox-anatomy";
import { ComboboxHighlight } from "@/components/learn/combobox-highlight";
import { ComboboxRace } from "@/components/learn/combobox-race";
import { ComboboxResult } from "@/components/learn/combobox-result";
import { ComboboxStagger } from "@/components/learn/combobox-stagger";
import { ContextMenuAnatomy } from "@/components/learn/context-menu-anatomy";
import { ContextMenuFlip } from "@/components/learn/context-menu-flip";
import { ContextMenuResult } from "@/components/learn/context-menu-result";
import { ContextMenuSpring } from "@/components/learn/context-menu-spring";
import { DockAnatomy } from "@/components/learn/dock-anatomy";
import { DockMagnify } from "@/components/learn/dock-magnify";
import { DockResult } from "@/components/learn/dock-result";
import { DropdownMenuAnatomy } from "@/components/learn/dropdown-menu-anatomy";
import { DropdownMenuResult } from "@/components/learn/dropdown-menu-result";
import { DropdownMenuSpring } from "@/components/learn/dropdown-menu-spring";
import { DropdownMenuSubmenu } from "@/components/learn/dropdown-menu-submenu";
import { FilterBarAnatomy } from "@/components/learn/filter-bar-anatomy";
import { FilterBarResult } from "@/components/learn/filter-bar-result";
import { FilterBarSpring } from "@/components/learn/filter-bar-spring";
import { FoldProgress } from "@/components/learn/fold-progress";
import { FoldStages } from "@/components/learn/fold-stages";
import { GooeyFabResult } from "@/components/learn/gooey-fab-result";
import { GooeyFilter } from "@/components/learn/gooey-filter";
import { GooeyLayers } from "@/components/learn/gooey-layers";
import { GooeySpring } from "@/components/learn/gooey-spring";
import { HoldCancel } from "@/components/learn/hold-cancel";
import { HoldConfirmResult } from "@/components/learn/hold-confirm-result";
import { HoldFill } from "@/components/learn/hold-fill";
import { LayerReveal } from "@/components/learn/layer-reveal";
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
import { MaskFlipbook } from "@/components/learn/mask-flipbook";
import { MaskResult } from "@/components/learn/mask-result";
import { MaskTwinLabels } from "@/components/learn/mask-twin-labels";
import { MegaMenuAnatomy } from "@/components/learn/mega-menu-anatomy";
import { MegaMenuHighlight } from "@/components/learn/mega-menu-highlight";
import { MegaMenuMorph } from "@/components/learn/mega-menu-morph";
import { MegaMenuResult } from "@/components/learn/mega-menu-result";
import { OtpAnatomy } from "@/components/learn/otp-anatomy";
import { OtpCaret } from "@/components/learn/otp-caret";
import { OtpResult } from "@/components/learn/otp-result";
import { OtpShake } from "@/components/learn/otp-shake";
import { ProgressFoldResult } from "@/components/learn/progress-fold-result";
import { PushPhysics } from "@/components/learn/push-physics";
import { RainbowSweep } from "@/components/learn/rainbow-sweep";
import { ResizableHeaderAnatomy } from "@/components/learn/resizable-header-anatomy";
import { ResizableHeaderMorph } from "@/components/learn/resizable-header-morph";
import { ResizableHeaderPills } from "@/components/learn/resizable-header-pills";
import { ResizableHeaderResult } from "@/components/learn/resizable-header-result";
import { ResultPreview } from "@/components/learn/result-preview";
import { ScrollScene } from "@/components/learn/scroll-scene";
import { SegmentedControlAnatomy } from "@/components/learn/segmented-control-anatomy";
import { SegmentedControlResult } from "@/components/learn/segmented-control-result";
import { SegmentedControlSlide } from "@/components/learn/segmented-control-slide";
import { ShimmerLayers } from "@/components/learn/shimmer-layers";
import { ShimmerResult } from "@/components/learn/shimmer-result";
import { ShimmerSpeed } from "@/components/learn/shimmer-speed";
import { SlideAnatomy } from "@/components/learn/slide-anatomy";
import { SlideConfirmResult } from "@/components/learn/slide-confirm-result";
import { SlideThreshold } from "@/components/learn/slide-threshold";
import { TabBarAnatomy } from "@/components/learn/tab-bar-anatomy";
import { TabBarBlob } from "@/components/learn/tab-bar-blob";
import { TabBarPop } from "@/components/learn/tab-bar-pop";
import { TabBarResult } from "@/components/learn/tab-bar-result";
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
    ScrollScene,
    LayerReveal,
    PushPhysics,
    RainbowSweep,
    ResultPreview,
    GooeyLayers,
    GooeyFilter,
    GooeySpring,
    GooeyFabResult,
    HoldFill,
    HoldCancel,
    HoldConfirmResult,
    SlideAnatomy,
    SlideThreshold,
    SlideConfirmResult,
    MagneticPull,
    MagneticParallax,
    MagneticResult,
    MaskTwinLabels,
    MaskFlipbook,
    MaskResult,
    ShimmerLayers,
    ShimmerSpeed,
    ShimmerResult,
    FoldStages,
    FoldProgress,
    ProgressFoldResult,
    MagicInputAnatomy,
    MagicInputLift,
    MagicInputRainbow,
    MagicInputLifecycle,
    MagicInputResult,
    OtpAnatomy,
    OtpCaret,
    OtpShake,
    OtpResult,
    BreadcrumbsAnatomy,
    BreadcrumbsPill,
    BreadcrumbsCollapse,
    BreadcrumbsResult,
    ComboboxAnatomy,
    ComboboxStagger,
    ComboboxHighlight,
    ComboboxRace,
    ComboboxResult,
    ContextMenuAnatomy,
    ContextMenuSpring,
    ContextMenuFlip,
    ContextMenuResult,
    DockAnatomy,
    DockMagnify,
    DockResult,
    DropdownMenuAnatomy,
    DropdownMenuSpring,
    DropdownMenuSubmenu,
    DropdownMenuResult,
    FilterBarAnatomy,
    FilterBarSpring,
    FilterBarResult,
    MagicTabAnatomy,
    MagicTabLift,
    MagicTabRainbow,
    MagicTabResult,
    MegaMenuAnatomy,
    MegaMenuHighlight,
    MegaMenuMorph,
    MegaMenuResult,
    ResizableHeaderAnatomy,
    ResizableHeaderMorph,
    ResizableHeaderPills,
    ResizableHeaderResult,
    SegmentedControlAnatomy,
    SegmentedControlSlide,
    SegmentedControlResult,
    TabBarAnatomy,
    TabBarBlob,
    TabBarPop,
    TabBarResult,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
