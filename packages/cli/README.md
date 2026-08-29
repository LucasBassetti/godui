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

The installer writes the approved MCP release `@godui/mcp@0.1.0`, rather than
npm's mutable `latest` tag. Update the pin only after reviewing and publishing
a new MCP release, then release a new CLI version.

## What it writes

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

Prefer to do it by hand? See the [Manual install](https://godui.design/docs/mcp).

## License

MIT
