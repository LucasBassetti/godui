"use client";

import { ToastProvider, toast } from "@godui/components";

export function ToastDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() =>
          toast({ title: "Event created", description: "Friday at 5pm" })
        }
        className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm"
      >
        Create event
      </button>
      <button
        type="button"
        onClick={() =>
          toast.success({
            title: "Saved",
            description: "Your changes are live.",
          })
        }
        className="rounded-lg bg-muted px-4 py-2 font-medium text-foreground text-sm"
      >
        Save changes
      </button>
      <button
        type="button"
        onClick={() =>
          toast({
            title: "Deleted file",
            description: "report.pdf",
            action: { label: "Undo", onClick: () => {} },
          })
        }
        className="rounded-lg bg-muted px-4 py-2 font-medium text-foreground text-sm"
      >
        Delete file
      </button>
      <ToastProvider />
    </div>
  );
}
