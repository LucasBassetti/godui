"use client";

import { DocsPanel, DocsTabs } from "@/components/docs-tabs";
import { cn } from "@/lib/cn";
import { formatCode } from "@/lib/format-code";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

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
          <div className="component-preview-canvas flex min-h-[280px] items-center justify-center p-10 md:min-h-[320px]">
            {children}
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
