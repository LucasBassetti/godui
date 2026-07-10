import { ScrollTextReveal } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { radio, range, text, toggle } from "../playground/argtypes";

const COPY =
  "Great interfaces read like a sentence — one idea resolving into the next. As you scroll, each word settles into focus, pacing attention exactly where it belongs.";

const meta = {
  title: "Text/Scroll Text Reveal",
  component: ScrollTextReveal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    by: radio(["word", "character", "line"], "Behavior"),
    blur: toggle("Appearance"),
    dimOpacity: range(0, 0.6, 0.05, "Appearance"),
    keepRevealed: toggle("Behavior"),
    children: text("Content"),
  },
  args: {
    children: COPY,
    by: "word",
    blur: true,
    dimOpacity: 0.15,
    keepRevealed: false,
  },
  render: (args) => (
    <div className="h-[420px] overflow-y-auto">
      <div className="flex h-[80vh] items-end justify-center pb-8 text-sm text-muted-foreground">
        Scroll down ↓
      </div>
      <div className="mx-auto max-w-xl px-6">
        <ScrollTextReveal
          {...args}
          as="p"
          className="text-2xl font-semibold leading-relaxed text-foreground"
        />
      </div>
      <div className="h-[80vh]" />
    </div>
  ),
} satisfies Meta<typeof ScrollTextReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
