import { BentoCard, BentoGrid } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { select } from "../playground/argtypes";
import { padded } from "../playground/stage";

function Icon({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden="true"
      >
        {children}
      </svg>
    </span>
  );
}

const sparkles = (
  <path d="M9.94 14.34A2 2 0 0 0 8.66 13L4.5 11.7a.5.5 0 0 1 0-.95L8.66 9.4a2 2 0 0 0 1.28-1.28L11.24 4a.5.5 0 0 1 .95 0l1.3 4.12a2 2 0 0 0 1.28 1.28l4.16 1.3a.5.5 0 0 1 0 .95l-4.16 1.3a2 2 0 0 0-1.28 1.28L12.19 18a.5.5 0 0 1-.95 0z" />
);
const activity = <path d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const shield = (
  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
);
const globe = (
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
  </>
);

function MiniBars() {
  return (
    <div className="mt-5 flex h-24 items-end gap-1.5">
      {[40, 64, 52, 78, 60, 92, 72].map((h, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed static bar chart
          key={`${h}-${i}`}
          className="flex-1 rounded-sm bg-primary/70"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

const meta = {
  title: "Layout/BentoGrid",
  component: BentoGrid,
  subcomponents: { BentoCard },
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [padded(896)],
  argTypes: {
    columns: select(["2", "3", "4"], "Appearance"),
  },
  args: {
    columns: 4,
  },
  render: ({ columns }) => (
    <BentoGrid columns={Number(columns) as 2 | 3 | 4} className="max-w-4xl">
      <BentoCard
        colSpan={2}
        icon={<Icon>{sparkles}</Icon>}
        title="Interfaces that feel alive"
        description="Spring-driven motion, pointer-aware surfaces, and pixel-tuned details — ready to drop in."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          {["60fps", "Reduced-motion safe", "Themed tokens"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </BentoCard>
      <BentoCard
        rowSpan={2}
        icon={<Icon>{activity}</Icon>}
        title="Realtime analytics"
        description="Every interaction streamed as it happens."
      >
        <MiniBars />
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            1.2M
          </span>
          <span className="text-sm text-muted-foreground">events / day</span>
        </div>
      </BentoCard>
      <BentoCard
        icon={<Icon>{shield}</Icon>}
        title="Enterprise-grade"
        description="SOC 2 Type II, SSO, and audit logs."
      />
      <BentoCard
        icon={<Icon>{globe}</Icon>}
        title="120ms p95 globally"
        description="Served from 35 edge regions."
      />
    </BentoGrid>
  ),
} satisfies Meta<typeof BentoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
