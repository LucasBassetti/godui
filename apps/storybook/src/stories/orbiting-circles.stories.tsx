import { OrbitingCircles, type OrbitingCirclesProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, toggle } from "../playground/argtypes";

function Chip({ children }: { children: string }) {
  return (
    <div className="flex size-full items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-foreground shadow-sm">
      {children}
    </div>
  );
}

const meta = {
  title: "Effects/Orbiting Circles",
  component: OrbitingCircles,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    radius: range(40, 160, 5, "Appearance"),
    iconSize: range(24, 64, 2, "Appearance"),
    duration: range(6, 40, 1, "Behavior"),
    delay: range(0, 10, 0.5, "Behavior"),
    reverse: toggle("Behavior"),
    showPath: toggle("Appearance"),
  },
  args: {
    radius: 120,
    iconSize: 40,
    duration: 20,
    delay: 0,
    reverse: false,
    showPath: false,
  },
  render: (args: OrbitingCirclesProps) => (
    <div className="relative flex size-[320px] items-center justify-center">
      <OrbitingCircles {...args}>
        <Chip>A</Chip>
        <Chip>B</Chip>
        <Chip>C</Chip>
        <Chip>D</Chip>
      </OrbitingCircles>
    </div>
  ),
} satisfies Meta<typeof OrbitingCircles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
