"use client";

import { Progress } from "@godui/components";
import * as React from "react";

export function ProgressLabelledDemo() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid w-full max-w-sm gap-2">
      <div className="flex items-center justify-between text-sm">
        <span id="upload-label" className="font-medium">
          Uploading 3 files
        </span>
        <span className="text-muted-foreground tabular-nums">{progress}%</span>
      </div>
      <Progress value={progress} aria-labelledby="upload-label" />
    </div>
  );
}
