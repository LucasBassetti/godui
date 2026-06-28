"use client";

import { MotionGallery } from "./motion-gallery";
import { PRINCIPLES } from "./principle-demos";

export function MotionPrinciples() {
  return <MotionGallery items={PRINCIPLES} placeholder="Search principles…" />;
}
