import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Hover Card",
  component: HoverCard,
  tags: ["autodocs"],
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-80 items-start justify-center pt-10">
      <HoverCard openDelay={100} {...args}>
        <HoverCardTrigger asChild>
          <Button variant="link">@nextjs</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="text-xs text-muted-foreground">
              Joined December 2021
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};
