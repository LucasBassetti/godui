"use client";

import {
  Check,
  ChevronDown,
  Code2,
  FileText,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
} from "lucide-react";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ScrollableSegmented, Segmented } from "@/components/docs-tabs";
import { ReplayButton } from "@/components/replay-button";
import { CodePane } from "@/components/workbench/code-pane";
import { DocsPane } from "@/components/workbench/docs-pane";
import type { ExampleProps } from "@/components/workbench/example";
import { Stage, type StageView } from "@/components/workbench/stage";
import {
  StageCopyProvider,
  useStageCopy,
} from "@/components/workbench/stage-copy-context";
import { TitleChip } from "@/components/workbench/title-chip";
import { useWorkbenchMeta } from "@/components/workbench/workbench-context";
import { cn } from "@/lib/cn";
import { useCodePaneToggle, useDocsPaneToggle } from "@/lib/use-pane-toggle";
import { useWorkbenchShortcuts } from "@/lib/use-workbench-shortcuts";

const STORYBOOK_URL = "https://storybook.godui.design";

/** URL-safe id for an example, used by `?ex=`. Falls back to the index. */
function exampleSlug(example: ExampleProps | undefined, index: number): string {
  const label = example?.label?.trim();
  if (!label) return String(index);
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || String(index)
  );
}

/**
 * The interactive workbench shell. Receives the already-partitioned `examples`
 * (stage tabs) and `docs` (drawer body) from the server <Workbench>, which does
 * the partitioning where `child.type === Example` reliably matches (client
 * references don't survive the server → client boundary as `===`).
 */
export function WorkbenchClient(props: {
  examples: ExampleProps[];
  docs: ReactNode;
}) {
  // Provider wraps the shell so a stage component (embedded BackgroundShowcase)
  // can publish a live snippet the rail's copy button reads.
  return (
    <StageCopyProvider>
      <WorkbenchInner {...props} />
    </StageCopyProvider>
  );
}

