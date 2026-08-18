"use client";

import {
  CompactMultiButton,
  MultiButton,
  type MultiButtonItem,
} from "@godui/components";
import {
  Archive,
  Bookmark,
  Copy,
  Download,
  EllipsisVertical,
  Eye,
  MessageSquare,
  MoreHorizontal,
  Share2,
  Trash2,
} from "lucide-react";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { Segmented } from "@/components/docs-tabs";

const ACTION_DEFINITIONS = [
  { id: "review", icon: Eye, label: "Review" },
  { id: "download", icon: Download, label: "Download" },
  { id: "share", icon: Share2, label: "Share" },
  { id: "archive", icon: Archive, label: "Archive" },
  { id: "duplicate", icon: Copy, label: "Duplicate" },
  { id: "comment", icon: MessageSquare, label: "Comment" },
  { id: "save", icon: Bookmark, label: "Save" },
  { id: "delete", icon: Trash2, label: "Delete" },
] satisfies Omit<MultiButtonItem, "onClick">[];

export function MultiButtonDemo() {
  const [selected, setSelected] = useState("review");
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [treatment, setTreatment] = useState<"original" | "gooey">("original");
  const [optionCount, setOptionCount] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);
  const maxOptions = isMobile ? 4 : 8;
  const gooey = treatment === "gooey";
  const visibleDefinitions = ACTION_DEFINITIONS.slice(0, optionCount);
  const items: MultiButtonItem[] = visibleDefinitions.map((item) => ({
    ...item,
    onClick: () => setLastAction(item.label),
  }));

  const compactItems = items.map((item) => ({
    ...item,
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      item.onClick?.(event);
      setSelected(item.id);
    },
  }));
  const selectedLabel =
    items.find((item) => item.id === selected)?.label ?? selected;

  const changeOptionCount = (nextCount: number) => {
    const boundedCount = Math.min(nextCount, maxOptions);
    const nextDefinitions = ACTION_DEFINITIONS.slice(0, boundedCount);
    setOptionCount(boundedCount);
    setSelected((current) =>
      nextDefinitions.some((item) => item.id === current)
        ? current
        : (nextDefinitions[0]?.id ?? current),
    );
  };

  useEffect(() => {
    const view = demoRef.current?.ownerDocument.defaultView ?? window;
    const mediaQuery = view.matchMedia("(max-width: 639px)");
    const syncMobileLimit = () => {
      const mobile = mediaQuery.matches;
      setIsMobile(mobile);
      if (!mobile) return;

      setOptionCount((current) => Math.min(current, 4));
      setSelected((current) =>
        ACTION_DEFINITIONS.slice(0, 4).some((item) => item.id === current)
          ? current
          : ACTION_DEFINITIONS[0].id,
      );
    };

    syncMobileLimit();
    mediaQuery.addEventListener("change", syncMobileLimit);
    view.addEventListener("resize", syncMobileLimit);
    return () => {
      mediaQuery.removeEventListener("change", syncMobileLimit);
      view.removeEventListener("resize", syncMobileLimit);
    };
  }, []);

  return (
    <div
      ref={demoRef}
      className="flex w-full max-w-[34rem] flex-col items-center gap-8 max-sm:gap-6"
    >
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-6 shadow-xs max-sm:p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MoreHorizontal className="size-3.5" aria-hidden="true" />
          Standard · hover, focus, or tap an action
        </div>
        <div className="no-scrollbar max-w-full overflow-x-auto py-1">
          <MultiButton
            items={items}
            gooey={gooey}
            highlightColor="var(--primary-foreground)"
            size="lg"
            variant="default"
          />
        </div>
        <span
          className="min-h-4 text-xs text-muted-foreground"
          aria-live="polite"
        >
          {lastAction ? `Last action: ${lastAction}` : "Choose an action"}
        </span>
      </div>
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-6 shadow-xs max-sm:p-4">
        <span className="text-xs text-muted-foreground">
          Compact · selected action: {selectedLabel}
        </span>
        <div className="no-scrollbar max-w-full overflow-x-auto py-1">
          <CompactMultiButton
            items={compactItems}
            selectedId={selected}
            restIcon={EllipsisVertical}
            restAriaLabel="Open actions"
            gooey={gooey}
            highlightColor="var(--primary)"
            size="lg"
            variant="outline"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <label className="flex h-10 items-center gap-3 rounded-xl border border-border/70 bg-card/70 px-3 shadow-xs">
          <span className="text-xs text-muted-foreground">Options</span>
          <input
            type="range"
            min={2}
            max={maxOptions}
            step={1}
            value={optionCount}
            onChange={(event) => changeOptionCount(Number(event.target.value))}
            className="w-28 cursor-pointer accent-primary"
            aria-label="Number of Multi Button options"
          />
          <output className="min-w-4 text-center font-medium text-xs tabular-nums">
            {optionCount}
          </output>
        </label>
        <Segmented
          tabs={[
            { value: "original", label: "Original" },
            { value: "gooey", label: "Gooey" },
          ]}
          value={treatment}
          onChange={(value) =>
            setTreatment(value === "gooey" ? "gooey" : "original")
          }
          semantics="radiogroup"
          label="Multi Button motion treatment"
        />
      </div>
    </div>
  );
}
