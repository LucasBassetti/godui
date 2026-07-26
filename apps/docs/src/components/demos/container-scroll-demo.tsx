"use client";

import { ContainerScroll } from "@godui/components";
import { useRef } from "react";
import { DemoScrollPort } from "@/components/demos/_kit";

export function ContainerScrollDemo() {
  // Scroll-driven — own scroll room via DemoScrollPort (stage doesn't scroll
  // the window). Pair with Example fullWidth.
  const ref = useRef<HTMLDivElement>(null);
  return (
    <DemoScrollPort ref={ref}>
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
    </DemoScrollPort>
  );
}
