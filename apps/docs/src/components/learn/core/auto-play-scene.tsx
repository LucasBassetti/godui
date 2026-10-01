"use client";

import {
  Button,
  Checkbox,
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
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

/** Real Checkbox; toggles on the timer, with a forced press while checking. */
function CheckboxToggle({ reduced }: { reduced: boolean }) {
  const on = useToggle(reduced);
  return (
    <div className="flex items-center gap-6">
      <Checkbox checked={on} aria-label="Demo checkbox" className="scale-[2]" />
      <Checkbox checked={!on} aria-label="Demo checkbox, inverted" />
    </div>
  );
}

/** Real Toggle; `pressed` flips on the timer. */
function TogglePress({ reduced }: { reduced: boolean }) {
  const on = useToggle(reduced);
  return (
    <Toggle
      pressed={on}
      variant="outline"
      size="lg"
      aria-label="Bold"
      className="px-5 font-bold"
    >
      B
    </Toggle>
  );
}

const COMMANDS = ["Calendar", "Search Emoji", "Calculator", "Settings"];

/** Real Command; cmdk's controlled `value` moves the selection on the timer. */
function CommandCycle({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % COMMANDS.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <Command
      value={COMMANDS[index]}
      className="w-72 rounded-lg border shadow-md"
    >
      <CommandList>
        <CommandGroup heading="Suggestions">
          {COMMANDS.map((item) => (
            <CommandItem key={item} value={item}>
              {item}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

const RANGES = ["Day", "Week", "Month", "Year"];

/** Real single-select ToggleGroup; the value cycles, so the indicator slides. */
function ToggleGroupCycle({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(1);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % RANGES.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <ToggleGroup type="single" variant="outline" value={RANGES[index]}>
      {RANGES.map((range) => (
        <ToggleGroupItem key={range} value={range}>
          {range}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

const RADIOS = ["Default", "Comfortable", "Compact"];

/** Real RadioGroup; the value cycles, so each dot grows in as it's selected. */
function RadioCycle({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(1);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % RADIOS.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <RadioGroup value={RADIOS[index]} className="gap-4">
      {RADIOS.map((label) => (
        <div key={label} className="flex items-center gap-3 text-sm">
          <RadioGroupItem
            value={label}
            aria-label={label}
            className="scale-150"
          />
          {label}
        </div>
      ))}
    </RadioGroup>
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
  checkbox: CheckboxToggle,
  command: CommandCycle,
  radio: RadioCycle,
  toggle: TogglePress,
  "toggle-group": ToggleGroupCycle,
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
