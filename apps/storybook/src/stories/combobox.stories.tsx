import { Combobox, type ComboboxOption } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { fn } from "storybook/test";
import { action, hidden, text, toggle } from "../playground/argtypes";

const frameworks: ComboboxOption[] = [
  { label: "Next.js", value: "next", description: "The React framework" },
  { label: "Remix", value: "remix", description: "Full-stack web framework" },
  { label: "Astro", value: "astro", description: "Content-driven sites" },
  {
    label: "SvelteKit",
    value: "svelte",
    description: "Cybernetically enhanced",
  },
  { label: "Nuxt", value: "nuxt", description: "The intuitive Vue framework" },
  { label: "SolidStart", value: "solid", description: "Simple and performant" },
];

const meta = {
  title: "Navigation/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="flex h-80 items-start justify-center pt-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    options: hidden(),
    onSearch: hidden(),
    value: hidden(),
    placeholder: text("Content"),
    emptyMessage: text("Content"),
    disabled: toggle("State"),
    onChange: action("change"),
  },
  args: {
    options: frameworks,
    placeholder: "Search frameworks…",
    onChange: fn(),
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

/** Multi-select: chips in the control; picking toggles and keeps the list open. */
export const MultiSelect: Story = {
  render: (args) => {
    const [values, setValues] = React.useState<string[]>(["next", "astro"]);
    return (
      <Combobox
        {...args}
        multiple
        values={values}
        onToggle={(v) =>
          setValues((prev) =>
            prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
          )
        }
        placeholder="Add frameworks…"
      />
    );
  },
};

/** Creatable: a typed value with no match becomes an "Add …" row. */
export const Creatable: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("");
    return (
      <Combobox
        {...args}
        creatable
        value={value}
        onChange={(v) => setValue(v)}
        placeholder="Pick or type a new one…"
      />
    );
  },
};

// A short fixed list (≤ threshold) — auto-renders as a plain dropdown.
const sizes: ComboboxOption[] = [
  { label: "Extra small", value: "xs" },
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

/** A short list (≤ `searchableThreshold`) is a plain click-to-open dropdown. */
export const PlainDropdown: Story = {
  args: { options: sizes, placeholder: "Choose a size" },
};

/** Force a plain dropdown even for a long list with `searchable={false}`. */
export const ForcedDropdown: Story = {
  args: { searchable: false, placeholder: "Choose a framework" },
};

/** A persistent action pinned to the top of the list. */
export const PinnedAction: Story = {
  args: {
    pinnedAction: { label: "Manage frameworks →", onSelect: fn() },
  },
};

/** A call-to-action shown in the empty state (type something with no match). */
export const EmptyStateAction: Story = {
  args: {
    emptyMessage: "No frameworks found",
    emptyAction: { label: "Request a framework", onSelect: fn() },
  },
};
