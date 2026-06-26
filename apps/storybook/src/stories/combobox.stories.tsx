import { Combobox, type ComboboxOption } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
  args: { options: frameworks, placeholder: "Search frameworks…" },
  decorators: [
    (Story) => (
      <div className="flex h-80 items-start justify-center pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Preselected: Story = { args: { defaultValue: "astro" } };

export const Async: Story = {
  args: {
    options: undefined,
    onSearch: async (q: string) => {
      await new Promise((r) => setTimeout(r, 400));
      return frameworks.filter((f) =>
        f.label.toLowerCase().includes(q.toLowerCase()),
      );
    },
  },
};
