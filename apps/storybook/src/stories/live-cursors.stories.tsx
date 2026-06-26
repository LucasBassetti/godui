import { LiveCursors, SimulatedCursors } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Collaboration/LiveCursors",
  component: LiveCursors,
  subcomponents: { SimulatedCursors },
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { cursors: [] },
} satisfies Meta<typeof LiveCursors>;

export default meta;
type Story = StoryObj<typeof meta>;

const Canvas = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-80 w-[40rem] max-w-[90vw] overflow-hidden rounded-2xl border border-border bg-[radial-gradient(oklch(0.7_0_0/0.12)_1px,transparent_1px)] [background-size:18px_18px]">
    {children}
  </div>
);

export const SimulatedPeers: Story = {
  render: () => (
    <Canvas>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
        Live teammates moving around the canvas
      </div>
      <SimulatedCursors names={["Ana", "Marco", "Priya", "Jules"]} />
    </Canvas>
  ),
};

export const CursorChat: Story = {
  render: () => (
    <Canvas>
      <LiveCursors
        cursors={[
          {
            id: "1",
            name: "Ana",
            x: 120,
            y: 80,
            message: "shipping this now 🚀",
          },
          { id: "2", name: "Marco", x: 360, y: 180 },
          { id: "3", name: "Priya", x: 240, y: 240, message: "lgtm!" },
        ]}
      />
    </Canvas>
  ),
};

export const PointersOnly: Story = {
  render: () => (
    <Canvas>
      <SimulatedCursors hideNames names={["A", "B", "C", "D", "E"]} />
    </Canvas>
  ),
};
