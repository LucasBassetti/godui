import Link from "next/link";

const LINK = "font-medium text-fd-foreground underline underline-offset-4";

/** Marks a docs page as part of GodUI Extras (pre-pivot, maintained as-is). */
export function ExtrasNotice() {
  return (
    <p className="not-prose mb-6 rounded-lg border border-fd-border bg-fd-card px-4 py-3 text-sm text-fd-muted-foreground">
      Part of{" "}
      <Link href="/docs/extras" className={LINK}>
        GodUI Extras
      </Link>{" "}
      — components from GodUI v1, maintained as-is. For animated shadcn/ui
      drop-ins, see{" "}
      <Link href="/docs/components" className={LINK}>
        Components
      </Link>
      .
    </p>
  );
}
