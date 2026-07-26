"use client";

import { HeroParallax } from "@godui/components";
import { useRef } from "react";
import { DemoScrollPort } from "@/components/demos/_kit";

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
  // Parallax maps scroll progress onto the plane — DemoScrollPort gives it a
  // self-contained runway. Pair with Example fullWidth.
  const ref = useRef<HTMLDivElement>(null);
  return (
    <DemoScrollPort ref={ref}>
      <HeroParallax products={PRODUCTS} scrollContainer={ref} />
    </DemoScrollPort>
  );
}
