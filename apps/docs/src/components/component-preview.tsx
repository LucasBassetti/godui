"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Monitor, Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CopyButton } from "@/components/copy-button";
import { DocsPanel, Segmented } from "@/components/docs-tabs";
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
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-fd-border bg-fd-card px-2.5 font-medium text-fd-muted-foreground text-xs transition-colors hover:border-fd-primary/45 hover:text-fd-primary"
    >
      Playground
      <ExternalIcon />
    </a>
  );
}

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="6.5 5 14 14"
      className="size-3"
      fill="currentColor"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
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

  return (
    // bg-fd-muted is aliased to muted-foreground in the GodUI theme (renders as a
    // heavy block), so use the real --muted track + raised --card active segment,
    // matching <Segmented>.
    <div className="hidden h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] p-[3px] md:inline-flex">
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
              "inline-flex size-6 items-center justify-center rounded-[6px] transition-colors",
              active
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
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

/**
 * Renders the demo inside an <iframe> so real CSS media queries fire against the
 * frame's width — the only way to simulate mobile for components that ship
 * viewport breakpoints (`md:` etc.) internally. Used for the "mobile" view only;
 * desktop renders in-page (cheaper). Parent stylesheets + theme class are cloned
 * into the frame and the demo is portaled into its body.
 */
function PreviewFrame({
  children,
  fullWidth,
}: {
  children: ReactNode;
  fullWidth: boolean;
}) {
  const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(440);

  useEffect(() => {
    if (!frame) return;
    const doc = frame.contentDocument;
    if (!doc) return;

    const syncTheme = () => {
      doc.documentElement.className = document.documentElement.className;
      doc.documentElement.setAttribute(
        "style",
        document.documentElement.getAttribute("style") ?? "",
      );
    };

    // Clone parent stylesheets (Tailwind, fonts) into the frame.
    for (const node of document.head.querySelectorAll(
      'style, link[rel="stylesheet"]',
    )) {
      doc.head.appendChild(node.cloneNode(true));
    }
    syncTheme();
    doc.body.style.margin = "0";
    doc.body.style.background = "transparent";
    setMount(doc.body);

    const ro = new ResizeObserver(() => {
      setHeight(Math.max(360, doc.body.scrollHeight));
    });
    ro.observe(doc.body);
    const mo = new MutationObserver(syncTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [frame]);

  return (
    <>
      <iframe
        ref={setFrame}
        title="Mobile preview"
        className="w-[360px] max-w-full overflow-hidden rounded-[28px] border-[6px] border-fd-border bg-fd-background shadow-md transition-[height] duration-200"
        style={{ height }}
      />
      {mount
        ? createPortal(
            <div
              className={cn(
                "flex w-full",
                fullWidth
                  ? "flex-col"
                  : "min-h-[440px] items-center justify-center p-4",
              )}
            >
              {children}
            </div>,
            mount,
          )
        : null}
    </>
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
        "component-preview my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-xs",
        className,
      )}
    >
      <div className="component-preview-bar flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <Segmented
          tabs={[
            { value: "preview", label: "Preview", icon: <PlayIcon /> },
            { value: "code", label: "Code", icon: <CodeIcon /> },
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
          {story ? <PlaygroundLink story={story} /> : null}
          {tab === "preview" ? (
            <ViewToggle view={view} onChange={setView} />
          ) : null}
          {tab === "preview" ? (
            <button
              type="button"
              onClick={() => setReplayKey((key) => key + 1)}
              aria-label="Replay animation"
              title="Replay"
              className="inline-flex size-8 items-center justify-center rounded-md border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          ) : (
            <CopyButton
              value={formattedCode}
              className="border border-fd-border bg-fd-card hover:border-fd-primary/45 hover:bg-transparent hover:text-fd-primary"
            />
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
