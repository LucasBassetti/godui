"use client";

import {
  Check,
  ChevronDown,
  Code2,
  FileText,
  GraduationCap,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
} from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CopyButton } from "@/components/copy-button";
import { ScrollableSegmented, Segmented } from "@/components/docs-tabs";
import { ReplayButton } from "@/components/replay-button";
import type { ExampleProps } from "@/components/workbench/example";
import type { DrawerTab } from "@/components/workbench/panel-body";
import { Stage, type StageView } from "@/components/workbench/stage";
import {
  StageCopyProvider,
  useStageCopy,
} from "@/components/workbench/stage-copy-context";
import { StageDrawer } from "@/components/workbench/stage-drawer";
import { StagePanel } from "@/components/workbench/stage-panel";
import { TitleChip } from "@/components/workbench/title-chip";
import { useWorkbenchMeta } from "@/components/workbench/workbench-context";
import { cn } from "@/lib/cn";
import { useSidePanelFit } from "@/lib/use-side-panel-fit";

const STORYBOOK_URL = "https://storybook.godui.design";

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
  const { learnHref, docsHref, learn, initialDrawerTab } = useWorkbenchMeta();
  const fitsSide = useSidePanelFit();
  // Present when the active demo is a "static" showcase (embedded background):
  // the rail shows a copy button instead of the Code icon and hides replay.
  const { copyValue } = useStageCopy();

  const [activeIndex, setActiveIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [view, setView] = useState<StageView>("desktop");
  const [fullscreen, setFullscreen] = useState(false);
  // Deep-link routes (`…/learn`) carry initialDrawerTab — open the drawer to it
  // from the start via lazy initial state (rather than a mount effect that sets
  // state, which cascades an extra render).
  const [drawerOpen, setDrawerOpen] = useState(() => Boolean(initialDrawerTab));
  const [drawerTab, setDrawerTab] = useState<DrawerTab>(
    () => initialDrawerTab ?? "docs",
  );

  // The `…/learn` route sets initialDrawerTab; used to shape the AEO mirror
  // (learn body on the learn URL, docs + code on the component URL).
  const isLearnRoute = initialDrawerTab === "learn";

  const active = examples[Math.min(activeIndex, examples.length - 1)];
  // Playground points at the component's Storybook page (component-level), so keep
  // it constant across example tabs — the whole dock nav stays stable.
  const story = active?.story ?? examples.find((e) => e.story)?.story;
  const code = active?.code ?? "";
  const hasCode = code.trim().length > 0;

  const replay = () => setReplayKey((k) => k + 1);
  const selectExample = (index: number) => {
    setActiveIndex(index);
    replay();
  };

  // Reflect the Learn drawer in the URL (shallow — no navigation): the Learn tab
  // pushes `…/learn`, every other tab / closing restores the base docs route.
  const syncUrl = useCallback(
    (tab: DrawerTab | null) => {
      const target = tab === "learn" && learnHref ? learnHref : docsHref;
      if (target && window.location.pathname !== target) {
        window.history.pushState(null, "", target);
      }
    },
    [learnHref, docsHref],
  );

  const openDrawer = (tab: DrawerTab) => {
    setDrawerTab(tab);
    setDrawerOpen(true);
    syncUrl(tab);
  };
  const changeDrawerTab = (tab: DrawerTab) => {
    setDrawerTab(tab);
    syncUrl(tab);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    syncUrl(null);
  };
  const toggleCode = () => {
    if (drawerOpen && drawerTab === "code") {
      closeDrawer();
    } else {
      openDrawer("code");
    }
  };

  // Back button closes the drawer instead of leaving the page.
  useEffect(() => {
    if (!drawerOpen) return;
    const onPop = () => setDrawerOpen(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [drawerOpen]);

  // Deep-link support: on the `…/learn` route (initialDrawerTab set) the drawer
  // starts open on that tab (lazy initial state above); this effect just scrolls
  // to the URL hash section within it — so refreshing `…/learn#motion-score`
  // lands on that section.
  useEffect(() => {
    if (!initialDrawerTab) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Wait for the open spring + drawer content to lay out before scrolling.
    const t = window.setTimeout(() => {
      // Scope to the visible docs surface — the off-screen AEO mirror duplicates
      // these ids, and it sits earlier in the DOM, so a bare getElementById would
      // resolve to the hidden copy.
      const surface = document.querySelector("[data-wb-surface]");
      const el =
        surface?.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`) ??
        document.getElementById(id);
      el?.scrollIntoView({ block: "start" });
    }, 420);
    return () => window.clearTimeout(t);
    // Runs once on mount; initialDrawerTab is stable for the page.
  }, [initialDrawerTab]);

  return (
    <div
      className={cn(
        "workbench-root flex flex-col overflow-hidden bg-fd-background",
        fullscreen
          ? "fixed inset-0 z-50"
          : "relative h-[calc(100dvh-3.5rem)] p-3 sm:p-4",
      )}
    >
      {/* AEO mirror — the visible docs live in a body-portaled panel (desktop)
          or a translated drawer, which the aeo.js AI view can't reliably read.
          This always-present, off-screen copy sits inside the <article> the widget
          scans (it skips only display:none / visibility:hidden), so the AI page
          shows the full docs + code on the component URL and the full learn on the
          learn URL — regardless of whether the drawer is open. aria-hidden keeps
          it out of the human a11y tree; `sr-only` keeps textContent readable. */}
      <div className="sr-only" aria-hidden data-aeo-mirror>
        {isLearnRoute ? (
          learn
        ) : (
          <>
            {docs}
            {examples.map((ex, i) =>
              ex.code?.trim() ? (
                <pre key={ex.label ?? i}>
                  <code>{ex.code}</code>
                </pre>
              ) : null,
            )}
          </>
        )}
      </div>

      {/* Bounded stage frame — the demo lives inside a defined surface, and all
          chrome anchors to THIS frame's corners (not the viewport), so the empty
          canvas reads as intentional instead of a void. */}
      <div
        className={cn(
          "stage-frame relative flex min-h-0 flex-1 flex-col overflow-hidden bg-fd-background",
          fullscreen
            ? ""
            : "rounded-[20px] border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.10)]",
        )}
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
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-fd-background/90 via-fd-background/60 to-transparent"
        />

        {/* Identity chip — top-left */}
        <div className="absolute top-4 left-4 z-20">
          <TitleChip />
        </div>

        {/* Control rail — top-right. Stage controls (replay / viewport) then the
          content group (Docs / Learn / Code / Playground) then Fullscreen, all
          icon-only bordered chips. Wraps on very narrow desktops. */}
        <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center justify-end gap-1.5">
          {/* Static showcases (embedded background) have nothing to replay. */}
          {copyValue === null ? <ReplayButton onReplay={replay} /> : null}
          <Segmented
            className="max-md:hidden"
            iconOnly
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
          <ToolButton
            label="Docs"
            active={drawerOpen && drawerTab === "docs"}
            onClick={() =>
              drawerOpen && drawerTab === "docs"
                ? closeDrawer()
                : openDrawer("docs")
            }
          >
            <FileText className="size-4" aria-hidden />
          </ToolButton>
          {copyValue !== null ? (
            // Static showcase: the Code icon becomes a copy button for the live
            // variant snippet (updates as the user switches backgrounds).
            <CopyButton value={copyValue} className="size-8 rounded-[10px]" />
          ) : (
            <ToolButton
              label="View code"
              active={drawerOpen && drawerTab === "code"}
              disabled={!hasCode}
              onClick={toggleCode}
            >
              <Code2 className="size-4" aria-hidden />
            </ToolButton>
          )}
          {learn ? (
            <ToolButton
              label="Learn"
              active={drawerOpen && drawerTab === "learn"}
              onClick={() =>
                drawerOpen && drawerTab === "learn"
                  ? closeDrawer()
                  : openDrawer("learn")
              }
            >
              <GraduationCap className="size-4" aria-hidden />
            </ToolButton>
          ) : null}
          {story ? (
            <a
              href={`${STORYBOOK_URL}/?path=/docs/${story}--docs`}
              target="_blank"
              rel="noreferrer"
              aria-label="Playground"
              title="Playground"
              className="inline-flex size-8 items-center justify-center rounded-[10px] border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:text-fd-foreground active:scale-95"
            >
              <PlaygroundIcon />
            </a>
          ) : null}
          <RailDivider />
          <ToolButton
            label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            active={fullscreen}
            onClick={() => setFullscreen((f) => !f)}
          >
            {fullscreen ? (
              <Minimize2 className="size-4" aria-hidden />
            ) : (
              <Maximize2 className="size-4" aria-hidden />
            )}
          </ToolButton>
        </div>

        {/* Bottom cluster — example variant tabs, centered. */}
        {examples.length > 1 ? (
          <div className="-translate-x-1/2 absolute bottom-5 left-1/2 z-20 flex w-[calc(100%-1.25rem)] flex-col items-center sm:w-auto sm:max-w-[calc(100%-2rem)]">
            {/* Mobile: dropdown (equal-width tabs get cramped on narrow screens). */}
            <div className="w-full sm:hidden">
              <ExampleSelect
                items={examples.map((ex, i) => ex.label ?? `Example ${i + 1}`)}
                value={Math.min(activeIndex, examples.length - 1)}
                onSelect={selectExample}
              />
            </div>
            {/* Desktop: a segmented tab strip. Few variants → equal-width
                <Segmented>. Many (e.g. combobox) would collide/overflow, so use
                a horizontally-scrollable, content-width strip instead of a lone
                dropdown. Wrappers control visibility — Segmented's own
                `inline-grid` would beat a `hidden` on the control itself. */}
            {examples.length > 5 ? (
              <div className="hidden max-w-full sm:block">
                <ScrollableSegmented
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

        {/* Enough side slack → full-height right rail that slides the whole app
            left (no resize); otherwise a bottom sheet inside the stage. One
            instance (measured, not both) so the docs DOM exists once (aeo.js +
            #hash anchors). */}
        {fitsSide ? (
          <StagePanel
            open={drawerOpen}
            onOpenChange={(o) => (o ? setDrawerOpen(true) : closeDrawer())}
            tab={drawerTab}
            onTabChange={changeDrawerTab}
            hasCode={hasCode}
            docs={docs}
            code={code}
            lang={active?.lang}
            learn={learn}
          />
        ) : (
          <StageDrawer
            open={drawerOpen}
            onOpenChange={(o) => (o ? setDrawerOpen(true) : closeDrawer())}
            tab={drawerTab}
            onTabChange={changeDrawerTab}
            hasCode={hasCode}
            docs={docs}
            code={code}
            lang={active?.lang}
            learn={learn}
          />
        )}
      </div>
    </div>
  );
}

function RailDivider() {
  return <span aria-hidden className="mx-0.5 h-5 w-px bg-fd-border" />;
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
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-[10px] border transition-colors active:scale-95 disabled:pointer-events-none disabled:opacity-40",
        active
          ? "border-fd-primary/45 bg-fd-primary/10 text-fd-primary"
          : "border-fd-border bg-fd-card text-fd-muted-foreground hover:text-fd-foreground",
      )}
    >
      {children}
    </button>
  );
}

function PlaygroundIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
