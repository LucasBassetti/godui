"use client";

import { Button } from "@godui/components";
import { useEffect, useState } from "react";
import { ScrollScene } from "../scroll-scene";

const STEP_MS = 1200;

function useToggle(reduced: boolean) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setOn((v) => !v), STEP_MS);
    return () => clearInterval(id);
  }, [reduced]);
  return on;
}

/** Real Button; a forced `scale-[0.97]` stands in for `:active`. */
function ButtonPress({ reduced }: { reduced: boolean }) {
  const pressed = useToggle(reduced);
  return (
    <Button size="lg" className={pressed ? "scale-[0.97]" : undefined}>
      Continue
    </Button>
  );
}

const DEMOS = { button: ButtonPress } as const;

export type AutoPlayDemo = keyof typeof DEMOS;

/** Drives a real `@godui/components` component on a timer. */
export function AutoPlayScene({
  label,
  note,
  demo,
}: {
  label: string;
  note?: string;
  demo: AutoPlayDemo;
}) {
  const Demo = DEMOS[demo];
  return (
    <ScrollScene label={label} note={note}>
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className="flex min-h-48 w-full items-center justify-center"
        >
          <Demo reduced={reduced} />
        </div>
      )}
    </ScrollScene>
  );
}
