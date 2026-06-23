import {
  DecorativeBackground,
  type DecorativeBackgroundProps,
  type DecorativeBackgroundVariant,
  decorativeBackgroundPresets,
  decorativeBackgroundVariants,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

type ShowcaseArgs = DecorativeBackgroundProps & {
  variant: DecorativeBackgroundVariant;
};

const meta: Meta<ShowcaseArgs> = {
  title: "Backgrounds/Decorative Background",
  component: DecorativeBackground,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "select", options: decorativeBackgroundVariants },
    background: { table: { disable: true } },
    backgroundImage: { table: { disable: true } },
    backgroundSize: { table: { disable: true } },
  },
  args: { variant: decorativeBackgroundVariants[0] },
};

export default meta;
type Story = StoryObj<ShowcaseArgs>;

export const Default: Story = {
  render: ({ variant }) => (
    <div className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden">
      <DecorativeBackground {...decorativeBackgroundPresets[variant]} />
      <p className="relative z-raised rounded-lg bg-background/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur">
        {variant}
      </p>
    </div>
  ),
};

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
      {decorativeBackgroundVariants.map((variant) => (
        <div
          key={variant}
          className="relative flex h-40 items-end overflow-hidden rounded-lg border border-border"
        >
          <DecorativeBackground {...decorativeBackgroundPresets[variant]} />
          <span className="relative z-raised w-full truncate bg-background/70 px-2 py-1 text-xs text-foreground backdrop-blur">
            {variant}
          </span>
        </div>
      ))}
    </div>
  ),
};
