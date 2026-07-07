"use client";

import { ThreeDMarquee } from "@godui/components";

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
  return (
    <div className="mx-auto h-[26rem] w-full max-w-2xl">
      <ThreeDMarquee images={IMAGES} />
    </div>
  );
}
