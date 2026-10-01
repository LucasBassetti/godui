"use client";

import { Button, Progress } from "@godui/components";
import * as React from "react";

export function ProgressStepsDemo() {
  const [progress, setProgress] = React.useState(25);

  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="flex items-center justify-between text-sm">
        <span id="setup-label" className="font-medium">
          Account setup
        </span>
        <span className="text-muted-foreground tabular-nums">{progress}%</span>
      </div>
      <Progress value={progress} aria-labelledby="setup-label" />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={progress === 0}
          onClick={() => setProgress((p) => Math.max(0, p - 25))}
        >
          Back
        </Button>
        <Button
          size="sm"
          disabled={progress === 100}
          onClick={() => setProgress((p) => Math.min(100, p + 25))}
        >
          Next step
        </Button>
      </div>
    </div>
  );
}
