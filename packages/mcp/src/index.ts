import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRegistryClient, registryBaseUrl } from "./registry-client.js";
import { getComponent, listComponents, searchComponents } from "./tools.js";

const client = createRegistryClient();

const server = new McpServer({
  name: "godui",
  version: "0.1.0",
});

const text = (value: string) => ({
  content: [{ type: "text" as const, text: value }],
});

server.registerTool(
  "list_components",
  {
    title: "List GodUI components",
    description:
      "List every GodUI component in the catalog (name, title, description, category, install command). Call this first to see what's available. Optionally filter by category such as Buttons, Text, Effects, Backgrounds.",
    inputSchema: {
      category: z
        .string()
        .optional()
        .describe(
          "Optional category filter, e.g. 'Buttons', 'Text', 'Effects', 'Backgrounds'.",
        ),
    },
  },
  async ({ category }) => text(await listComponents(client, category)),
);

server.registerTool(
  "search_components",
  {
    title: "Search GodUI components",
    description:
      "Find GodUI components by what they do. Use natural language, e.g. '3d button', 'marquee of logos', 'animated gradient background', 'number counter'. Returns the best matches to then fetch with get_component.",
    inputSchema: {
      query: z
        .string()
        .describe("What you want the component to do, in plain words."),
    },
  },
  async ({ query }) => text(await searchComponents(client, query)),
);

server.registerTool(
  "get_component",
  {
    title: "Get a GodUI component",
    description:
      "Fetch a single GodUI component by its exact name (from list_components or search_components). Returns the install command, dependencies, and full source code so you can install it or write the files directly. For background components, pass an optional variant.",
    inputSchema: {
      name: z
        .string()
        .describe(
          "Exact component name, e.g. 'magic-button' (the '@godui/' prefix is optional).",
        ),
      variant: z
        .string()
        .optional()
        .describe(
          "Optional variant for background components, e.g. 'aurora-glow'.",
        ),
    },
  },
  async ({ name, variant }) => text(await getComponent(client, name, variant)),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr is safe; stdout is reserved for the MCP protocol stream.
  console.error(`GodUI MCP server running (registry: ${registryBaseUrl})`);
}

main().catch((error) => {
  console.error("GodUI MCP server failed to start:", error);
  process.exit(1);
});
