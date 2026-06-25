import { Accordion } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const items = [
  {
    value: "what",
    title: "What is GodUI?",
    content:
      "A collection of animated React components built with Tailwind CSS and Framer Motion.",
  },
  {
    value: "install",
    title: "How do I install a component?",
    content: "Use the shadcn CLI to add any component into your project.",
  },
  {
    value: "license",
    title: "Is it free to use?",
    content: "Yes — copy, paste, and ship.",
  },
];

const meta = {
  title: "Layout/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = { args: { type: "single", defaultValue: "what" } };
export const Multiple: Story = { args: { type: "multiple" } };
