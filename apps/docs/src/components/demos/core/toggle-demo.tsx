import { Toggle } from "@godui/components";
import { Bold, Italic, Underline } from "lucide-react";

export function ToggleDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label="Toggle bold">
        <Bold />
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle italic">
        <Italic />
      </Toggle>
      <Toggle aria-label="Toggle underline" defaultPressed>
        <Underline /> Underline
      </Toggle>
    </div>
  );
}
