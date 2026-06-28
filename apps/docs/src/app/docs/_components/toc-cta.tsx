const REPO = "https://github.com/LucasBassetti/godui";

/**
 * "Built with GodUI" card shown under the table of contents (and inside the
 * mobile TOC popover). Wired via DocsPage `tableOfContent.footer`.
 */
export function TocCta() {
  return (
    <div className="toc-cta mt-6 mb-4 rounded-2xl border border-fd-border p-4">
      <p className="font-semibold text-[13.5px] text-fd-foreground">
        Built with GodUI
      </p>
      <p className="mt-1 text-[12.5px] text-fd-muted-foreground leading-relaxed">
        Beautifully crafted motion components for modern interfaces.
      </p>
      <a
        href={REPO}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-2.5 inline-flex items-center gap-1.5 font-semibold text-[12.5px] text-fd-primary transition-opacity hover:opacity-80"
      >
        Star on GitHub
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      </a>
    </div>
  );
}
