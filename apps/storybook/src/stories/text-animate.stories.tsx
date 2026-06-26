import { TextAnimate } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, range, select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Text/TextAnimate",
  component: TextAnimate,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    animation: select(
      [
        "fadeIn",
        "blurIn",
        "blurInUp",
        "blurInDown",
        "slideUp",
        "slideDown",
        "slideLeft",
        "slideRight",
        "scaleUp",
        "scaleDown",
      ],
      "Appearance",
    ),
    by: select(["text", "word", "character", "line"], "Behavior"),
    as: select(
      ["span", "p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "li", "section"],
      "Appearance",
    ),
    delay: range(0, 2, 0.1, "Behavior"),
    duration: range(0.1, 2, 0.1, "Behavior"),
    stagger: range(0, 0.2, 0.01, "Behavior"),
    startOnView: toggle("Behavior"),
    once: toggle("Behavior"),
    accessible: toggle("Behavior"),
    viewportAmount: hidden(),
    variants: hidden(),
    segmentClassName: hidden(),
    className: hidden(),
  },
  args: {
    children: "Animate your ideas into reality",
    animation: "fadeIn",
    by: "word",
    startOnView: false,
    className: "text-4xl font-semibold tracking-tight",
  },
} satisfies Meta<typeof TextAnimate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
