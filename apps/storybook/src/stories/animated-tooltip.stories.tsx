import { AnimatedTooltip } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

const meta = {
  title: "Overlays/AnimatedTooltip",
  component: AnimatedTooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    content: "Design Engineer",
    side: "top",
    children: (
      <button
        type="button"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Hover me
      </button>
    ),
  },
} satisfies Meta<typeof AnimatedTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex h-40 items-center justify-center">
      <AnimatedTooltip {...args} />
    </div>
  ),
};

const TEAM = [
  {
    name: "Ada Lovelace",
    role: "Design Engineer",
    initials: "AL",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    name: "Grace Hopper",
    role: "Staff Engineer",
    initials: "GH",
    gradient: "from-rose-500 to-orange-500",
  },
  {
    name: "Alan Turing",
    role: "Founder",
    initials: "AT",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Katherine Johnson",
    role: "Product Design",
    initials: "KJ",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    name: "Linus Carlsson",
    role: "Frontend Lead",
    initials: "LC",
    gradient: "from-fuchsia-500 to-pink-500",
  },
];

export const TeamStack: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Crafted by design engineers
      </p>
      <div className="flex">
        {TEAM.map((m) => (
          <AnimatedTooltip
            key={m.name}
            className="-ml-3 first:ml-0"
            content={
              <span className="flex flex-col">
                <span className="font-semibold">{m.name}</span>
                <span className="text-background/70">{m.role}</span>
              </span>
            }
          >
            <span
              className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${m.gradient} text-sm font-semibold text-white ring-2 ring-background`}
            >
              {m.initials}
            </span>
          </AnimatedTooltip>
        ))}
      </div>
    </div>
  ),
};

const icon = (path: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
    aria-hidden="true"
  >
    {path}
  </svg>
);

const TOOLS = [
  {
    label: "Bold",
    node: icon(<path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z" />),
  },
  { label: "Italic", node: icon(<path d="M19 4h-9M14 20H5M15 4 9 20" />) },
  {
    label: "Underline",
    node: icon(<path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16" />),
  },
  {
    label: "Link",
    node: icon(
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />,
    ),
  },
];

export const Toolbar: Story = {
  render: () => (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1.5 shadow-sm">
      {TOOLS.map((t) => (
        <AnimatedTooltip key={t.label} content={t.label}>
          <button
            type="button"
            aria-label={t.label}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {t.node}
          </button>
        </AnimatedTooltip>
      ))}
    </div>
  ),
};
