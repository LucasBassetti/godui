// Vendored from https://ui.shadcn.com/r/styles/new-york-v4/skeleton.json (2026-10-01).
// Reference for parity tests only — do not edit; re-run scripts/vendor-shadcn.mjs.
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  )
}

export { Skeleton }
