import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Braces,
  Clipboard,
  Heart,
  Sparkles,
  Terminal,
} from "lucide-react";
import { SectionHeading } from "./section-heading";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Clipboard,
    title: "Copy-paste, own the code",
    description:
      "Every component lands in your codebase as plain source. No black-box dependency, no version lock-in — tweak anything.",
  },
  {
    icon: Terminal,
    title: "shadcn registry",
    description:
      "Add any component with a single shadcn CLI command. Wired to your existing registry workflow.",
  },
  {
    icon: Bot,
    title: "MCP-native",
    description:
      "Your AI agent installs components by name through the GodUI MCP server — no context-switching.",
  },
  {
    icon: Sparkles,
    title: "Motion, done right",
    description:
      "Built on Motion with a strict transform/opacity performance budget, so every animation stays at 60fps.",
  },
  {
    icon: Braces,
    title: "Typed end to end",
    description:
      "Written in TypeScript with fully typed props and Tailwind v4 tokens that respect your theme.",
  },
  {
    icon: Heart,
    title: "Open source",
    description:
      "MIT licensed and free forever. Use it in personal and commercial work without a second thought.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Why GodUI"
        title="Everything you need, nothing you don't"
        description="A component library designed for modern React stacks and the AI tools you already build with."
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-2xl border border-fd-border bg-fd-card p-6 transition-transform duration-200 will-change-transform hover:-translate-y-1"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-xl border border-fd-border bg-fd-background text-fd-primary transition-transform duration-200 group-hover:scale-110">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-semibold text-fd-foreground text-lg">
              {title}
            </h3>
            <p className="mt-2 text-fd-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
