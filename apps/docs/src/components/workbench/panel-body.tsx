"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { DocsBody } from "fumadocs-ui/layouts/docs/page";
import { Code2, FileText, GraduationCap, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { Segmented } from "@/components/docs-tabs";
import { cn } from "@/lib/cn";
import { formatCode } from "@/lib/format-code";

export type DrawerTab = "docs" | "code" | "learn";

/**
 * Shared inner surface for both the mobile bottom sheet (`StageDrawer`) and the
 * desktop right rail (`StagePanel`): the Docs/Code/Learn tab bar, a close button,
 * and the scrollable content (line-numbered code box or `DocsBody`). The two
 * shells differ only in how they position + animate this body.
 */
export function PanelBody({
  open,
  onClose,
  tab,
  onTabChange,
  hasCode,
  docs,
  code,
  lang = "tsx",
  learn,
}: {
  open: boolean;
  onClose: () => void;
  tab: DrawerTab;
  onTabChange: (tab: DrawerTab) => void;
  hasCode: boolean;
  docs: ReactNode;
  code: string;
  lang?: string;
  learn?: ReactNode;
}) {
  const [formatted, setFormatted] = useState(() => code.trim());

  useEffect(() => {
    let active = true;
    void formatCode(code, lang).then((next) => {
      if (active) setFormatted(next);
    });
    return () => {
      active = false;
    };
  }, [code, lang]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const tabs = [
    {
      value: "docs",
      label: "Docs",
      icon: <FileText className="size-3.5" aria-hidden />,
    },
    ...(hasCode
      ? [
          {
            value: "code",
            label: "Code",
            icon: <Code2 className="size-3.5" aria-hidden />,
          },
        ]
      : []),
    ...(learn
      ? [
          {
            value: "learn",
            label: "Learn",
            icon: <GraduationCap className="size-3.5" aria-hidden />,
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2.5">
        <Segmented
          tabs={tabs}
          value={tab}
          onChange={(v) => onTabChange(v as DrawerTab)}
        />
        <button
          type="button"
          aria-label="Close panel"
          onClick={onClose}
          className="inline-flex size-8 items-center justify-center rounded-[10px] border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:text-fd-foreground active:scale-95"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {tab === "code" && hasCode ? (
          <div className="p-4 sm:p-5">
            <div className="workbench-code relative overflow-hidden rounded-xl border border-fd-border bg-[var(--code-block,var(--color-fd-card))]">
              <CopyButton
                value={formatted}
                className="absolute top-2.5 right-2.5 z-10 rounded-[10px] bg-fd-card/80 backdrop-blur-sm"
              />
              <DynamicCodeBlock
                lang={lang}
                code={formatted}
                codeblock={{
                  allowCopy: false,
                  className: cn(
                    "my-0 rounded-none border-0 bg-transparent shadow-none",
                  ),
                }}
              />
            </div>
          </div>
        ) : tab === "learn" && learn ? (
          <DocsBody className="px-5 pt-1 pb-8">{learn}</DocsBody>
        ) : (
          <DocsBody className="px-5 pt-1 pb-8">{docs}</DocsBody>
        )}
      </div>
    </>
  );
}
