"use client";

import { Button, Toaster } from "@godui/components";
import { toast } from "sonner";

export function SonnerDemo() {
  return (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button>
    </>
  );
}
