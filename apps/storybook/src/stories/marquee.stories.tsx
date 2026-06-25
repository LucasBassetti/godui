import { Marquee, type MarqueeProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

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

const reviews = [
  { name: "Ada", body: "The smoothest UI I've shipped this year." },
  { name: "Linus", body: "Spring physics that actually feel right." },
  { name: "Grace", body: "Dropped it in and it just worked." },
  { name: "Alan", body: "My landing page finally feels premium." },
];

function ReviewCards() {
  return reviews.map((r) => (
    <figure
      key={r.name}
      className="w-64 rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <figcaption className="text-sm font-semibold text-foreground">
        {r.name}
      </figcaption>
      <blockquote className="mt-2 text-sm text-muted-foreground">
        {r.body}
      </blockquote>
    </figure>
  ));
}

const meta = {
  title: "Effects/Marquee",
  component: Marquee,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { direction: "left", speed: 28, pauseOnHover: true, fade: true },
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

export const LogoCloudStory: Story = { name: "Logo Cloud" };

export const Reviews: Story = {
  render: (args: MarqueeProps) => (
    <div className="p-10">
      <Marquee {...args}>
        <ReviewCards />
      </Marquee>
    </div>
  ),
};

export const Reverse: Story = { args: { direction: "right" } };

export const Fast: Story = { args: { speed: 15 } };

export const NoFade: Story = { args: { fade: false } };

export const Vertical: Story = {
  args: { direction: "up" },
  render: (args: MarqueeProps) => (
    <div className="flex h-[420px] items-center justify-center p-8">
      <Marquee {...args} className="h-full">
        <ReviewCards />
      </Marquee>
    </div>
  ),
};
