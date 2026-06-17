"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { DocsPanel, DocsTabs } from "@/components/docs-tabs";
import { cn } from "@/lib/cn";
import { formatCode } from "@/lib/format-code";

type ComponentPreviewProps = {
  children: ReactNode;
  code: string;
  lang?: string;
  className?: string;
};

export function ComponentPreview({
  children,
  code,
  lang = "tsx",
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
    <DocsPanel className="my-8">
      <DocsTabs
        tabs={[
          { value: "preview", label: "Preview" },
          { value: "code", label: "Code" },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div
        className={cn(
          "component-preview-frame mt-4 overflow-hidden rounded-xl border border-fd-border bg-fd-card",
          className,
        )}
      >
        {tab === "preview" ? (
          <div className="component-preview-canvas relative flex min-h-[280px] items-center justify-center p-10 md:min-h-[320px]">
            <button
              type="button"
              onClick={() => setReplayKey((key) => key + 1)}
              aria-label="Replay animation"
              title="Replay"
              className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-md border border-fd-border bg-fd-background text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
            <div key={replayKey} className="contents">
              {children}
            </div>
          </div>
        ) : (
          <DynamicCodeBlock
            lang={lang}
            code={formattedCode}
            codeblock={{
              allowCopy: true,
              className:
                "component-preview-code my-0 rounded-none border-0 shadow-none",
            }}
          />
        )}
      </div>
    </DocsPanel>
  );
}
