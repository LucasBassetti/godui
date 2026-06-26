import { PresenceFacepile } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, range, select, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const users = [
  { id: "1", name: "Ana Reyes", status: "active" as const },
  { id: "2", name: "Marco Bell", status: "typing" as const },
  { id: "3", name: "Priya Nair", status: "idle" as const },
  { id: "4", name: "Jules Kim", status: "active" as const },
  { id: "5", name: "Sam Diaz", status: "active" as const },
  { id: "6", name: "Lee Cho", status: "idle" as const },
  { id: "7", name: "Noa Levi", status: "active" as const },
];

const meta = {
  title: "Collaboration/PresenceFacepile",
  component: PresenceFacepile,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    size: select(["sm", "md", "lg"], "Appearance"),
    max: range(1, 7, 1, "Behavior"),
    showStatus: toggle("Appearance"),
    users: hidden(),
  },
  args: {
    size: "md",
    max: 5,
    showStatus: true,
    users,
  },
} satisfies Meta<typeof PresenceFacepile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
