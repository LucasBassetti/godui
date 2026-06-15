"use client";

import { CopyButton } from "@/components/copy-button";
import { DocsPanel, DocsTabs, PillTabs } from "@/components/docs-tabs";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useMemo, useState } from "react";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

type ComponentInstallProps = {
  packageName?: string;
  componentName?: string;
};

const packageManagers: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];

function getInstallCommand(manager: PackageManager, packageName: string) {
  switch (manager) {
    case "pnpm":
      return `pnpm add ${packageName}`;
    case "npm":
      return `npm install ${packageName}`;
    case "yarn":
      return `yarn add ${packageName}`;
    case "bun":
      return `bun add ${packageName}`;
  }
}

export function ComponentInstall({
  packageName = "@godui/components",
  componentName = "MagicButton",
}: ComponentInstallProps) {
  const [tab, setTab] = useState("cli");
  const [manager, setManager] = useState<PackageManager>("pnpm");

  const installCommand = useMemo(
    () => getInstallCommand(manager, packageName),
    [manager, packageName],
  );

  const manualStylesCode = `@import "${packageName}/styles.css";`;

  const manualImportCode = `import { ${componentName} } from "${packageName}";`;

  return (
    <DocsPanel className="my-6">
      <DocsTabs
        tabs={[
          { value: "cli", label: "CLI" },
          { value: "manual", label: "Manual" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "cli" ? (
        <div className="component-install-cli mt-4 overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-fd-border px-4 py-3">
            <PillTabs
              tabs={packageManagers.map((value) => ({ value, label: value }))}
              value={manager}
              onChange={(value) => setManager(value as PackageManager)}
            />
            <CopyButton value={installCommand} />
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-sm text-fd-foreground">
            <code>{installCommand}</code>
          </pre>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-fd-muted-foreground">
            Install the package, import the stylesheet once, then import the
            component in your app.
          </p>

          <div className="space-y-2">
            <p className="text-sm font-medium text-fd-foreground">
              1. Add styles to your app entry
            </p>
            <DynamicCodeBlock
              lang="css"
              code={manualStylesCode}
              codeblock={{ allowCopy: true, className: "my-0" }}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-fd-foreground">
              2. Import the component
            </p>
            <DynamicCodeBlock
              lang="tsx"
              code={manualImportCode}
              codeblock={{ allowCopy: true, className: "my-0" }}
            />
          </div>
        </div>
      )}
    </DocsPanel>
  );
}
