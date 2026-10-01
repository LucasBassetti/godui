"use client";

import {
  Button,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@godui/components";
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

/** Real Switch; `checked` toggles on the timer. */
function SwitchToggle({ reduced }: { reduced: boolean }) {
  const on = useToggle(reduced);
  return (
    <div className="flex items-center gap-6">
      <Switch checked={on} aria-label="Demo switch" className="scale-150" />
      <Switch checked={!on} aria-label="Demo switch, inverted" />
    </div>
  );
}

const TABS = ["Account", "Password", "Notifications"];

/** Real Tabs; the controlled value cycles, so the indicator FLIPs on its own. */
function TabsCycle({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % TABS.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <Tabs value={TABS[index]} className="w-80">
      <TabsList>
        {TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((tab) => (
        <TabsContent
          key={tab}
          value={tab}
          className="rounded-lg border p-4 text-sm"
        >
          {tab} settings
        </TabsContent>
      ))}
    </Tabs>
  );
}

const DEMOS = {
  button: ButtonPress,
  switch: SwitchToggle,
  tabs: TabsCycle,
} as const;

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
