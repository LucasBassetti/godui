import { CommentPin } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden, range, text, toggle } from "../playground/argtypes";

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-80 w-[40rem] max-w-[90vw] overflow-hidden rounded-2xl border border-border bg-card">
    <div className="absolute left-6 top-6 h-24 w-48 rounded-xl bg-muted" />
    <div className="absolute right-8 top-10 h-16 w-32 rounded-xl bg-muted" />
    <div className="absolute bottom-8 left-10 h-20 w-64 rounded-xl bg-muted" />
    {children}
  </div>
);

const comments = [
  {
    id: "c1",
    author: "Ana Reyes",
    body: "Can we tighten this spacing?",
    time: "2m",
  },
  {
    id: "c2",
    author: "Marco Bell",
    body: "Agreed — bumping to 8px.",
    time: "1m",
  },
];

const meta = {
  title: "Collaboration/CommentPin",
  component: CommentPin,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
  argTypes: {
    x: range(0, 100, 1, "Appearance"),
    y: range(0, 100, 1, "Appearance"),
    label: text("Content"),
    color: hidden(),
    resolved: toggle("State"),
    defaultOpen: toggle("State"),
    comments: hidden(),
    onReply: action("reply"),
    onOpenChange: action("openChange"),
  },
  args: {
    x: 12,
    y: 14,
    resolved: false,
    defaultOpen: true,
    comments,
    onReply: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof CommentPin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
