import { Button } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRight } from "lucide-react";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {VARIANTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Button>
      Continue <ArrowRight />
    </Button>
  ),
};
