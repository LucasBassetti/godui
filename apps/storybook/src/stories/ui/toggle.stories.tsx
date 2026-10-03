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

/** A customised call site: its own on-state colors must win. */
export const CustomOn: Story = {
  args: {
    "aria-label": "Toggle bookmark",
    defaultPressed: true,
    className:
      "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
  },
};
