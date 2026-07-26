"use client";

import { ScrollReveal } from "@godui/components";
import { DemoScrollPort, DemoScrollRunway } from "@/components/demos/_kit";

const GRID = ["Plan", "Build", "Ship", "Measure", "Iterate", "Scale"];

export function ScrollRevealDemo() {
  // Framed mini-scroller so the reveal fires as content scrolls into the stage.
  return (
    <DemoScrollPort
      variant="framed"
      height="26rem"
      max="lg"
      hint="Scroll to reveal"
    >
      <DemoScrollRunway pad="xl" className="flex flex-col items-center px-6">
        <ScrollReveal>
          <div className="rounded-xl border border-border bg-card p-8 font-semibold text-foreground text-lg shadow-sm">
            I reveal on scroll
          </div>
        </ScrollReveal>
      </DemoScrollRunway>
    </DemoScrollPort>
  );
}

export function ScrollRevealStaggerDemo() {
  return (
    <DemoScrollPort
      variant="framed"
      height="26rem"
      max="lg"
      hint="Scroll to reveal"
    >
      <DemoScrollRunway pad="xl" className="px-6">
        <div className="grid grid-cols-3 gap-3">
          {GRID.map((item, i) => (
            <ScrollReveal key={item} delay={i * 0.1}>
              <div className="rounded-xl border border-border bg-card p-5 font-medium text-foreground text-sm shadow-sm">
                {item}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </DemoScrollRunway>
    </DemoScrollPort>
  );
}

export function ScrollRevealLeftDemo() {
  return (
    <DemoScrollPort
      variant="framed"
      height="26rem"
      max="lg"
      hint="Scroll to reveal"
    >
      <DemoScrollRunway pad="xl" className="flex flex-col items-center px-6">
        <ScrollReveal direction="left" distance={80} blur={false}>
          <div className="rounded-xl border border-border bg-card p-8 font-semibold text-foreground text-lg shadow-sm">
            Slides in from the left
          </div>
        </ScrollReveal>
      </DemoScrollRunway>
    </DemoScrollPort>
  );
}
