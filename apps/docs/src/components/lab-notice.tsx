import Link from "next/link";

const LINK = "font-medium text-fd-foreground underline underline-offset-4";

/**
 * Marks a docs page as part of GodUI Lab: expressive, experimental pieces
 * beyond the shadcn catalog, maintained as-is.
 */
export function LabNotice() {
  return (
    <p className="not-prose mb-6 rounded-lg border border-fd-border bg-fd-card px-4 py-3 text-sm text-fd-muted-foreground">
      Part of{" "}
      <Link href="/docs/lab" className={LINK}>
        GodUI Lab
      </Link>
      : expressive, experimental pieces beyond the shadcn catalog, maintained
      as-is and not held to the core GPU-only contract. For animated shadcn/ui
      drop-ins, see{" "}
      <Link href="/docs/components" className={LINK}>
        Components
      </Link>
      .
    </p>
  );
}
