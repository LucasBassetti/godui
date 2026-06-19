import { ProgressiveCardReveal } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta = {
  title: "Layout/Progressive Card Reveal",
  component: ProgressiveCardReveal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ProgressiveCardReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

type Leg = {
  icon: string;
  label: string;
  meta: string;
  distance: string;
  time: string;
};

const legs: Leg[] = [
  {
    icon: "✈️",
    label: "Flight",
    meta: "~3 hours",
    distance: "2,400 miles",
    time: "~3 hours",
  },
  {
    icon: "🚆",
    label: "Train",
    meta: "~12 hours",
    distance: "1,100 miles",
    time: "~12 hours",
  },
  {
    icon: "🚗",
    label: "Driving",
    meta: "~18 hours",
    distance: "332 miles",
    time: "~2 hours",
  },
  {
    icon: "🚴",
    label: "Cycling",
    meta: "~2 days",
    distance: "60 miles",
    time: "~2 days",
  },
  {
    icon: "🚶",
    label: "Walking",
    meta: "~40 minutes",
    distance: "2 miles",
    time: "~40 minutes",
  },
];

function CollapsedRow({ icon, label, meta }: Leg) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 font-medium">
        <span aria-hidden>{icon}</span>
        {label}
      </span>
      <span className="text-sm text-muted-foreground">{meta}</span>
    </div>
  );
}

function ExpandedBody({ icon, label, distance, time }: Leg) {
  return (
    <div className="flex flex-col gap-4">
      <span className="flex items-center gap-2 font-medium">
        <span aria-hidden>{icon}</span>
        {label}
      </span>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Distance
          </p>
          <p className="text-3xl font-semibold">{distance}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Time
          </p>
          <p className="text-3xl font-semibold">{time}</p>
        </div>
      </div>
    </div>
  );
}

function TravelDemo({
  initialActive = 4,
  maxDepth,
}: {
  initialActive?: number;
  maxDepth?: number;
}) {
  const [active, setActive] = React.useState(initialActive);

  return (
    <ProgressiveCardReveal
      activeIndex={active}
      onActiveChange={setActive}
      maxDepth={maxDepth}
      className="w-[420px]"
    >
      {legs.map((leg) => (
        <ProgressiveCardReveal.Card key={leg.label}>
          <ProgressiveCardReveal.CardCollapsed>
            <CollapsedRow {...leg} />
          </ProgressiveCardReveal.CardCollapsed>
          <ProgressiveCardReveal.CardExpanded>
            <ExpandedBody {...leg} />
          </ProgressiveCardReveal.CardExpanded>
        </ProgressiveCardReveal.Card>
      ))}
    </ProgressiveCardReveal>
  );
}

export const Default: Story = {
  args: { activeIndex: 4 },
  render: () => <TravelDemo />,
};

export const CappedDepth: Story = {
  args: { activeIndex: 0, maxDepth: 2 },
  render: () => <TravelDemo initialActive={0} maxDepth={2} />,
};

export const FirstActive: Story = {
  args: { activeIndex: 0 },
  render: () => {
    const [active, setActive] = React.useState(0);
    return (
      <ProgressiveCardReveal
        activeIndex={active}
        onActiveChange={setActive}
        className="w-[420px]"
      >
        {legs.map((leg) => (
          <ProgressiveCardReveal.Card key={leg.label}>
            <ProgressiveCardReveal.CardCollapsed>
              <CollapsedRow {...leg} />
            </ProgressiveCardReveal.CardCollapsed>
            <ProgressiveCardReveal.CardExpanded>
              <ExpandedBody {...leg} />
            </ProgressiveCardReveal.CardExpanded>
          </ProgressiveCardReveal.Card>
        ))}
      </ProgressiveCardReveal>
    );
  },
};
