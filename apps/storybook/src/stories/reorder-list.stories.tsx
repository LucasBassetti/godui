import { ReorderItem, ReorderList } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta = {
  title: "Layout/Reorder List",
  component: ReorderList,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { values: [], onReorder: () => {} },
} satisfies Meta<typeof ReorderList>;

export default meta;
type Story = StoryObj<typeof meta>;

const INITIAL = [
  "Draft proposal",
  "Review with design",
  "Ship to staging",
  "Announce",
];

export const Playground: Story = {
  render: () => {
    const [items, setItems] = React.useState(INITIAL);
    return (
      <ReorderList values={items} onReorder={setItems} className="w-72">
        {items.map((item) => (
          <ReorderItem key={item} value={item}>
            <span className="text-muted-foreground">⠿</span>
            {item}
          </ReorderItem>
        ))}
      </ReorderList>
    );
  },
};
