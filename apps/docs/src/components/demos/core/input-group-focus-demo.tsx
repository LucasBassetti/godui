"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  Switch,
} from "@godui/components";
import { CornerDownLeftIcon, SearchIcon } from "lucide-react";
import * as React from "react";

export function InputGroupFocusDemo() {
  const [slow, setSlow] = React.useState(false);

  return (
    <div className="grid w-full max-w-sm gap-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground text-sm">
          Click or Tab between the fields
        </span>
        <div className="flex items-center gap-2">
          <Switch
            id="input-group-slow"
            size="sm"
            checked={slow}
            onCheckedChange={setSlow}
          />
          <label htmlFor="input-group-slow" className="font-medium text-sm">
            Slow motion
          </label>
        </div>
      </div>
      <div
        data-slow={slow}
        className="grid gap-6 data-[slow=true]:[--godui-duration-fast:900ms]"
      >
        <InputGroup>
          <InputGroupInput aria-label="Search" placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <kbd className="rounded border px-1.5 font-mono text-xs">⌘K</kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Website"
            placeholder="example.com"
            className="pl-0.5!"
          />
        </InputGroup>
        <InputGroup>
          <InputGroupTextarea
            aria-label="Message"
            placeholder="Write a message..."
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="sm" className="ml-auto" variant="default">
              Send <CornerDownLeftIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
