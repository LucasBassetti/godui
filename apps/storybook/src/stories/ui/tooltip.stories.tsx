import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { Bold, Italic, Link, Underline } from "lucide-react";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-60 items-center justify-center">
      <TooltipProvider>
        <Tooltip {...args}>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
};

const TOOLS = [
  { label: "Bold", Icon: Bold },
  { label: "Italic", Icon: Italic },
  { label: "Underline", Icon: Underline },
  { label: "Link", Icon: Link },
];

export const Toolbar: Story = {
  render: () => (
    <div className="flex min-h-60 items-center justify-center">
      <TooltipProvider delayDuration={300}>
        <div className="flex gap-1 rounded-lg border p-1">
          {TOOLS.map(({ label, Icon }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={label}>
                  <Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  ),
};
