"use client";

import { ContainerScroll } from "@godui/components";
import { useRef } from "react";

export function ContainerScrollDemo() {
  // Scroll-driven, so it needs its own scroll room. Inside the workbench stage
  // the window never scrolls — give the demo a self-contained scroll frame and
  // point `scrollContainer` at it so scrolling the preview drives the animation.
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      data-scroll-container
      className="relative h-full w-full overflow-y-auto overflow-x-hidden"
    >
      <ContainerScroll
        scrollContainer={ref}
        header={
          <>
            <h2 className="font-bold text-3xl text-foreground md:text-5xl">
              Scroll to bring it to life
            </h2>
            <p className="mt-4 text-muted-foreground">
              The frame un-tilts and settles as you scroll.
            </p>
          </>
        }
      >
        <img src="https://picsum.photos/id/1005/1200/750" alt="Dashboard" />
      </ContainerScroll>
    </div>
  );
}
