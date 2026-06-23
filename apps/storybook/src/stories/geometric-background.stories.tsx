import {
  GeometricBackground,
  geometricBackgroundVariants,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Backgrounds/Geometric Background",
  component: GeometricBackground,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: {
      control: "select",
      options: geometricBackgroundVariants,
    },
  },
  args: { variant: geometricBackgroundVariants[0] },
} satisfies Meta<typeof GeometricBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

// Backgrounds are full-bleed: drop them as the first child of a `relative`
// container and layer your content above them.
export const Default: Story = {
  render: (args) => (
    <div className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden">
      <GeometricBackground {...args} />
      <p className="relative z-raised rounded-lg bg-background/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur">
        {args.variant}
      </p>
    </div>
  ),
};

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
      {geometricBackgroundVariants.map((variant) => (
        <div
          key={variant}
          className="relative flex h-40 items-end overflow-hidden rounded-lg border border-border"
        >
          <GeometricBackground variant={variant} />
          <span className="relative z-raised w-full truncate bg-background/70 px-2 py-1 text-xs text-foreground backdrop-blur">
            {variant}
          </span>
        </div>
      ))}
    </div>
  ),
};
