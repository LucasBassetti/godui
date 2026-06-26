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

export function ComboboxDemo() {
  const [value, setValue] = useState("");
  const selected = PEOPLE.find((p) => p.value === value);

  return (
    <div className="flex h-80 w-full max-w-sm flex-col gap-3 pt-2">
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
  );
}

const FRAMEWORKS: ComboboxOption[] = [
  { label: "Next.js", value: "next", description: "The React framework" },
  { label: "Remix", value: "remix", description: "Full-stack web framework" },
  { label: "Astro", value: "astro", description: "Content-driven sites" },
  {
    label: "SvelteKit",
    value: "svelte",
    description: "Cybernetically enhanced",
  },
  { label: "Nuxt", value: "nuxt", description: "The intuitive Vue framework" },
];

export function ComboboxAsyncDemo() {
  return (
    <div className="flex h-80 w-full max-w-sm flex-col gap-3 pt-2">
      <span className="font-medium text-foreground text-sm">Framework</span>
      <Combobox
        placeholder="Search frameworks…"
        onSearch={async (q) => {
          await new Promise((r) => setTimeout(r, 450));
          return FRAMEWORKS.filter((f) =>
            f.label.toLowerCase().includes(q.toLowerCase()),
          );
        }}
      />
      <p className="text-muted-foreground text-xs">
        Results resolve from an async source with a loading state.
      </p>
    </div>
  );
}
