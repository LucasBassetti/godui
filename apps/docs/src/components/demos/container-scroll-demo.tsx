"use client";

import { ContainerScroll } from "@godui/components";

export function ContainerScrollDemo() {
  return (
    <ContainerScroll
      header={
        <>
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
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
  );
}
