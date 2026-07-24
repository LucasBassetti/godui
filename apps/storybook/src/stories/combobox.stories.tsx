import { Combobox, type ComboboxOption } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
