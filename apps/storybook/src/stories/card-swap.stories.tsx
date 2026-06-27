import { CardSwap, type CardSwapProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, toggle } from "../playground/argtypes";

const FEATURES = [
  {
    title: "Realtime sync",
    body: "Every change lands instantly across every device and teammate.",
  },
  {
    title: "Built-in analytics",
    body: "Understand usage without wiring up a single event by hand.",
  },
  {
    title: "Edge delivery",
    body: "Served from the region closest to each request, every time.",
  },
  {
    title: "Audit logs",
    body: "Know who did what, and when — exportable on demand.",
  },
];

const meta = {
  title: "Layout/CardSwap",
  component: CardSwap,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    interval: range(0, 6000, 250, "Behavior"),
    pauseOnHover: toggle("Behavior"),
    offsetY: range(0, 60, 2, "Appearance"),
    offsetX: range(0, 60, 2, "Appearance"),
    scaleStep: range(0, 0.16, 0.01, "Appearance"),
  },
  args: {
    interval: 3500,
    pauseOnHover: true,
    offsetY: 28,
    offsetX: 22,
    scaleStep: 0.06,
  },
  render: (args: CardSwapProps) => (
    <CardSwap {...args} className="h-72 w-80">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className="flex h-full w-full flex-col justify-between rounded-2xl border border-border bg-card p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-lg font-semibold text-primary ring-1 ring-primary/15 ring-inset">
            {f.title.charAt(0)}
          </span>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {f.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {f.body}
            </p>
          </div>
        </div>
      ))}
    </CardSwap>
  ),
} satisfies Meta<typeof CardSwap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
