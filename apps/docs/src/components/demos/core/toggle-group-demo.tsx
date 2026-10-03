import { ToggleGroup, ToggleGroupItem } from "@godui/components";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

export function ToggleGroupDemo() {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      defaultValue="left"
      aria-label="Text alignment"
    >
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
