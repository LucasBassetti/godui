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

type CssNode = string | { [key: string]: CssNode };

type RegistryItem = {
  dependencies?: string[];
  files?: RegistryFile[];
  /** CSS-in-JSON block the CLI injects into the user's global stylesheet. */
  css?: Record<string, CssNode>;
};

type DownloadAsset = {
  /** File name shown in the list, e.g. "mask-nature.png". */
  label: string;
  /** Public URL to download the asset from. */
  href: string;
};

type ComponentInstallProps = {
  /** Registry item name, e.g. "magic-button" — resolved as @godui/<name>. */
  name?: string;
  /** PascalCase component name; converted to a kebab-case registry item. */
  componentName?: string;
  /**
   * Registry variant to bake into the install (e.g. a background pattern id).
   * When set, the command + Manual source append the `?variant=` query served
   * by the dynamic registry route.
   */
  variant?: string;
  /**
   * Static assets the component needs that can't ship through the registry
   * (e.g. sprite-sheet images). Rendered as a download step in the Manual tab.
   */
  assets?: DownloadAsset[];
  /** Folder the assets must be saved to, relative to the project root. */
  assetsTarget?: string;
};

function TerminalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[15px] shrink-0 text-fd-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 17 6-6-6-6" />
      <path d="M12 19h8" />
    </svg>
  );
}

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

/**
 * Serialize the registry's CSS-in-JSON block back into a plain CSS string so
 * Manual-install users can copy it into their global stylesheet (the CLI does
 * this for them automatically).
 */
function cssObjectToString(node: Record<string, CssNode>, depth = 0): string {
  const pad = "  ".repeat(depth);
  return Object.entries(node)
    .map(([key, value]) =>
      typeof value === "string"
        ? `${pad}${key}: ${value};`
        : `${pad}${key} {\n${cssObjectToString(value, depth + 1)}\n${pad}}`,
    )
    .join("\n");
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
  variant,
  assets,
  assetsTarget,
}: ComponentInstallProps) {
  const itemName =
    name ?? (componentName ? toKebabCase(componentName) : "magic-button");
  const query = variant ? `?variant=${variant}` : "";
  const [tab, setTab] = useState("cli");
  const [manager, setManager] = useState<PackageManager>("pnpm");
  const [item, setItem] = useState<RegistryItem | null>(null);
  const [error, setError] = useState(false);

  // Reset the loaded source when the target item (name + variant) changes.
  // Doing this during render (rather than in the effect) avoids a
  // cascading-render setState.
  const loadKey = `${itemName}${query}`;
  const [loadedFor, setLoadedFor] = useState(loadKey);
  if (loadedFor !== loadKey) {
    setLoadedFor(loadKey);
    setItem(null);
    setError(false);
  }

  const cliCommand = useMemo(
    () =>
      `${getExecPrefix(manager)} shadcn@latest add "${REGISTRY_BASE}/${itemName}.json${query}"`,
    [manager, itemName, query],
  );

  // Pull the built registry item so the Manual tab can show the source directly.
  useEffect(() => {
    let active = true;
    fetch(`/r/${itemName}.json${query}`)
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
  }, [itemName, query]);

  const dependencies = item?.dependencies ?? [];
  const depsCommand =
    dependencies.length > 0
      ? `${getAddPrefix(manager)} ${dependencies.join(" ")}`
      : null;

  const cssText = item?.css ? cssObjectToString(item.css) : "";
  const hasDeps = Boolean(depsCommand);
  const hasCss = cssText.length > 0;
  const hasAssets = Boolean(assets && assets.length > 0);
  let step = 0;
  const depsStep = hasDeps ? ++step : 0;
  const copyStep = ++step;
  const cssStep = hasCss ? ++step : 0;
  const assetsStep = hasAssets ? ++step : 0;

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
            <div className="flex items-center gap-3 px-4 py-4">
              <TerminalIcon />
              <pre className="overflow-x-auto font-mono text-sm text-fd-foreground">
                <code>{cliCommand}</code>
              </pre>
            </div>
          </div>
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
                    {depsStep}. Install dependencies
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
                    <div className="flex items-center gap-3 px-4 py-4">
                      <TerminalIcon />
                      <pre className="overflow-x-auto font-mono text-sm text-fd-foreground">
                        <code>{depsCommand}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <p className="text-sm font-medium text-fd-foreground">
                  {copyStep}. Copy the component into your project
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

              {hasCss ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-fd-foreground">
                    {cssStep}. Add the styles to your global CSS
                  </p>
                  <p className="text-sm text-fd-muted-foreground">
                    Paste these rules into the same stylesheet that imports
                    Tailwind (e.g. <code>globals.css</code>).
                  </p>
                  <DynamicCodeBlock
                    lang="css"
                    code={cssText}
                    codeblock={{ allowCopy: true, className: "my-0" }}
                  />
                </div>
              ) : null}

              {hasAssets ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-fd-foreground">
                    {assetsStep}. Download the mask assets
                  </p>
                  <p className="text-sm text-fd-muted-foreground">
                    The component&apos;s CSS references these sprite-sheet
                    images by an absolute path. Download them and save them to{" "}
                    <code>{assetsTarget ?? "public/masks/"}</code> so the
                    <code> url(…)</code> references resolve.
                  </p>
                  <ul className="space-y-1">
                    {assets?.map((asset) => (
                      <li key={asset.href}>
                        <a
                          className="font-mono text-sm text-fd-primary underline underline-offset-2"
                          href={asset.href}
                          download
                        >
                          {asset.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <p className="text-sm text-fd-muted-foreground">
                Update the import paths to match your project, and make sure the
                GodUI theme tokens are present (install any component via the
                CLI once, or add <code>@godui/godui-theme</code>).
              </p>
            </>
          )}
        </div>
      )}
    </DocsPanel>
  );
}
