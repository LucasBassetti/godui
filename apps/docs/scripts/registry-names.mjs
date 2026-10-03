// Core (`@godui/*`) and Lab (`@godui-lab/*`) are separate registries, but
// legacy `/r/<name>.json` URLs rewrite to Lab and the MCP catalog is keyed by
// name — so an item name may exist in only one of them.
export function assertNoCollisions(coreItems, labItems) {
  const core = new Set(coreItems.map((item) => item.name));
  const dupes = labItems
    .map((item) => item.name)
    .filter((name) => core.has(name));
  if (dupes.length > 0) {
    throw new Error(
      `Registry item names exist in both registry.json and registry-lab.json: ${dupes.join(", ")}`,
    );
  }
}
