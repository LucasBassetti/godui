"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { DocsPanel, DocsTabs, PillTabs } from "@/components/docs-tabs";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

type RegistryFile = {
  path: string;
  target?: string;
  content: string;
};

type RegistryItem = {
  dependencies?: string[];
  files?: RegistryFile[];
};

type ComponentInstallProps = {
  /** Registry item name, e.g. "magic-button" — resolved as @godui/<name>. */
  name?: string;
  /** PascalCase component name; converted to a kebab-case registry item. */
  componentName?: string;
};

function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

const packageManagers: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];

const REGISTRY_BASE = "https://godui.design/r";

function getExecPrefix(manager: PackageManager) {
  switch (manager) {
    case "pnpm":
      return "pnpm dlx";
    case "npm":
      return "npx";
    case "yarn":
      return "npx";
    case "bun":
      return "bunx --bun";
  }
}

function getAddPrefix(manager: PackageManager) {
  switch (manager) {
    case "pnpm":
      return "pnpm add";
    case "npm":
      return "npm install";
    case "yarn":
      return "yarn add";
    case "bun":
      return "bun add";
  }
}

function langFromPath(path: string) {
  if (path.endsWith(".tsx")) return "tsx";
  if (path.endsWith(".ts")) return "ts";
  if (path.endsWith(".css")) return "css";
  return "tsx";
}

export function ComponentInstall({
  name,
  componentName,
}: ComponentInstallProps) {
  const itemName =
    name ?? (componentName ? toKebabCase(componentName) : "magic-button");
  const [tab, setTab] = useState("cli");
  const [manager, setManager] = useState<PackageManager>("pnpm");
  const [item, setItem] = useState<RegistryItem | null>(null);
  const [error, setError] = useState(false);

  const cliCommand = useMemo(
    () => `${getExecPrefix(manager)} shadcn@latest add @godui/${itemName}`,
    [manager, itemName],
  );

  // Pull the built registry item so the Manual tab can show the source directly.
  useEffect(() => {
    let active = true;
    setItem(null);
    setError(false);
    fetch(`/r/${itemName}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.json();
      })
      .then((data: RegistryItem) => {
        if (active) setItem(data);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [itemName]);

  const dependencies = item?.dependencies ?? [];
  const depsCommand =
    dependencies.length > 0
      ? `${getAddPrefix(manager)} ${dependencies.join(" ")}`
      : null;

  const registryConfig = `{
  "registries": {
    "@godui": "${REGISTRY_BASE}/{name}.json"
  }
}`;

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
        <div className="mt-4 space-y-3">
          <div className="component-install-cli overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-fd-border px-4 py-3">
              <PillTabs
                tabs={packageManagers.map((value) => ({ value, label: value }))}
                value={manager}
                onChange={(value) => setManager(value as PackageManager)}
              />
              <CopyButton value={cliCommand} />
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-sm text-fd-foreground">
              <code>{cliCommand}</code>
            </pre>
          </div>
          <p className="text-sm text-fd-muted-foreground">
            Requires the <code>@godui</code> namespace in your{" "}
            <code>components.json</code> (one-time setup):
          </p>
          <DynamicCodeBlock
            lang="json"
            code={registryConfig}
            codeblock={{ allowCopy: true, className: "my-0" }}
          />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {error ? (
            <p className="text-sm text-fd-muted-foreground">
              Could not load the source for <code>@godui/{itemName}</code>. Use
              the CLI tab, or browse{" "}
              <a
                className="underline"
                href={`${REGISTRY_BASE}/${itemName}.json`}
              >
                the registry item
              </a>
              .
            </p>
          ) : !item ? (
            <p className="text-sm text-fd-muted-foreground">Loading source…</p>
          ) : (
            <>
              {depsCommand ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-fd-foreground">
                    1. Install dependencies
                  </p>
                  <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-fd-border px-4 py-3">
                      <PillTabs
                        tabs={packageManagers.map((value) => ({
                          value,
                          label: value,
                        }))}
                        value={manager}
                        onChange={(value) =>
                          setManager(value as PackageManager)
                        }
                      />
                      <CopyButton value={depsCommand} />
                    </div>
                    <pre className="overflow-x-auto px-4 py-4 font-mono text-sm text-fd-foreground">
                      <code>{depsCommand}</code>
                    </pre>
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <p className="text-sm font-medium text-fd-foreground">
                  {depsCommand ? "2." : "1."} Copy the component into your
                  project
                </p>
                {(item.files ?? []).map((file) => (
                  <div key={file.target ?? file.path} className="space-y-1">
                    <p className="font-mono text-xs text-fd-muted-foreground">
                      {file.target ?? file.path}
                    </p>
                    <DynamicCodeBlock
                      lang={langFromPath(file.target ?? file.path)}
                      code={file.content}
                      codeblock={{ allowCopy: true, className: "my-0" }}
                    />
                  </div>
                ))}
              </div>

              <p className="text-sm text-fd-muted-foreground">
                Update the import paths to match your project, and make sure the
                GoDUI theme tokens are present (install any component via the
                CLI once, or add <code>@godui/godui-theme</code>).
              </p>
            </>
          )}
        </div>
      )}
    </DocsPanel>
  );
}
