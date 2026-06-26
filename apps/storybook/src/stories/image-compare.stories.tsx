import { ImageCompare } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden, range, select, text } from "../playground/argtypes";
import { box } from "../playground/stage";

const meta = {
  title: "Layout/Image Compare",
  component: ImageCompare,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [box(420, 315)],
  argTypes: {
    before: hidden(),
    after: hidden(),
    beforeLabel: text("Content"),
    afterLabel: text("Content"),
    orientation: select(["horizontal", "vertical"], "Appearance"),
    initial: range(0, 100, 5, "State"),
    onChange: action("change"),
  },
  args: {
    before: <img src="https://picsum.photos/id/1015/800/600" alt="Color" />,
    after: (
      <img
        src="https://picsum.photos/id/1015/800/600"
        alt="Black and white"
        className="grayscale"
      />
    ),
    beforeLabel: "Color",
    afterLabel: "B&W",
    orientation: "horizontal",
    initial: 50,
    onChange: fn(),
  },
} satisfies Meta<typeof ImageCompare>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