function WorkbenchInner({
  examples,
  docs,
}: {
  examples: ExampleProps[];
  docs: ReactNode;
}) {
  const { learnHref } = useWorkbenchMeta();
  // Present when the active demo is a "static" showcase (an embedded background
  // switcher): it publishes the live snippet, and there's nothing to replay.
  const { copyValue } = useStageCopy();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageFrameRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [view, setView] = useState<StageView>("desktop");
  const [fullscreen, setFullscreen] = useState(false);
  // Pane open/closed lives on <html> (set by the pre-hydration prefs script), so
  // CSS has it before first paint and React reads the same source instead of
  // keeping a copy that can disagree.
  const [paneOpen, setPaneOpen] = useDocsPaneToggle();
  const [codeOpen, setCodeOpen] = useCodePaneToggle();
  // Fullscreen means "show me the component" — collapse the pane while it lasts
  // and give the user back whatever they had when they exit.
  const paneBeforeFullscreen = useRef(true);

  const active = examples[Math.min(activeIndex, examples.length - 1)];
  // Playground points at the component's Storybook page (component-level), so keep
  // it constant across example tabs — the whole dock nav stays stable.
  const story = active?.story ?? examples.find((e) => e.story)?.story;
  const playgroundHref = story
    ? `${STORYBOOK_URL}/?path=/docs/${story}--docs`
    : undefined;
  // Static showcases (an embedded background switcher) have no <Example code>;
  // they publish the live snippet through StageCopyProvider instead. Either way
  // the code pane has one source of truth.
  const code = active?.code?.trim() ? active.code : (copyValue ?? "");
  const hasCode = code.trim().length > 0;

  const replay = () => setReplayKey((k) => k + 1);
  const selectExample = (index: number) => {
    setActiveIndex(index);
    replay();
    // Shareable: `?ex=stronger-pull` reopens on the same variant. Slug, not
    // index, so inserting an <Example> doesn't invalidate every link. Always
    // replaceState — synthetic history entries would make Back mean "previous
    // example", which is not what a back button means.
    const url = new URL(window.location.href);
    const slug = exampleSlug(examples[index], index);
    if (index === 0) url.searchParams.delete("ex");
    else url.searchParams.set("ex", slug);
    window.history.replaceState(null, "", url);
  };

  // Apply `?ex=` before paint so the correct variant is the first thing drawn.
  // This has to be a mount-time correction rather than lazy initial state: the
  // server can't read searchParams without making all 108 pages dynamic, so
  // seeding it during render would mean the SSR HTML and the first client render
  // disagree about which example is on stage. One extra pre-paint render is the
  // cheaper trade, and it only ever happens on a shared `?ex=` link.
  useLayoutEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("ex");
    if (!wanted) return;
    const index = examples.findIndex((ex, i) => exampleSlug(ex, i) === wanted);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate one-shot mount correction; see above
    if (index > 0) setActiveIndex(index);
  }, [examples]);

  const closeDocs = () => setPaneOpen(false);
  const toggleFullscreen = () => {
    setFullscreen((wasFullscreen) => {
      if (wasFullscreen) {
        setPaneOpen(paneBeforeFullscreen.current);
      } else {
        paneBeforeFullscreen.current = paneOpen;
        setPaneOpen(false);
      }
      return !wasFullscreen;
    });
  };

  useWorkbenchShortcuts({
    toggleDocs: () => setPaneOpen(!paneOpen),
    toggleCode: () => hasCode && setCodeOpen(!codeOpen),
    replay,
    toggleFullscreen,
    toggleView: () => setView(view === "desktop" ? "mobile" : "desktop"),
    prevExample: () =>
      examples.length > 1 &&
      selectExample((activeIndex - 1 + examples.length) % examples.length),
    nextExample: () =>
      examples.length > 1 && selectExample((activeIndex + 1) % examples.length),
    // Unwind one layer at a time, outermost first.
    escape: () => {
      if (fullscreen) toggleFullscreen();
      else if (codeOpen) setCodeOpen(false);
    },
  });

  return (
    <div
      ref={rootRef}
      className={cn(
        "workbench-root overflow-hidden bg-fd-background",
        fullscreen
          ? "fixed inset-0 z-50"
          : "relative h-[calc(100dvh-3.5rem)] p-3 sm:p-4",
      )}
    >
      {/* Source mirror for the examples the code pane isn't showing.
          The prose needs no mirror any more — <DocsPane> is real, server-rendered
          DOM inside the <article> that aeo.js and crawlers scan. Example source
          still does: the pane holds one variant at a time, so the others would be
          missing from the AI view and the built HTML. `sr-only`, not `hidden`,
          because the widget skips only display:none / visibility:hidden. */}
      <div className="sr-only" aria-hidden data-aeo-mirror>
        {examples.map((ex, i) =>
          i !== activeIndex && ex.code?.trim() ? (
            <pre key={ex.label ?? i}>
              <code>{ex.code}</code>
            </pre>
          ) : null,
        )}
      </div>

      {/* Bounded stage frame — the demo lives inside a defined surface, and all
          chrome anchors to THIS frame's corners (not the viewport), so the empty
          canvas reads as intentional instead of a void. */}
      <div
        ref={stageFrameRef}
        className={cn(
          "stage-frame relative min-h-0 min-w-0 overflow-hidden bg-fd-background",
          fullscreen
            ? ""
            : "rounded-[20px] border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.10)]",
        )}
      >
        {/* Row 1 — the demo and everything that overlays it. The chrome anchors
            to this box rather than the frame, so opening the code pane below
            moves the example tabs up with the demo instead of burying them. */}
        <div
          id="wb-stage"
          // Only a tabpanel when there is actually a tablist selecting it.
          role={examples.length > 1 ? "tabpanel" : undefined}
          className="relative min-h-0 overflow-hidden"
        >
          <Stage
            view={view}
            bg="default"
            fullWidth={active?.fullWidth ?? false}
            replayKey={replayKey}
          >
            {active?.children}
          </Stage>

          {/* Top scrim — a background-colored gradient fading to transparent so the
            title chip + control rail stay legible over image/full-bleed demos. On
            a plain canvas it's background-over-background (invisible); over imagery
            it restores contrast. Below the chrome (z-20), above the demo. */}
          <div
            aria-hidden
            className="stage-scrim pointer-events-none absolute inset-x-0 top-0 z-10 h-40"
          />

          {/* Chip and rail share ONE flex row rather than being two absolutely
              positioned islands. As separate absolutes neither could see the
              other, so they overlapped on a narrow stage — and capping them with
              percentages only traded that for truncated labels and a rail that
              wrapped with room to spare. In a row the rail takes exactly what it
              needs (shrink-0, no wrap) and the chip gets the rest. */}
          <div className="pointer-events-none absolute inset-x-4 top-4 z-20 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <TitleChip />
            </div>

            {/* Stage controls (replay / viewport), then the content group
                (Docs / Code / Learn / Playground), then Fullscreen.
                The secondary controls stay hidden until `lg`: at 768px the
                sidebar still costs 260px, so revealing all seven here would
                leave the title chip nothing to truncate into. */}
            <div className="pointer-events-auto flex shrink-0 flex-nowrap items-center gap-1.5">
              {/* Static showcases (embedded background) have nothing to replay. */}
              {copyValue === null ? (
                <ReplayButton onReplay={replay} className="max-lg:hidden" />
              ) : null}
              <Segmented
                className="max-lg:hidden"
                iconOnly
                // A viewport switch is a choice between two states, not a set of
                // tab panels — radio is the honest role.
                semantics="radiogroup"
                label="Preview viewport"
                tabs={[
                  {
                    value: "desktop",
                    label: "Desktop",
                    icon: <Monitor className="size-4" aria-hidden />,
                  },
                  {
                    value: "mobile",
                    label: "Mobile",
                    icon: <Smartphone className="size-4" aria-hidden />,
                  },
                ]}
                value={view}
                onChange={(v) => setView(v as StageView)}
              />
              <RailDivider />
              {/* Labelled, not icon-only: with the pane closed by default this is
                the only signpost that the page has documentation at all. */}
              <ToolButton
                label="Docs"
                hint="D"
                active={paneOpen}
                expanded={paneOpen}
                controls="wb-docs-pane"
                onClick={() => setPaneOpen(!paneOpen)}
                wide
              >
                <FileText className="size-4" aria-hidden />
                <span className="font-medium text-[13px]">Docs</span>
              </ToolButton>
              <ToolButton
                label="View code"
                hint="C"
                active={codeOpen}
                expanded={codeOpen}
                controls="wb-code-pane"
                disabled={!hasCode}
                onClick={() => setCodeOpen(!codeOpen)}
              >
                <Code2 className="size-4" aria-hidden />
              </ToolButton>
              {/* Learn and Playground live in the docs pane header, where they
                  can carry text labels — two more unlabelled icons out here
                  read as noise, and Learn was duplicated between the two. */}
              <RailDivider />
              <ToolButton
                label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                hint="F"
                active={fullscreen}
                onClick={toggleFullscreen}
                className="max-lg:hidden"
              >
                {fullscreen ? (
                  <Minimize2 className="size-4" aria-hidden />
                ) : (
                  <Maximize2 className="size-4" aria-hidden />
                )}
              </ToolButton>
            </div>
          </div>

          {/* Bottom cluster — example variant tabs, centered. */}
          {examples.length > 1 ? (
            <div className="-translate-x-1/2 absolute bottom-5 left-1/2 z-20 flex w-[calc(100%-1.25rem)] flex-col items-center sm:w-auto sm:max-w-[calc(100%-2rem)]">
              {/* Mobile: dropdown (equal-width tabs get cramped on narrow screens). */}
              <div className="w-full sm:hidden">
                <ExampleSelect
                  items={examples.map(
                    (ex, i) => ex.label ?? `Example ${i + 1}`,
                  )}
                  value={Math.min(activeIndex, examples.length - 1)}
                  onSelect={selectExample}
                />
              </div>
              {/* Desktop: a segmented tab strip. Few short variants → equal-width
                <Segmented>. 5+ tabs (or long labels) collide in equal columns, so
                use a horizontally-scrollable, content-width strip instead.
                Wrappers control visibility — Segmented's own `inline-grid`
                would beat a `hidden` on the control itself. */}
              {examples.length > 4 ? (
                <div className="hidden max-w-full sm:block">
                  <ScrollableSegmented
                    semantics="tabs"
                    label="Examples"
                    controls="wb-stage"
                    tabs={examples.map((ex, i) => ({
                      value: String(i),
                      label: ex.label ?? `Example ${i + 1}`,
                    }))}
                    value={String(Math.min(activeIndex, examples.length - 1))}
                    onChange={(v) => selectExample(Number(v))}
                  />
                </div>
              ) : (
                <div className="hidden sm:block">
                  <Segmented
                    className="shadow-lg"
                    semantics="tabs"
                    label="Examples"
                    controls="wb-stage"
                    tabs={examples.map((ex, i) => ({
                      value: String(i),
                      label: ex.label ?? `Example ${i + 1}`,
                    }))}
                    value={String(Math.min(activeIndex, examples.length - 1))}
                    onChange={(v) => selectExample(Number(v))}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Row 2 — source for the active example, on screen with it. */}
        <CodePane
          open={codeOpen}
          onClose={() => setCodeOpen(false)}
          code={code}
          lang={active?.lang}
          containerRef={stageFrameRef}
        />
      </div>

      {/* Sheet scrim — mobile only (the desktop pane is a column, not an
          overlay, so it never dims the stage). */}
      <button
        type="button"
        aria-label="Close documentation"
        tabIndex={paneOpen ? 0 : -1}
        onClick={closeDocs}
        className="wb-sheet-scrim hidden cursor-default max-xl:block"
      />

      {/* Second grid column — a sibling of the stage, never an overlay. Below
          48rem the same node is positioned as a bottom sheet (see globals.css). */}
      <DocsPane
        open={paneOpen}
        onOpenChange={setPaneOpen}
        docs={docs}
        learnHref={learnHref}
        playgroundHref={playgroundHref}
        containerRef={rootRef}
      />
    </div>
  );
}

function RailDivider() {
  return (
    <span aria-hidden className="mx-0.5 h-5 w-px bg-fd-border max-lg:hidden" />
  );
}

/**
 * Mobile example picker. A native <select> renders its option list detached and
 * awkwardly positioned near the bottom edge, so this is a custom dropdown that
 * anchors directly above the trigger and matches the dock styling.
 */
function ExampleSelect({
  items,
  value,
  onSelect,
}: {
  items: string[];
  value: number;
  onSelect: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-2xl border border-fd-border bg-fd-card/85 py-2 pr-3 pl-3.5 font-medium text-fd-foreground text-sm shadow-lg backdrop-blur-md active:scale-[0.99]"
      >
        <span className="truncate">{items[value]}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-fd-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        // Opens upward (bottom-full) since the control sits at the screen bottom.
        // Inner radius (xl=12) + p-1 (4) = 16 = the outer 2xl radius (concentric).
        <div
          role="listbox"
          className="absolute bottom-full left-0 z-30 mb-2 max-h-[50vh] w-full overflow-auto rounded-2xl border border-fd-border bg-fd-popover p-1 shadow-xl"
        >
          {items.map((label, i) => (
            <button
              key={label}
              type="button"
              role="option"
              aria-selected={i === value}
              onClick={() => {
                onSelect(i);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                i === value
                  ? "bg-fd-accent font-medium text-fd-foreground"
                  : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground",
              )}
            >
              {label}
              {i === value ? (
                <Check aria-hidden className="size-4 shrink-0" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ToolButton({
  label,
  active,
  expanded,
  controls,
  hint,
  wide,
  disabled,
  onClick,
  children,
  className,
}: {
  label: string;
  active?: boolean;
  /**
   * Set for buttons that reveal a region (the panes). Those are disclosures, so
   * they announce aria-expanded/aria-controls; aria-pressed is reserved for the
   * genuine two-state toggles like fullscreen.
   */
  expanded?: boolean;
  controls?: string;
  /** Keyboard shortcut, surfaced in the tooltip so the bindings are findable. */
  hint?: string;
  /** Renders a text label beside the icon instead of a square icon chip. */
  wide?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={controls ? undefined : active}
      aria-expanded={controls ? expanded : undefined}
      aria-controls={controls}
      title={hint ? `${label} (${hint})` : label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        // `cn` is a plain join, not tailwind-merge — width has to be chosen
        // here rather than overridden by a later class.
        "inline-flex h-8 items-center justify-center rounded-[10px] border transition-colors active:scale-95 disabled:pointer-events-none disabled:opacity-40",
        wide ? "gap-1.5 px-2.5" : "w-8",
        className,
        active
          ? "border-fd-primary/45 bg-fd-primary/10 text-fd-primary"
          : "border-fd-border bg-fd-card text-fd-muted-foreground hover:text-fd-foreground",
      )}
    >
      {children}
    </button>
  );
}
