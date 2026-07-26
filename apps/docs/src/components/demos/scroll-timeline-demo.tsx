"use client";

import { ScrollTimeline } from "@godui/components";
import { useRef } from "react";

export function ScrollTimelineDemo() {
  // The preview stage is an inner scroll area, so the timeline tracks this
  // container (not the window). Extra vertical runway gives the sticky rail real
  // scroll distance to trace.
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
      <div
        ref={scrollRef}
        className="h-full max-h-[34rem] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card/40 px-4 [scrollbar-width:thin] sm:px-8"
      >
        <div className="py-[22vh]">
          <ScrollTimeline
            container={scrollRef}
            data={[
              {
                date: "2021",
                title: "The first commit",
                content: (
                  <p className="text-sm text-muted-foreground md:text-base">
                    A single component and a big idea — a design system that
                    feels alive, not templated.
                  </p>
                ),
              },
              {
                date: "2023",
                title: "Ten thousand stars",
                content: (
                  <p className="text-sm text-muted-foreground md:text-base">
                    The community took over. Contributions poured in and the
                    library tripled in a single quarter.
                  </p>
                ),
              },
              {
                date: "2025",
                title: "One hundred components",
                content: (
                  <p className="text-sm text-muted-foreground md:text-base">
                    From buttons to WebGL globes, every surface got the same
                    obsessive motion polish.
                  </p>
                ),
              },
              {
                date: "Today",
                title: "Just getting started",
                content: (
                  <p className="text-sm text-muted-foreground md:text-base">
                    Scroll back up and watch the line trace your journey. The
                    next chapter is yours to write.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
