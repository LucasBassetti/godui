// Core (`@godui/*`) and Extras (`@godui-extras/*`) are separate registries, but
// legacy `/r/<name>.json` URLs rewrite to Extras and the MCP catalog is keyed by
// name — so an item name may exist in only one of them.
export function assertNoCollisions(coreItems, extrasItems) {
  const core = new Set(coreItems.map((item) => item.name));
  const dupes = extrasItems
    .map((item) => item.name)
    .filter((name) => core.has(name));
  if (dupes.length > 0) {
    throw new Error(
      `Registry item names exist in both registry.json and registry-extras.json: ${dupes.join(", ")}`,
    );
  }
}
