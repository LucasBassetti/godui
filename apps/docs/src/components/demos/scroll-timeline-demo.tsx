"use client";

import { ScrollTimeline } from "@godui/components";
import { useRef } from "react";
import { DemoScrollPort, DemoScrollRunway } from "@/components/demos/_kit";

export function ScrollTimelineDemo() {
  // Framed mini-scroller — centered on the stage (no Example fullWidth).
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <DemoScrollPort
      ref={scrollRef}
      variant="framed"
      height="34rem"
      max="3xl"
      hint="Scroll the timeline"
      className="px-4 sm:px-8"
    >
      <DemoScrollRunway pad="md">
        <ScrollTimeline
          container={scrollRef}
          data={[
            {
              date: "2021",
              title: "The first commit",
              content: (
                <p className="text-muted-foreground text-sm md:text-base">
                  A single component and a big idea — a design system that feels
                  alive, not templated.
                </p>
              ),
            },
            {
              date: "2023",
              title: "Ten thousand stars",
              content: (
                <p className="text-muted-foreground text-sm md:text-base">
                  The community took over. Contributions poured in and the
                  library tripled in a single quarter.
                </p>
              ),
            },
            {
              date: "2025",
              title: "One hundred components",
              content: (
                <p className="text-muted-foreground text-sm md:text-base">
                  From buttons to WebGL globes, every surface got the same
                  obsessive motion polish.
                </p>
              ),
            },
            {
              date: "Today",
              title: "Just getting started",
              content: (
                <p className="text-muted-foreground text-sm md:text-base">
                  Scroll back up and watch the line trace your journey. The next
                  chapter is yours to write.
                </p>
              ),
            },
          ]}
        />
      </DemoScrollRunway>
    </DemoScrollPort>
  );
}
