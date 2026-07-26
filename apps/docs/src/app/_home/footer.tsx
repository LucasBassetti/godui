import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { GoduiLogo } from "../docs/_components/godui-logo";

// Kept in sync with ANIMATED_ICONS_URL in docs/_components/docs-header.tsx.
const ANIMATED_ICONS_URL = "https://svg-animated-icons.vercel.app/";

type FooterLink = { label: string; href: string; external?: boolean };

const columns: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Components", href: "/docs/components" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Animated Icons", href: ANIMATED_ICONS_URL, external: true },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "MCP Server", href: "/docs/mcp" },
      { label: "Guidelines", href: "/docs/guidelines/principles" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[15px]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialButton =
  "inline-flex size-9 items-center justify-center rounded-full border border-fd-border bg-fd-background text-fd-muted-foreground transition-colors hover:border-fd-primary/40 hover:text-fd-foreground";

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className =
    "text-fd-muted-foreground text-sm transition-colors hover:text-fd-foreground";
  return link.external ? (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer noopener"
      className={className}
    >
      {link.label}
    </a>
  ) : (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-10 w-full border-fd-border/70 border-t bg-fd-card">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-10 px-4 py-16 lg:flex-row lg:justify-between lg:gap-16">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-[0.9375rem] text-fd-foreground"
          >
            <GoduiLogo className="h-6 w-6" width={24} height={24} />
            {siteConfig.name}
          </Link>
          <p className="max-w-xs text-fd-muted-foreground text-sm leading-relaxed">
            An open-source collection of beautifully crafted motion components
            for modern React interfaces.
          </p>
          <div className="flex items-center gap-2">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className={socialButton}
            >
              <GitHubIcon />
            </a>
            <a
              href={siteConfig.x}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="X / Twitter"
              className={socialButton}
            >
              <XIcon />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:gap-16 lg:gap-20">
          {columns.map((column) => (
            <nav key={column.heading} className="flex flex-col gap-3">
              <h3 className="font-semibold text-fd-foreground text-sm">
                {column.heading}
              </h3>
              {column.links.map((link) => (
                <FooterLinkItem key={link.label} link={link} />
              ))}
            </nav>
          ))}
        </div>
      </div>
      <div className="border-fd-border/60 border-t">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col items-center justify-between gap-2 px-4 py-6 text-fd-muted-foreground text-xs sm:flex-row">
          <p>
            © {year} {siteConfig.name}. MIT Licensed.
          </p>
          <p>Built with React, TypeScript, Tailwind CSS &amp; Motion.</p>
        </div>
      </div>
    </footer>
  );
}
