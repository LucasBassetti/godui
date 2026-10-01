import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// magnetic-button animates only paint (no layout) and has no curated motion
// note: the strict GPU report must still keep it from claiming "GPU-only".
const html = readFileSync(
  new URL(
    "../.next/server/app/docs/extras/buttons/magnetic-button.html",
    import.meta.url,
  ),
  "utf8",
);

test("a paint-animating Extra does not claim GPU-only", () => {
  assert.ok(!html.includes("GPU-only"), "page claims GPU-only");
  assert.ok(html.includes("Paint"), "page should show the Paint badge");
});
