"use client";

import { ScrollTimeline } from "@godui/components";

export function ScrollTimelineDemo() {
  return (
    <ScrollTimeline
      data={[
        {
          date: "2021",
          title: "The first commit",
          content: (
            <p className="text-sm text-muted-foreground md:text-base">
              A single component and a big idea — a design system that feels
              alive, not templated.
            </p>
          ),
        },
        {
          date: "2023",
          title: "Ten thousand stars",
          content: (
            <p className="text-sm text-muted-foreground md:text-base">
              The community took over. Contributions poured in and the library
              tripled in a single quarter.
            </p>
          ),
        },
        {
          date: "2025",
          title: "One hundred components",
          content: (
            <p className="text-sm text-muted-foreground md:text-base">
              From buttons to WebGL globes, every surface got the same obsessive
              motion polish.
            </p>
          ),
        },
        {
          date: "Today",
          title: "Just getting started",
          content: (
            <p className="text-sm text-muted-foreground md:text-base">
              Scroll back up and watch the line trace your journey. The next
              chapter is yours to write.
            </p>
          ),
        },
      ]}
    />
  );
}
