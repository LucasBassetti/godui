"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@godui/components";
import { useState } from "react";

const keepOpen = (event: Event) => event.preventDefault();

export function DropdownMenuCheckboxesDemo() {
  const [statusBar, setStatusBar] = useState(true);
  const [panel, setPanel] = useState(false);
  const [position, setPosition] = useState("bottom");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={statusBar}
          onCheckedChange={setStatusBar}
          onSelect={keepOpen}
        >
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={panel}
          onCheckedChange={setPanel}
          onSelect={keepOpen}
        >
          Panel
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Panel position</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top" onSelect={keepOpen}>
            Top
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom" onSelect={keepOpen}>
            Bottom
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right" onSelect={keepOpen}>
            Right
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
