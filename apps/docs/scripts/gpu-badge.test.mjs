import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Badge labels are serialized into the RSC payload as "label":"<text>". Match
// those, not bare text — the sidebar tree also contains "GPU-only Motion".
const labels = (path) => {
  const html = readFileSync(
    new URL(`../.next/server/app/docs/extras/${path}.html`, import.meta.url),
    "utf8",
  );
  return [...html.matchAll(/\\"label\\":\\"([^"\\]+)\\"/g)].map((m) => m[1]);
};

test("a paint-animating Extra does not claim GPU-only", () => {
  // magnetic-button animates only paint and has no curated motion note.
  const found = labels("buttons/magnetic-button");
  assert.ok(!found.includes("GPU-only"), `labels: ${found.join(", ")}`);
  assert.ok(found.includes("Paint"), `labels: ${found.join(", ")}`);
});

test("a compositor-only Extra keeps the GPU-only badge", () => {
  assert.ok(labels("layout/tilt-card").includes("GPU-only"));
});

test("dock (width/height from motion values) is not GPU-only", () => {
  const found = labels("navigation/dock");
  assert.ok(!found.includes("GPU-only"), `labels: ${found.join(", ")}`);
  assert.ok(found.includes("Layout"), `labels: ${found.join(", ")}`);
});
