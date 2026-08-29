# @godui/mcp

Model Context Protocol server for [GodUI](https://godui.design). Add it to your
AI IDE and ask for any GodUI component by description — the agent discovers it,
gets the install command, and writes the source for you.

## Install

### Manual (any MCP client)

Add this to your MCP config file:

```json
{
  "mcpServers": {
    "godui": {
      "command": "npx",
      "args": ["-y", "@godui/mcp@0.1.0"]
    }
  }
}
```

Then **restart your IDE**.

- **Cursor** — `~/.cursor/mcp.json` (or `.cursor/mcp.json` in a project)
- **Windsurf** — `~/.codeium/windsurf/mcp_config.json`
- **Claude Desktop** — `claude_desktop_config.json`
- **Cline / Roo-Cline** — the MCP settings JSON in the extension

## Usage

Ask your IDE to use any GodUI component:

- "Add a GodUI magic button"
- "Add a marquee of logos"
- "Add an animated gradient background"
- "Add a number ticker that counts to 1000"

## Tools

- **`list_components`** — list the full catalog, optionally filtered by category.
- **`search_components`** — find components by what they do (natural language).
- **`get_component`** — fetch one component's install command + full source.

## How it works

The server fetches the live GodUI registry at `https://godui.design/r`, so a new
process serves the latest components without an MCP package update. Responses
are cached only for the lifetime of that process; failed or invalid responses
are not replaced with stale data. The default catalog is freshness-first, not
an immutable snapshot. For reproducible or rollback runs, point the client at
an immutable registry snapshot and pin its revision:

```bash
GODUI_REGISTRY_URL=https://raw.githubusercontent.com/godui-design/godui/<revision>/apps/docs/public/r \
GODUI_REGISTRY_REVISION=<revision> npx @godui/mcp@0.1.0
```

The CLI writes the exact `@godui/mcp@0.1.0` release into IDE configuration;
new releases require review and a new CLI release. Registry indexes identify
their source revision, and the build/release workflow records npm provenance.
See the [MCP registry policy](https://github.com/godui-design/godui/blob/main/MCP_REGISTRY_POLICY.md)
for integrity, audit, and rollback requirements.

## License

MIT
