import { Toggle } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { Bold, Italic } from "lucide-react";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: { "aria-label": "Toggle bold", children: <Bold /> },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const WithText: Story = {
  args: {
    "aria-label": "Toggle italic",
    children: (
      <>
        <Italic /> Italic
      </>
    ),
  },
};
