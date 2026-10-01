import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { collectCoreViolations } from "./collect";

function fixture(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), "godui-gate-"));
  for (const [rel, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), content);
  }
  return root;
}

const collect = (root: string) =>
  collectCoreViolations({
    srcDir: join(root, "src"),
    stylesPath: join(root, "styles.css"),
    registryPath: join(root, "registry.json"),
  });

describe("collectCoreViolations", () => {
  it("finds violations in tsx, styles.css and registry css", () => {
    const root = fixture({
      "src/ui/bad.tsx": `export const B = () => <b className="transition-colors" />;`,
      "src/ui/bad.test.tsx": `<b className="transition-colors" />`,
      "styles.css": "@keyframes k { to { height: 0 } }",
      "registry.json": JSON.stringify({
        items: [
          { name: "x", css: { "@keyframes r": { to: { color: "red" } } } },
        ],
      }),
    });
    const found = collect(root).map((v) => `${v.file}:${v.prop}`);
    expect(found).toEqual(
      expect.arrayContaining([
        "ui/bad.tsx:color",
        "ui/bad.tsx:backgroundcolor",
        "styles.css:height",
        "registry.json#x:color",
      ]),
    );
    expect(found.some((f) => f.startsWith("ui/bad.test.tsx"))).toBe(false);
  });

  it("returns nothing for GPU-only sources", () => {
    const root = fixture({
      "src/ui/ok.tsx": `export const O = () => <b className="transition-opacity" />;`,
      "styles.css": "@keyframes k { from { opacity: 0; scale: .96 } }",
      "registry.json": JSON.stringify({ items: [] }),
    });
    expect(collect(root)).toEqual([]);
  });
});
