"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
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
  className?: string;
};

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="2 0 24 24"
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

export function ComponentPreview({
  children,
  code,
  lang = "tsx",
  file,
  className,
}: ComponentPreviewProps) {
  const [tab, setTab] = useState("preview");
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
        <div className="ms-auto">
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
        <div className="component-preview-canvas relative flex min-h-[280px] items-center justify-center p-10 md:min-h-[320px]">
          <div key={replayKey} className="contents">
            {children}
          </div>
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
