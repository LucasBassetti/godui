/** Small uppercase language pill shown in a code block's title bar. */
export function LangBadge({ lang }: { lang: string }) {
  return (
    <span className="rounded border border-fd-border bg-fd-card px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase leading-none tracking-wide text-fd-muted-foreground">
      {lang}
    </span>
  );
}
