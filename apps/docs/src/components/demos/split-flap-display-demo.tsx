"use client";

import { SplitFlapDisplay } from "@godui/components";
import * as React from "react";
import { DemoCenter } from "./_kit";

const WORDS = ["SPLIT", "FLAP", "SOLARI", "REVEAL", "GODUI"];

export function SplitFlapDisplayDemo() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <DemoCenter className="flex-col gap-5 py-6">
      <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Now showing
      </span>
      <SplitFlapDisplay value={WORDS[i]} length={6} align="center" size="md" />
    </DemoCenter>
  );
}

function useClock() {
  const [time, setTime] = React.useState("");
  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setTime(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function SplitFlapClockDemo() {
  const time = useClock();
  return (
    <DemoCenter className="flex-col gap-5 py-6">
      <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Local time
      </span>
      <SplitFlapDisplay
        value={time}
        align="center"
        size="sm"
        charset="0123456789"
      />
    </DemoCenter>
  );
}
