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

export function ComboboxDemo({ disabled = false }: { disabled?: boolean }) {
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
        disabled={disabled}
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

export function ComboboxMultiSelectDemo() {
  const [values, setValues] = useState<string[]>(["ada", "grace"]);

  return (
    <div className="flex h-80 w-full max-w-sm flex-col gap-3 pt-2">
      <span className="font-medium text-foreground text-sm">Reviewers</span>
      <Combobox
        multiple
        options={PEOPLE}
        values={values}
        onToggle={(v) =>
          setValues((prev) =>
            prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
          )
        }
        placeholder="Add reviewers…"
      />
      <p className="text-muted-foreground text-xs">
        {values.length} selected — chips show in the control and picking keeps
        the list open.
      </p>
    </div>
  );
}

export function ComboboxCreatableDemo() {
  const [options, setOptions] = useState<ComboboxOption[]>(PEOPLE);
  const [value, setValue] = useState("");

  return (
    <div className="flex h-80 w-full max-w-sm flex-col gap-3 pt-2">
      <span className="font-medium text-foreground text-sm">Label</span>
      <Combobox
        creatable
        options={options}
        value={value}
        onChange={setValue}
        onCreate={async (label) => {
          // Simulate persisting to a server — the create row spins while this
          // resolves, then the new option is selected.
          await new Promise((r) => setTimeout(r, 900));
          const created = {
            value: label.toLowerCase().replace(/\s+/g, "-"),
            label,
          };
          setOptions((prev) => [...prev, created]);
          setValue(created.value);
        }}
        placeholder="Pick a teammate or type a new label…"
      />
      <p className="text-muted-foreground text-xs">
        Type a name with no match, then pick “Create …” — the row spins while it
        saves.
      </p>
    </div>
  );
}

const SIZES: ComboboxOption[] = [
  { label: "Extra small", value: "xs" },
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

export function ComboboxPlainDemo() {
  const [value, setValue] = useState("md");

  return (
    <div className="flex h-80 w-full max-w-sm flex-col gap-3 pt-2">
      <span className="font-medium text-foreground text-sm">Size</span>
      <Combobox
        options={SIZES}
        value={value}
        onChange={setValue}
        placeholder="Choose a size"
      />
      <p className="text-muted-foreground text-xs">
        Four options — under the threshold, so it’s a plain click-to-open
        dropdown (no search field).
      </p>
    </div>
  );
}

export function ComboboxPinnedActionDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="flex h-80 w-full max-w-sm flex-col gap-3 pt-2">
      <span className="font-medium text-foreground text-sm">Assignee</span>
      <Combobox
        options={PEOPLE}
        value={value}
        onChange={setValue}
        placeholder="Assign to…"
        pinnedAction={{ label: "Manage team →", onSelect: () => {} }}
      />
      <p className="text-muted-foreground text-xs">
        A pinned action stays at the top of the list, whatever the query.
      </p>
    </div>
  );
}

export function ComboboxEmptyActionDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="flex h-80 w-full max-w-sm flex-col gap-3 pt-2">
      <span className="font-medium text-foreground text-sm">Assignee</span>
      <Combobox
        options={PEOPLE}
        value={value}
        onChange={setValue}
        placeholder="Assign to…"
        emptyMessage="No teammates found"
        emptyAction={{ label: "Invite someone", onSelect: () => {} }}
      />
      <p className="text-muted-foreground text-xs">
        Type a name with no match to reveal the empty-state action.
      </p>
    </div>
  );
}
