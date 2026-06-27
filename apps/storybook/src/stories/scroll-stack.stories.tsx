import { ScrollStack, type ScrollStackProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, toggle } from "../playground/argtypes";

const cards = [
  {
    eyebrow: "Plan",
    title: "One source of truth",
    body: "Issues, docs, and roadmaps live on a single surface your whole team trusts.",
    stat: "12 projects",
    statLabel: "in sync",
  },
  {
    eyebrow: "Track",
    title: "Progress you can see",
    body: "Live insight into velocity and scope — no spreadsheets, no status meetings.",
    stat: "98.2%",
    statLabel: "on-time delivery",
  },
  {
    eyebrow: "Ship",
    title: "From plan to production",
    body: "Move work from idea to release without losing the thread along the way.",
    stat: "240ms",
    statLabel: "median deploy",
  },
];

const meta = {
  title: "Layout/ScrollStack",
  component: ScrollStack,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    height: { control: "text", table: { category: "Appearance" } },
    baseScale: range(0.6, 1, 0.01, "Appearance"),
    peek: range(0, 48, 2, "Appearance"),
    pinTop: { control: "text", table: { category: "Appearance" } },
    blur: toggle("Appearance"),
  },
  args: {
    height: "34rem",
    baseScale: 0.86,
    peek: 16,
    blur: true,
    pinTop: "10%",
  },
  render: (args: ScrollStackProps) => (
    <div className="mx-auto max-w-md px-4 py-10">
      <ScrollStack
        {...args}
        className="rounded-2xl border border-border bg-muted/30"
      >
        {cards.map((c) => (
          <article
            key={c.title}
            className="flex w-full flex-col rounded-2xl border border-border bg-card p-8 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)]"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {c.eyebrow}
            </span>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              {c.title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
              {c.body}
            </p>
            <div className="mt-7 flex items-baseline gap-2 border-t border-border pt-5">
              <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
                {c.stat}
              </span>
              <span className="text-sm text-muted-foreground">
                {c.statLabel}
              </span>
            </div>
          </article>
        ))}
      </ScrollStack>
    </div>
  ),
} satisfies Meta<typeof ScrollStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
