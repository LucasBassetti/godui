import { PresenceFacepile } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

const meta = {
  title: "Collaboration/PresenceFacepile",
  component: PresenceFacepile,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { users: [] },
} satisfies Meta<typeof PresenceFacepile>;

export default meta;
type Story = StoryObj<typeof meta>;

const users = [
  { id: "1", name: "Ana Reyes", status: "active" as const },
  { id: "2", name: "Marco Bell", status: "typing" as const },
  { id: "3", name: "Priya Nair", status: "idle" as const },
  { id: "4", name: "Jules Kim", status: "active" as const },
  { id: "5", name: "Sam Diaz", status: "active" as const },
  { id: "6", name: "Lee Cho", status: "idle" as const },
  { id: "7", name: "Noa Levi", status: "active" as const },
];

export const Default: Story = {
  args: { users, max: 5 },
};

export const NoStatus: Story = {
  args: { users, max: 6, showStatus: false },
};

export const Large: Story = {
  args: { users, max: 4, size: "lg" },
};

export const LiveJoinLeave: Story = {
  render: () => {
    function Demo() {
      const [count, setCount] = useState(3);
      useEffect(() => {
        const id = setInterval(() => {
          setCount((c) => (c >= users.length ? 2 : c + 1));
        }, 1400);
        return () => clearInterval(id);
      }, []);
      return <PresenceFacepile users={users.slice(0, count)} max={5} />;
    }
    return <Demo />;
  },
};
