import { SourceCitation, SourceList } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, range, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const sources = [
  {
    title: "OKLCH in CSS: why we moved",
    url: "https://evilmartians.com/chronicles/oklch-in-css",
    snippet:
      "OKLCH is a perceptual color space that keeps lightness consistent across hues — ideal for design tokens and dark mode.",
  },
  {
    title: "Tailwind CSS v4 release notes",
    url: "https://tailwindcss.com/blog/tailwindcss-v4",
    snippet:
      "A ground-up rewrite with a CSS-first config and native cascade layers.",
  },
  {
    title: "Framer Motion: layout animations",
    url: "https://www.framer.com/motion/layout-animations",
  },
  {
    title: "Designing for motion",
    url: "https://emilkowal.ski/ui/great-animations",
  },
];

const meta = {
  title: "AI/SourceCitations",
  component: SourceList,
  subcomponents: { SourceCitation },
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered(384)],
  argTypes: {
    collapsible: toggle("Behavior"),
    previewCount: range(1, 6, 1, "Behavior"),
    sources: hidden(),
  },
  args: {
    collapsible: true,
    previewCount: 2,
    sources,
  },
  render: (args) => (
    <div className="w-full rounded-xl border border-border bg-card p-4">
      <SourceList {...args} />
    </div>
  ),
} satisfies Meta<typeof SourceList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
