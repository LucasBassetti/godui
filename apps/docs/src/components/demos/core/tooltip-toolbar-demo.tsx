import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@godui/components";
import { Bold, Italic, Link, Underline } from "lucide-react";

const TOOLS = [
  { label: "Bold", Icon: Bold },
  { label: "Italic", Icon: Italic },
  { label: "Underline", Icon: Underline },
  { label: "Link", Icon: Link },
];

export function TooltipToolbarDemo() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex gap-1 rounded-lg border p-1">
        {TOOLS.map(({ label, Icon }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={label}>
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
