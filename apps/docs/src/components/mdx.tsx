import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
  type ComponentProps,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { BackgroundShowcase } from "@/components/background-showcase";
import { PreviewCard } from "@/components/card-previews/preview-card";
import { ComponentInstall } from "@/components/component-install";
import { ComponentPreview } from "@/components/component-preview";
import { LangBadge } from "@/components/lang-badge";
import { MCPInstall } from "@/components/mcp-install";

function Table(props: ComponentProps<"table">) {
  return (
    <div className="docs-table-wrapper not-prose my-6 overflow-x-auto">
      <table className="docs-table w-full text-sm" {...props} />
    </div>
  );
}

/** Pull the Shiki `language-xxx` class off the inner <code> element. */
function langFromChildren(children: ReactNode): string {
  const code = (Array.isArray(children) ? children[0] : children) as
    | ReactElement<{ className?: string }>
    | undefined;
  const className = isValidElement(code) ? (code.props.className ?? "") : "";
  return /language-(\w+)/.exec(className)?.[1] ?? "txt";
}

/**
 * Override the default `pre` so every fenced code block (Usage, etc.) gets the
 * same title bar as the install steps: a lang badge, the optional filename, and
 * the bordered copy button. A non-breaking space forces the bar to render even
 * when the fence has no `title="…"`.
 */
function CodeBlockWithHeader({
  title,
  children,
  ...props
}: ComponentProps<typeof CodeBlock>) {
  return (
    <CodeBlock
      {...props}
      title={title ?? " "}
      icon={<LangBadge lang={langFromChildren(children)} />}
    >
      <Pre>{children}</Pre>
    </CodeBlock>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    pre: CodeBlockWithHeader,
    table: Table,
    ComponentPreview,
    ComponentInstall,
    MCPInstall,
    BackgroundShowcase,
    PreviewCard,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
