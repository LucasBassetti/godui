import { Button } from "@godui/components";
import { ChevronRight } from "lucide-react";

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Button</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline" size="icon" aria-label="Next">
        <ChevronRight />
      </Button>
    </div>
  );
}
