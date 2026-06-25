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
      "args": ["-y", "@godui/mcp@latest"]
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

The server fetches the live GodUI registry at `https://godui.design/r`, so it
always serves the latest components without an update. Override the base for
local testing:

```bash
GODUI_REGISTRY_URL=http://localhost:3000/r npx @godui/mcp@latest
```

## License

MIT
