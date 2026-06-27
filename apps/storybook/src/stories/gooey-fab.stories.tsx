import { GooeyFab, type GooeyFabAction } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { select } from "../playground/argtypes";
import { centered } from "../playground/stage";

const Icon = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-[45%]"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const actions: GooeyFabAction[] = [
  {
    label: "Edit",
    icon: <Icon d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />,
  },
  { label: "Share", icon: <Icon d="M4 12v8h16v-8M12 16V4M8 8l4-4 4 4" /> },
  { label: "Delete", icon: <Icon d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /> },
];

const meta = {
  title: "Buttons/Gooey FAB",
  component: GooeyFab,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    size: select(["sm", "md", "lg"], "Appearance"),
    direction: select(["up", "down", "left", "right"], "Appearance"),
  },
  args: {
    actions,
    size: "md",
    direction: "up",
  },
} satisfies Meta<typeof GooeyFab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
