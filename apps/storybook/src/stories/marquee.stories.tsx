import { Marquee, type MarqueeProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { range, select, toggle } from "../playground/argtypes";

const logos: { name: string; mark: ReactNode }[] = [
  { name: "Northwind", mark: <circle cx="12" cy="12" r="9" /> },
  { name: "Globex", mark: <path d="M12 2 22 20H2z" /> },
  { name: "Acme", mark: <rect x="3" y="3" width="18" height="18" rx="4" /> },
  { name: "Initech", mark: <path d="M12 2 21 7v10l-9 5-9-5V7z" /> },
  { name: "Stark", mark: <path d="M2 7h20l-4 12-6-4-6 4z" /> },
  { name: "Vertex", mark: <path d="M3 20 12 4l9 16-9-5z" /> },
];

function LogoCloud() {
  return logos.map((logo) => (
    <div
      key={logo.name}
      className="flex items-center gap-2.5 px-2 text-muted-foreground [transition:color_200ms_ease] hover:text-foreground"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="currentColor"
        aria-hidden="true"
      >
        {logo.mark}
      </svg>
      <span className="whitespace-nowrap text-lg font-semibold tracking-tight">
        {logo.name}
      </span>
    </div>
  ));
}

const meta = {
  title: "Effects/Marquee",
  component: Marquee,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    direction: select(["left", "right", "up", "down"], "Behavior"),
    speed: range(5, 60, 1, "Behavior"),
    repeat: range(2, 6, 1, "Behavior"),
    pauseOnHover: toggle("Behavior"),
    fade: toggle("Appearance"),
  },
  args: {
    direction: "left",
    speed: 28,
    repeat: 2,
    pauseOnHover: true,
    fade: true,
  },
  render: (args: MarqueeProps) => (
    <div className="p-10">
      <p className="mb-6 text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Trusted by fast-moving teams
      </p>
      <Marquee {...args}>
        <LogoCloud />
      </Marquee>
    </div>
  ),
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
