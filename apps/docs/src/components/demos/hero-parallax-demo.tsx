"use client";

import { HeroParallax } from "@godui/components";
import { useRef } from "react";

const PRODUCTS = [
  "1015",
  "1016",
  "1018",
  "1019",
  "1024",
  "1025",
  "1027",
  "1035",
  "1036",
  "1039",
  "1043",
  "1044",
  "1047",
  "1050",
  "1051",
].map((id, i) => ({
  title: `Project ${i + 1}`,
  thumbnail: `https://picsum.photos/id/${id}/600/400`,
  href: "#",
}));

export function HeroParallaxDemo() {
  // The parallax maps scroll progress onto the plane, so it needs its own tall
  // scroll room. Inside the workbench stage the window never scrolls, so give
  // the demo a self-contained scroll frame and point `scrollContainer` at it —
  // now scrolling the preview drives the animation.
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      data-scroll-container
      className="relative h-full w-full overflow-y-auto overflow-x-hidden"
    >
      <HeroParallax products={PRODUCTS} scrollContainer={ref} />
    </div>
  );
}
