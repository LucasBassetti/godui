import { StackBadge, type StackBadgeProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Layout/Stack Badge",
  component: StackBadge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    items: ["react", "typescript", "tailwind", "nextjs", "node"],
    size: "md",
    variant: "soft",
    showLabel: true,
    animateIn: true,
    glow: true,
  } satisfies StackBadgeProps,
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    variant: { control: "inline-radio", options: ["soft", "outline"] },
    showLabel: { control: "boolean" },
    animateIn: { control: "boolean" },
    glow: { control: "boolean" },
  },
  render: (args) => <StackBadge {...args} />,
} satisfies Meta<typeof StackBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconOnly: Story = {
  args: {
    items: ["react", "vue", "svelte", "go", "rust", "python", "docker"],
    showLabel: false,
  },
};

export const Outline: Story = {
  args: {
    items: ["figma", "typescript", "graphql", "postgres", "supabase"],
    variant: "outline",
  },
};

export const CustomItems: Story = {
  args: {
    items: [
      "react",
      {
        name: "My API",
        color: "#ff5c00",
        icon: (
          <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
            <title>My API logo</title>
            <path d="M12 2 2 7v10l10 5 10-5V7L12 2Zm0 2.3 6.5 3.25L12 10.8 5.5 7.55 12 4.3Z" />
          </svg>
        ),
      },
    ],
  },
};
