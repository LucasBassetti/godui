import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@godui/components";
import { ChevronsUpDown } from "lucide-react";

const repo = "rounded-md border px-4 py-2 font-mono text-sm";

export function CollapsibleDemo() {
  return (
    <div className="flex w-full max-w-[350px] flex-col gap-2">
      <Collapsible className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="font-semibold text-sm">
            @peduarte starred 3 repositories
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDown />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className={repo}>@radix-ui/primitives</div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className={repo}>@radix-ui/colors</div>
          <div className={repo}>@stitches/react</div>
        </CollapsibleContent>
      </Collapsible>
      <p className="px-4 pt-2 text-muted-foreground text-sm">
        Everything after the collapsible slides into place.
      </p>
    </div>
  );
}
