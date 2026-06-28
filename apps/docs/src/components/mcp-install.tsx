"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { DocsPanel, PillTabs, Segmented } from "@/components/docs-tabs";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const packageManagers: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];

/** Editors whose config the `@godui/cli` installer can write. */
const clients = [
  { value: "cursor", label: "Cursor" },
  { value: "windsurf", label: "Windsurf" },
  { value: "claude", label: "Claude" },
  { value: "cline", label: "Cline" },
  { value: "roo-cline", label: "Roo-Cline" },
];

const MANUAL_CONFIG = `{
  "mcpServers": {
    "godui": {
      "command": "npx",
      "args": ["-y", "@godui/mcp@latest"]
    }
  }
}`;

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

export function MCPInstall() {
  const [tab, setTab] = useState("cli");
  const [manager, setManager] = useState<PackageManager>("pnpm");
  const [client, setClient] = useState("cursor");

  const cliCommand = `${getExecPrefix(manager)} @godui/cli@latest install ${client}`;

  return (
    <DocsPanel className="my-6">
      <Segmented
        tabs={[
          { value: "cli", label: "CLI" },
          { value: "manual", label: "Manual" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "cli" ? (
        <div className="mt-4 space-y-3">
          <PillTabs tabs={clients} value={client} onChange={setClient} />
          <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm">
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
          <p className="text-sm text-fd-muted-foreground">
            Then restart your IDE. The installer writes the GodUI server into{" "}
            {clients.find((c) => c.value === client)?.label}&apos;s MCP config
            without touching your other servers.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-fd-muted-foreground">
            Add the following to your MCP config file, then restart your IDE:
          </p>
          <DynamicCodeBlock
            lang="json"
            code={MANUAL_CONFIG}
            codeblock={{ allowCopy: true, className: "my-0" }}
          />
        </div>
      )}
    </DocsPanel>
  );
}
