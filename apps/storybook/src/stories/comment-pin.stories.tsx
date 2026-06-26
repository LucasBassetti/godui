import { CommentPin } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Collaboration/CommentPin",
  component: CommentPin,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { x: 0, y: 0 },
} satisfies Meta<typeof CommentPin>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Threaded: Story = {
  render: () => (
    <Frame>
      <CommentPin
        x={12}
        y={14}
        comments={comments}
        defaultOpen
        onReply={() => {}}
      />
      <CommentPin
        x={70}
        y={18}
        comments={[{ id: "c3", author: "Priya Nair", body: "Love this card." }]}
      />
    </Frame>
  ),
};

export const Resolved: Story = {
  render: () => (
    <Frame>
      <CommentPin
        x={20}
        y={70}
        resolved
        comments={[{ id: "c4", author: "Jules Kim", body: "Fixed in latest." }]}
      />
    </Frame>
  ),
};
