import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@godui/components";
import {
  CopyIcon,
  CornerDownLeftIcon,
  FileCodeIcon,
  RefreshCwIcon,
} from "lucide-react";

export function InputGroupTextareaDemo() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <InputGroup>
        <InputGroupTextarea
          id="textarea-code"
          placeholder="console.log('Hello, world!');"
          className="min-h-[200px]"
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText>Line 1, Column 1</InputGroupText>
          <InputGroupButton size="sm" className="ml-auto" variant="default">
            Run <CornerDownLeftIcon />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="font-medium font-mono">
            <FileCodeIcon />
            script.js
          </InputGroupText>
          <InputGroupButton
            className="ml-auto"
            size="icon-xs"
            aria-label="Refresh"
          >
            <RefreshCwIcon />
          </InputGroupButton>
          <InputGroupButton variant="ghost" size="icon-xs" aria-label="Copy">
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
