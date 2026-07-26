import { Children, isValidElement, type ReactNode } from "react";
import { Example, type ExampleProps } from "@/components/workbench/example";
import { WorkbenchClient } from "@/components/workbench/workbench-client";

/**
 * Server-side entry for the full-bleed component workbench. It partitions its
 * MDX children — <Example> elements become stage tabs, everything else becomes
 * the Docs drawer body — then hands the split to the interactive client shell.
 *
 * The partition MUST happen here (a server component): MDX creates <Example>
 * from the same client reference this module imports, so `child.type === Example`
 * matches. Across the server → client boundary that identity is lost, so doing
 * it inside the client shell would find zero examples.
 */
export function Workbench({ children }: { children: ReactNode }) {
  const examples: ExampleProps[] = [];
  const docs: ReactNode[] = [];

  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && child.type === Example) {
      examples.push(child.props as ExampleProps);
    } else {
      docs.push(child);
    }
  }

  return <WorkbenchClient examples={examples} docs={docs} />;
}
