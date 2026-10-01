import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as extras from "./index";

const SRC = dirname(fileURLToPath(import.meta.url));

const SUPERSEDED = [
  "accordion",
  "dropdown-menu",
  "toast",
  "drawer",
  "context-menu",
  "combobox",
  "command-palette",
];

const SUPERSEDED_EXPORTS = [
  "Accordion",
  "DropdownMenu",
  "ToastProvider",
  "toast",
  "Drawer",
  "ContextMenu",
  "Combobox",
  "CommandPalette",
];

describe("superseded components are removed from extras", () => {
  it.each(SUPERSEDED)("%s source dir is gone", (name) => {
    expect(existsSync(join(SRC, name))).toBe(false);
  });

  it.each(SUPERSEDED_EXPORTS)("%s is not exported", (name) => {
    expect(name in extras).toBe(false);
  });
});
