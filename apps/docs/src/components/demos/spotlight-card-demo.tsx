"use client";

import { SpotlightCard } from "@godui/components";
import { Check } from "lucide-react";

type Plan = {
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Hobby",
    price: "$0",
    period: "/mo",
    blurb: "For side projects and prototypes.",
    features: ["1 project", "Community support", "1k events / mo"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$24",
    period: "/mo",
    blurb: "For teams shipping to production.",
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
    blurb: "For organizations at scale.",
    features: ["SLA & uptime guarantee", "Dedicated CSM", "On-prem option"],
    cta: "Contact sales",
  },
];

// A restrained glow that reads as a soft highlight, not a flood.
const GLOW = "color-mix(in oklch, var(--primary) 16%, transparent)";

export function SpotlightCardDemo() {
  return (
    <div className="grid w-full max-w-4xl items-stretch gap-6 sm:grid-cols-3">
      {PLANS.map((plan) => (
        <SpotlightCard
          key={plan.name}
          glowColor={GLOW}
          radius={260}
          className={`flex h-full flex-col p-7 ${
            plan.featured
              ? "bg-primary/[0.035] ring-1 ring-primary/40 shadow-[0_12px_40px_-16px_color-mix(in_oklch,var(--primary)_55%,transparent)] sm:-my-2 sm:scale-[1.02]"
              : ""
          }`}
        >
          <div className="flex h-6 items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
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
            {plan.blurb}
          </p>

          <ul className="mt-6 min-h-[8.5rem] space-y-3.5 border-t border-border pt-6">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-sm text-foreground"
              >
                <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-8">
            <button
              type="button"
              className={`w-full rounded-lg py-2.5 text-sm font-semibold [transition:background_200ms_ease,box-shadow_200ms_ease] ${
                plan.featured
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  : "border border-border text-foreground hover:bg-accent"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        </SpotlightCard>
      ))}
    </div>
  );
}
