import { OrbitingCircles } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Effects/Orbiting Circles",
  component: OrbitingCircles,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof OrbitingCircles>;

export default meta;
type Story = StoryObj<typeof meta>;

function Chip({ children }: { children: string }) {
  return (
    <div className="flex size-full items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-foreground shadow-sm">
      {children}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div className="relative flex size-[320px] items-center justify-center">
      <OrbitingCircles radius={120} duration={20} iconSize={40}>
        <Chip>A</Chip>
        <Chip>B</Chip>
        <Chip>C</Chip>
        <Chip>D</Chip>
      </OrbitingCircles>
    </div>
  ),
};

export const TwoRings: Story = {
  render: () => (
    <div className="relative flex size-[320px] items-center justify-center">
      <OrbitingCircles className="absolute" radius={60} duration={14}>
        <Chip>1</Chip>
        <Chip>2</Chip>
      </OrbitingCircles>
      <OrbitingCircles className="absolute" radius={130} duration={26} reverse>
        <Chip>3</Chip>
        <Chip>4</Chip>
        <Chip>5</Chip>
      </OrbitingCircles>
    </div>
  ),
};
