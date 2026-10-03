"use client";

import { Progress } from "@godui/components";
import * as React from "react";

export function ProgressDemo() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Progress value={progress} className="w-[60%]" aria-label="Progress" />
  );
}
