"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import { fetchClient } from "fumadocs-core/search/client/fetch";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogListItem,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import {
  BarChart3,
  Bot,
  CornerDownLeft,
  FileText,
  Film,
  GlassWater,
  Image,
  Layers,
  LayoutGrid,
  type LucideIcon,
  MousePointerClick,
  Navigation,
  Rocket,
  Sparkles,
  TextCursorInput,
  Type,
  Users,
} from "lucide-react";
import { Fragment, type ReactNode, useMemo } from "react";
import meta from "../../content/docs/meta.json";

// Per-section icon, picked to echo each section's idea.
const ICON_BY_SECTION: Record<string, LucideIcon> = {
  "Getting Started": Rocket,
  "Motion Guidelines": Film,
  Buttons: MousePointerClick,
  Inputs: TextCursorInput,
  Navigation: Navigation,
  Overlays: Layers,
  Layout: LayoutGrid,
  Text: Type,
  AI: Bot,
  Collaboration: Users,
  Visualizations: BarChart3,
  Effects: Sparkles,
  Backgrounds: Image,
  Glass: GlassWater,
};

// Search results arrive as a string with the matched span wrapped in
// `<mark>…</mark>`; render those as highlighted text instead of literal tags.
function renderTitle(content: ReactNode): ReactNode {
  if (typeof content !== "string") return content;
  return content.split(/(<mark>.*?<\/mark>)/g).map((part, i) => {
    const match = /^<mark>(.*?)<\/mark>$/.exec(part);
    const key = `${i}-${part}`;
    return match ? (
      <span key={key} className="text-fd-primary">
        {match[1]}
      </span>
    ) : (
      <Fragment key={key}>{part}</Fragment>
    );
  });
}

// Map every doc URL to its section label, derived from the `---Section---`
// separators in meta.json (single source of truth for the nav grouping).
const SECTION_BY_URL: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  let section = "";
  for (const entry of meta.pages) {
    const heading = /^---(.+)---$/.exec(entry);
    if (heading) {
      section = heading[1].trim();
      continue;
    }
    const slug = entry.replace(/^\/+|\/+$/g, "");
    map[slug === "index" ? "/docs" : `/docs/${slug}`] = section;
  }
  return map;
})();

export function GodSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    client: fetchClient({}),
  });

  // Pages only — drop heading/text matches so each result is a single doc row.
  const items = useMemo(() => {
    if (!query.data || query.data === "empty") return null;
    return query.data.filter((item) => item.type === "page");
  }, [query.data]);

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={items}
          Item={({ item, onClick }) => {
            const section =
              item.type === "page"
                ? (SECTION_BY_URL[item.url] ?? "Docs")
                : "Docs";
            const Icon = ICON_BY_SECTION[section] ?? FileText;
            return (
              <SearchDialogListItem
                item={item}
                onClick={onClick}
                className="group flex items-center gap-3 px-3 py-2.5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary">
                  <Icon className="size-4" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-fd-popover-foreground">
                    {item.type === "action"
                      ? item.node
                      : renderTitle(item.content)}
                  </span>
                  <span className="truncate text-fd-muted-foreground text-xs">
                    in {section}
                  </span>
                </span>
                <CornerDownLeft className="ms-auto size-4 shrink-0 text-fd-muted-foreground/40 transition-colors group-aria-selected:text-fd-muted-foreground" />
              </SearchDialogListItem>
            );
          }}
        />
      </SearchDialogContent>
    </SearchDialog>
  );
}

export default GodSearchDialog;
