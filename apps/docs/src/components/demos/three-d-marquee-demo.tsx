"use client";

import { ThreeDMarquee } from "@godui/components";
import { DemoMedia } from "@/components/demos/_kit";

const IMAGES = [
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
  "1060",
].map((id) => `https://picsum.photos/id/${id}/400/400`);

export function ThreeDMarqueeDemo() {
  // Image showcase — centered media band (no Example fullWidth).
  return (
    <DemoMedia max="2xl" className="h-[26rem]">
      <ThreeDMarquee images={IMAGES} />
    </DemoMedia>
  );
}
