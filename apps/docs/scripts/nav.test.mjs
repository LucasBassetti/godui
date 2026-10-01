import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const page = (p) => new URL(`../.next/server/app/${p}`, import.meta.url);

test("Extras pages show the Extras tab's own sidebar", () => {
  const html = readFileSync(page("docs/extras/layout/tilt-card.html"), "utf8");
  assert.match(html, /href="\/docs\/extras\/text\/aurora-text"/);
  // Getting-started pages live outside the Extras root folder.
  assert.doesNotMatch(html, /href="\/docs\/installation"/);
});

test("the GPU-only motion guideline is built", () => {
  const file = page("docs/guidelines/motion.html");
  assert.ok(existsSync(file), "missing /docs/guidelines/motion");
  const html = readFileSync(file, "utf8");
  for (const word of [
    "transform",
    "opacity",
    "filter",
    "prefers-reduced-motion",
  ]) {
    assert.ok(html.includes(word), `guideline should mention ${word}`);
  }
});

test("core component pages get the GPU-only badge and a Learn tab", () => {
  const html = readFileSync(page("docs/components/button.html"), "utf8");
  // Badge labels are serialized into the RSC payload as \"label\":\"<text>\".
  const labels = [...html.matchAll(/\\"label\\":\\"([^"\\]+)\\"/g)].map(
    (m) => m[1],
  );
  assert.ok(labels.includes("GPU-only"), `labels: ${labels.join(", ")}`);
  assert.ok(labels.includes("shadcn/ui"), `labels: ${labels.join(", ")}`);
  assert.match(html, /href="\/docs\/components\/button\/learn"/);
  assert.ok(existsSync(page("docs/components/button/learn.html")));
});
