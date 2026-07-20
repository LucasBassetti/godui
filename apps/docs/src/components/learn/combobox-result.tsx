"use client";

import { Combobox, type ComboboxOption } from "@godui/components";
import { useState } from "react";

const PEOPLE: ComboboxOption[] = [
  {
    label: "Ada Lovelace",
    value: "ada",
    description: "Owner · ada@northwind.com",
  },
  {
    label: "Linus Torvalds",
    value: "linus",
    description: "Admin · linus@northwind.com",
  },
  {
    label: "Grace Hopper",
    value: "grace",
    description: "Admin · grace@northwind.com",
  },
  {
    label: "Alan Turing",
    value: "alan",
    description: "Member · alan@northwind.com",
  },
  {
    label: "Katherine Johnson",
    value: "kat",
    description: "Member · kat@northwind.com",
  },
  {
    label: "Margaret Hamilton",
    value: "maggie",
    description: "Member · maggie@northwind.com",
  },
  {
    label: "Barbara Liskov",
    value: "barbara",
    description: "Member · barbara@northwind.com",
  },
];

/**
 * Closing "here's the finished thing" panel — the real, interactive Combobox.
 * Type to filter the list, arrow-key through results, and hit Enter to
 * commit. Swap the static `options` for an async `onSearch` resolver and the
 * same component debounces and race-guards requests automatically.
 *
 * Note: the outer chrome intentionally skips `overflow-hidden` — the listbox
 * is a `position: absolute` sibling (not a portal), so clipping the panel
 * would clip the open popover too.
 */
export function ComboboxResult() {
  const [value, setValue] = useState("");
  const selected = PEOPLE.find((p) => p.value === value);

  return (
    <div className="not-prose my-8 rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — type to filter, or wire an async onSearch
        </span>
      </div>
      <div className="flex min-h-[420px] w-full flex-col items-center gap-4 p-10">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <span className="font-medium text-foreground text-sm">Assignee</span>
          <Combobox
            options={PEOPLE}
            value={value}
            onChange={setValue}
            placeholder="Assign to…"
          />
          <p className="text-muted-foreground text-xs">
            {selected ? (
              <>
                Assigned to{" "}
                <span className="text-foreground">{selected.label}</span>
              </>
            ) : (
              "Search teammates by name"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
