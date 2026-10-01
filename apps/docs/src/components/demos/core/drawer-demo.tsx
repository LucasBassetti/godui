"use client";

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@godui/components";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export function DrawerDemo() {
  const [goal, setGoal] = useState(350);
  const adjust = (delta: number) =>
    setGoal((value) => Math.max(200, Math.min(400, value + delta)));

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="flex items-center justify-center gap-4 p-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => adjust(-10)}
              disabled={goal <= 200}
              aria-label="Decrease"
            >
              <Minus />
            </Button>
            <div className="text-center">
              <div className="font-bold text-7xl tracking-tighter tabular-nums">
                {goal}
              </div>
              <div className="text-[0.70rem] text-muted-foreground uppercase">
                Calories/day
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => adjust(10)}
              disabled={goal >= 400}
              aria-label="Increase"
            >
              <Plus />
            </Button>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
