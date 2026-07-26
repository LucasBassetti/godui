"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Monitor, Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { BorderBeam } from "@/components/border-beam";
import { CopyButton } from "@/components/copy-button";
import { DocsPanel, Segmented } from "@/components/docs-tabs";
import { PreviewFrame } from "@/components/preview-frame";
import { ReplayButton } from "@/components/replay-button";
import { cn } from "@/lib/cn";
import { formatCode } from "@/lib/format-code";

type ComponentPreviewProps = {
  children: ReactNode;
  code: string;
  lang?: string;
  /** Optional filename shown in the example bar, e.g. "App.tsx". */
  file?: string;
  /**
   * Storybook docs id for this component, e.g. "ai-promptcomposer".
   * When set, a "Playground" link to the live Storybook page is shown.
   */
  story?: string;
  /**
   * When true the demo fills the preview canvas edge-to-edge instead of sitting
   * centered in a padded box. Use for full-bleed UI (docks, nav bars, heroes).
   */
  fullWidth?: boolean;
  className?: string;
};

type ViewMode = "desktop" | "mobile";

const STORYBOOK_URL = "https://storybook.godui.design";

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3"
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

function PlaygroundLink({ story }: { story: string }) {
  return (
    <a
      href={`${STORYBOOK_URL}/?path=/docs/${story}--docs`}
      target="_blank"
      rel="noreferrer"
      title="Open the interactive playground in Storybook"
      // Hidden on mobile (no Storybook playground there); shown from sm up.
      className="hidden h-8 items-center gap-1.5 rounded-[10px] border border-fd-border bg-fd-card px-2.5 font-medium text-fd-muted-foreground text-xs transition-colors hover:border-fd-primary/45 hover:text-fd-primary sm:inline-flex"
    >
      Playground
      <ExternalIcon />
    </a>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (next: ViewMode) => void;
}) {
  const options: { value: ViewMode; label: string; Icon: typeof Monitor }[] = [
    { value: "desktop", label: "Desktop view", Icon: Monitor },
    { value: "mobile", label: "Mobile view", Icon: Smartphone },
  ];
  const activeIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === view),
  );

  return (
    // bg-fd-muted is aliased to muted-foreground in the GodUI theme (renders as a
    // heavy block), so use the real --muted track + raised --card active segment,
    // matching <Segmented>.
    <div
      className="relative hidden h-8 rounded-[10px] border border-fd-border bg-[var(--muted)] p-[3px] md:inline-grid"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      {/* Floating thumb that slides under the active segment, matching <Segmented>. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-[3px] left-[3px] rounded-[6px] bg-[var(--card)] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{
          width: `calc((100% - 6px) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map(({ value, label, Icon }) => {
        const active = view === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={cn(
              "relative z-[1] inline-flex size-6 items-center justify-center rounded-[6px] transition-colors",
              active
                ? "text-[var(--foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

export function ComponentPreview({
  children,
  code,
  lang = "tsx",
  file,
  story,
  fullWidth = false,
  className,
}: ComponentPreviewProps) {
  const [tab, setTab] = useState("preview");
  const [view, setView] = useState<ViewMode>("desktop");
  const [replayKey, setReplayKey] = useState(0);
  const [formattedCode, setFormattedCode] = useState(() => code.trim());

  useEffect(() => {
    let active = true;

    void formatCode(code, lang).then((next) => {
      if (active) {
        setFormattedCode(next);
      }
    });

    return () => {
      active = false;
    };
  }, [code, lang]);

  return (
    <DocsPanel
      className={cn(
        "component-preview relative my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card",
        className,
      )}
    >
      <BorderBeam play={replayKey} />
      <div className="component-preview-bar flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <Segmented
          tabs={[
            { value: "preview", label: "Preview" },
            { value: "code", label: "Code" },
          ]}
          value={tab}
          onChange={setTab}
        />
        {file ? (
          <span className="font-mono text-fd-muted-foreground text-xs">
            {file}
          </span>
        ) : null}
        <div className="ms-auto flex items-center gap-2">
          {tab === "preview" ? (
            <ViewToggle view={view} onChange={setView} />
          ) : null}
          {story ? <PlaygroundLink story={story} /> : null}
          {tab === "preview" ? (
            <ReplayButton onReplay={() => setReplayKey((key) => key + 1)} />
          ) : (
            <CopyButton value={formattedCode} className="rounded-[10px]" />
          )}
        </div>
      </div>

      {tab === "preview" ? (
        <div
          className={cn(
            "component-preview-canvas relative flex min-h-[360px] flex-col items-center justify-center md:min-h-[460px]",
            view === "mobile" ? "p-6" : fullWidth ? "p-0" : "p-6 md:p-10",
          )}
        >
          {view === "mobile" ? (
            <PreviewFrame key={replayKey} fullWidth={fullWidth}>
              {children}
            </PreviewFrame>
          ) : (
            <div
              key={replayKey}
              className={cn(
                "flex w-full max-w-full",
                fullWidth
                  ? "flex-1 flex-col self-stretch"
                  : "items-center justify-center",
              )}
            >
              {children}
            </div>
          )}
        </div>
      ) : (
        <DynamicCodeBlock
          lang={lang}
          code={formattedCode}
          codeblock={{
            allowCopy: false,
            className:
              "component-preview-code my-0 rounded-none border-0 shadow-none",
          }}
        />
      )}
    </DocsPanel>
  );
}
