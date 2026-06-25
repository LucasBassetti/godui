import { SpotlightCard, type SpotlightCardProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Effects/SpotlightCard",
  component: SpotlightCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { radius: 350, border: true },
} satisfies Meta<typeof SpotlightCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export const Default: Story = {
  render: (args: SpotlightCardProps) => (
    <SpotlightCard {...args} className="max-w-sm p-8">
      <h3 className="text-lg font-semibold text-foreground">
        Move your pointer
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The glow tracks the cursor across the card and softly lights the border.
      </p>
    </SpotlightCard>
  ),
};

export const Border: Story = {
  args: {
    border: true,
    radius: 300,
    glowColor: "color-mix(in oklch, var(--primary) 60%, transparent)",
  },
  render: (args: SpotlightCardProps) => (
    <SpotlightCard {...args} className="max-w-sm p-8">
      <h3 className="text-lg font-semibold text-foreground">Trace the edge</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The border brightens where the pointer is closest, then fades behind it.
      </p>
    </SpotlightCard>
  ),
};

const PLANS = [
  {
    name: "Hobby",
    price: "$0",
    period: "/mo",
    features: ["1 project", "Community support", "1k events / mo"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$24",
    period: "/mo",
    features: [
      "Unlimited projects",
      "Priority support",
      "1M events / mo",
      "SSO & audit logs",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["SLA guarantee", "Dedicated CSM", "On-prem option"],
    cta: "Contact sales",
    featured: false,
  },
];

export const Pricing: Story = {
  render: () => (
    <div className="grid max-w-4xl items-stretch gap-6 sm:grid-cols-3">
      {PLANS.map((plan) => (
        <SpotlightCard
          key={plan.name}
          glowColor="color-mix(in oklch, var(--primary) 16%, transparent)"
          radius={260}
          className={`flex h-full flex-col p-7 ${
            plan.featured
              ? "bg-primary/[0.035] ring-1 ring-primary/40 shadow-[0_12px_40px_-16px_color-mix(in_oklch,var(--primary)_55%,transparent)] sm:-my-2 sm:scale-[1.02]"
              : ""
          }`}
        >
          <div className="flex h-6 items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              {plan.name}
            </h3>
            {plan.featured ? (
              <span className="inline-flex rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                Popular
              </span>
            ) : null}
          </div>
          <div className="mt-5 flex items-baseline gap-1">
            <span className="text-4xl font-semibold tracking-tight tabular-nums text-foreground">
              {plan.price}
            </span>
            {plan.period ? (
              <span className="text-sm text-muted-foreground">
                {plan.period}
              </span>
            ) : null}
          </div>
          <p className="mt-3 min-h-10 text-sm text-muted-foreground">
            For teams shipping to production.
          </p>
          <ul className="mt-6 min-h-[8.5rem] space-y-3.5 border-t border-border pt-6">
            {plan.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 text-sm text-foreground"
              >
                <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <button
              type="button"
              className={`w-full rounded-lg py-2.5 text-sm font-semibold ${
                plan.featured
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-accent"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        </SpotlightCard>
      ))}
    </div>
  ),
};

export const CustomColor: Story = {
  args: {
    glowColor: "color-mix(in oklch, oklch(0.7 0.2 320) 50%, transparent)",
  },
  render: (args: SpotlightCardProps) => (
    <SpotlightCard {...args} className="max-w-sm p-8">
      <h3 className="text-lg font-semibold text-foreground">Custom glow</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass any CSS color through <code>glowColor</code>.
      </p>
    </SpotlightCard>
  ),
};
