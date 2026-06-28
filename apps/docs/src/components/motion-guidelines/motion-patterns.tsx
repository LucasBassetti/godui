"use client";

import { MotionGallery } from "./motion-gallery";
import { PATTERNS } from "./pattern-demos";

export function MotionPatterns() {
  return <MotionGallery items={PATTERNS} placeholder="Search patterns…" />;
}
