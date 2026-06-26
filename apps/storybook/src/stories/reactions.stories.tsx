import { type Reaction, Reactions } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = {
  title: "Collaboration/Reactions",
  component: Reactions,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { reactions: [] },
} satisfies Meta<typeof Reactions>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveReactions({ initial }: { initial: Reaction[] }) {
  const [reactions, setReactions] = useState<Reaction[]>(initial);

  const toggle = (emoji: string) =>
    setReactions((prev) =>
      prev
        .map((r) =>
          r.emoji === emoji
            ? {
                ...r,
                reacted: !r.reacted,
                count: r.count + (r.reacted ? -1 : 1),
              }
            : r,
        )
        .filter((r) => r.count > 0),
    );

  const add = (emoji: string) =>
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        toggle(emoji);
        return prev;
      }
      return [...prev, { emoji, count: 1, reacted: true }];
    });

  return <Reactions reactions={reactions} onToggle={toggle} onAdd={add} />;
}

export const Default: Story = {
  render: () => (
    <InteractiveReactions
      initial={[
        {
          emoji: "👍",
          count: 4,
          reacted: true,
          users: ["You", "Ana", "Marco"],
        },
        { emoji: "🎉", count: 2, users: ["Priya", "Jules"] },
        { emoji: "🚀", count: 1, users: ["Sam"] },
      ]}
    />
  ),
};

export const Empty: Story = {
  render: () => <InteractiveReactions initial={[]} />,
};
