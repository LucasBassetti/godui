import { LiveCursors, SimulatedCursors } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, toggle } from "../playground/argtypes";

const Canvas = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-80 w-[40rem] max-w-[90vw] overflow-hidden rounded-2xl border border-border bg-[radial-gradient(oklch(0.7_0_0/0.12)_1px,transparent_1px)] [background-size:18px_18px]">
    {children}
  </div>
);

const cursors = [
  {
    id: "1",
    name: "Ana",
    x: 120,
    y: 80,
    message: "shipping this now 🚀",
  },
  { id: "2", name: "Marco", x: 360, y: 180 },
  { id: "3", name: "Priya", x: 240, y: 240, message: "lgtm!" },
];

const meta = {
  title: "Collaboration/LiveCursors",
  component: LiveCursors,
  subcomponents: { SimulatedCursors },
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <Canvas>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
          Live teammates moving around the canvas
        </div>
        <Story />
      </Canvas>
    ),
  ],
  argTypes: {
    hideNames: toggle("Appearance"),
    cursors: hidden(),
  },
  args: {
    hideNames: false,
    cursors,
  },
} satisfies Meta<typeof LiveCursors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
