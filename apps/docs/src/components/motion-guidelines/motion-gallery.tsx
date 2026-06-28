"use client";

import { Search } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { type GalleryItem, MotionCard } from "./motion-card";

export function MotionGallery({
  items,
  placeholder = "Search…",
}: {
  items: GalleryItem[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const inputId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div className="not-prose mt-6">
      <div className="relative max-w-sm">
        <Search
          aria-hidden
          className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground"
        />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-10 w-full rounded-lg border border-border bg-card pr-3 pl-9 text-foreground text-sm placeholder:text-muted-foreground focus-visible:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </div>

      {results.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {results.map((item) => (
            <MotionCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-muted-foreground text-sm">
          No results match “{query.trim()}”.
        </p>
      )}
    </div>
  );
}
