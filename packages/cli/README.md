# @godui/cli

One command to add the [GodUI MCP server](https://www.npmjs.com/package/@godui/mcp)
to your AI IDE. It writes the MCP config for you — no manual JSON editing.

## Usage

```bash
npx @godui/cli@latest install cursor
```

Then **restart your IDE** and ask it for any GodUI component.

### Supported clients

```bash
npx @godui/cli@latest install <client>
```

- `cursor`
- `windsurf`
- `claude` (Claude Desktop)
- `cline`
- `roo-cline`

The command merges the GodUI server into the client's existing MCP config
(creating it if needed) without touching your other servers.

## What it writes

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

Prefer to do it by hand? See the [Manual install](https://godui.design/docs/mcp).

## License

MIT
