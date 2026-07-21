import { Accordion } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, select, toggle } from "../playground/argtypes";
import { padded } from "../playground/stage";

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
  decorators: [padded(520)],
  argTypes: {
    items: hidden(),
    defaultValue: hidden(),
    type: select(["single", "multiple"], "Behavior"),
    collapsible: toggle("Behavior"),
    animation: select(["smooth", "spring", "bounce"], "Appearance"),
  },
  args: {
    items,
    type: "single",
    defaultValue: "what",
    collapsible: true,
    animation: "smooth",
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
