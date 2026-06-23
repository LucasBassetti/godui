import {
  GeometricBackground,
  type GeometricBackgroundProps,
  type GeometricBackgroundVariant,
  geometricBackgroundPresets,
  geometricBackgroundVariants,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

type ShowcaseArgs = GeometricBackgroundProps & {
  variant: GeometricBackgroundVariant;
};

const meta: Meta<ShowcaseArgs> = {
  title: "Backgrounds/Geometric Background",
  component: GeometricBackground,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "select", options: geometricBackgroundVariants },
    background: { table: { disable: true } },
    backgroundImage: { table: { disable: true } },
    backgroundSize: { table: { disable: true } },
  },
  args: { variant: geometricBackgroundVariants[0] },
};

export default meta;
type Story = StoryObj<ShowcaseArgs>;

export const Default: Story = {
  render: ({ variant }) => (
    <div className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden">
      <GeometricBackground {...geometricBackgroundPresets[variant]} />
      <p className="relative z-raised rounded-lg bg-background/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur">
        {variant}
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
          <GeometricBackground {...geometricBackgroundPresets[variant]} />
          <span className="relative z-raised w-full truncate bg-background/70 px-2 py-1 text-xs text-foreground backdrop-blur">
            {variant}
          </span>
        </div>
      ))}
    </div>
  ),
};
