import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@godui/components";
import { CalendarDays } from "lucide-react";

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground font-semibold text-background text-sm">
            N
          </span>
          <div className="flex flex-col gap-1">
            <h4 className="font-semibold text-sm">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <CalendarDays className="size-3.5" /> Joined December 2021
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
