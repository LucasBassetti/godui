import { SourceCitation, SourceList } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "AI/SourceCitations",
  component: SourceCitation,
  subcomponents: { SourceList },
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { index: 1, source: { title: "", url: "" } },
} satisfies Meta<typeof SourceCitation>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const InlineCitations: Story = {
  render: () => (
    <div className="mx-auto max-w-lg text-sm leading-7 text-foreground">
      <p>
        Modern design systems lean on OKLCH for consistent theming
        <SourceCitation index={1} source={sources[0]} /> and Tailwind v4 for a
        CSS-first config
        <SourceCitation index={2} source={sources[1]} />. Motion is increasingly
        treated as a first-class concern
        <SourceCitation index={3} source={sources[3]} />.
      </p>
    </div>
  ),
};

export const SourcesList: Story = {
  render: () => (
    <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-4">
      <SourceList sources={sources} previewCount={2} />
    </div>
  ),
};
