import { OptimisticToggleButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const meta = {
  title: "Buttons/Optimistic Toggle Button",
  component: OptimisticToggleButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    labelOff: text("Content"),
    labelOn: text("Content"),
    labelActiveHover: text("Content"),
    size: select(["sm", "md", "lg"], "Appearance"),
    defaultPressed: toggle("State"),
  },
  args: {
    labelOff: "Follow",
    labelOn: "Following",
    labelActiveHover: "Unfollow",
    size: "md",
    defaultPressed: false,
    onToggle: () => wait(600),
  },
} satisfies Meta<typeof OptimisticToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
