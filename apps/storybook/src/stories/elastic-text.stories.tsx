import { ElasticText } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, radio, range, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Text/ElasticText",
  component: ElasticText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    mode: radio(["auto", "hover"], "Behavior"),
    minWeight: range(100, 900, 100, "Appearance"),
    maxWeight: range(100, 900, 100, "Appearance"),
    duration: range(1, 8, 0.5, "Behavior"),
    loop: toggle("Behavior"),
    startOnView: toggle("Behavior"),
    radius: range(40, 240, 10, "Behavior"),
    className: hidden(),
  },
  args: {
    children: "Design for Humans",
    mode: "auto",
    className: "text-4xl tracking-tight",
  },
} satisfies Meta<typeof ElasticText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
