import { AsciiDither, type AsciiDitherProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { radio, range, select, toggle } from "../playground/argtypes";

const meta = {
  title: "Effects/AsciiDither",
  component: AsciiDither,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: radio(["ascii", "dither"], "Appearance"),
    cellSize: range(4, 20, 1, "Appearance"),
    color: select(["theme", "source"], "Appearance"),
    ditherType: radio(["bayer", "floyd-steinberg"], "Appearance"),
    dotShape: radio(["square", "circle"], "Appearance"),
    levels: range(2, 6, 1, "Appearance"),
    contrast: range(0.5, 2.5, 0.1, "Appearance"),
    invert: toggle("Appearance"),
    reveal: toggle("Behavior"),
    interactive: toggle("Behavior"),
    glitch: toggle("Behavior"),
  },
  args: {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=512&h=640&fit=crop&q=80",
    alt: "Headphones rendered as ASCII characters",
    variant: "ascii",
    cellSize: 5,
    color: "theme",
    ditherType: "bayer",
    dotShape: "square",
    levels: 2,
    contrast: 1.4,
    invert: false,
    reveal: true,
    interactive: true,
    glitch: false,
  },
  render: (args: AsciiDitherProps) => (
    <div className="aspect-[4/5] w-[20rem] overflow-hidden rounded-xl border border-border bg-card">
      <AsciiDither {...args} />
    </div>
  ),
} satisfies Meta<typeof AsciiDither>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Dither: Story = {
  args: { variant: "dither", dotShape: "circle", cellSize: 5, color: "theme" },
};

export const Glitch: Story = {
  args: { glitch: true, interactive: false, color: "theme", cellSize: 7 },
};
