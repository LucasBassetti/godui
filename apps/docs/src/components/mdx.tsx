import { ComponentInstall } from "@/components/component-install";
import { ComponentPreview } from "@/components/component-preview";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

function Table(props: ComponentProps<"table">) {
  return (
    <div className="docs-table-wrapper not-prose my-6 overflow-x-auto">
      <table className="docs-table w-full text-sm" {...props} />
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    table: Table,
    ComponentPreview,
    ComponentInstall,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
