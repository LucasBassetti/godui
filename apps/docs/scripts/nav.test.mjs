import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const page = (p) => new URL(`../.next/server/app/${p}`, import.meta.url);

test("Lab pages show the Lab tab's own sidebar", () => {
  const html = readFileSync(page("docs/lab/layout/tilt-card.html"), "utf8");
  assert.match(html, /href="\/docs\/lab\/text\/aurora-text"/);
  // Getting-started pages live outside the Lab root folder.
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

const sidebarOf = (html) => {
  const start = html.indexOf('id="nd-sidebar"');
  assert.ok(start > -1, "no sidebar found");
  return html.slice(start, html.indexOf("</aside>", start));
};

// Page-tree links only (they carry data-active); the drawer's mobile-only
// header mirror (Components / Lab / Animated Icons) is not the nav.
const treeLinks = (sidebar) =>
  [...sidebar.matchAll(/<a data-active="[^"]*"[^>]*href="([^"]+)"/g)].map(
    (m) => m[1],
  );

test("components are listed in the main sidebar; Lab isn't", () => {
  const links = treeLinks(
    sidebarOf(readFileSync(page("docs/installation.html"), "utf8")),
  );
  assert.ok(links.includes("/docs/components/accordion"), links.join(" "));
  assert.ok(links.includes("/docs/components/tooltip"), links.join(" "));
  assert.ok(!links.some((href) => href.startsWith("/docs/lab")));
});

test("a component page keeps the same main sidebar", () => {
  const sidebar = sidebarOf(
    readFileSync(page("docs/components/dialog.html"), "utf8"),
  );
  assert.match(sidebar, /href="\/docs\/installation"/);
  assert.match(sidebar, /href="\/docs\/components\/accordion"/);
});

test("the components index shows a preview for every component", () => {
  const html = readFileSync(page("docs/components.html"), "utf8");
  const previews = html.match(/class="preview-zone /g) ?? [];
  const { pages } = JSON.parse(
    readFileSync(
      new URL("../content/docs/components/meta.json", import.meta.url),
      "utf8",
    ),
  );
  // Fumadocs separators (`---Label---`) are headings, not components.
  const components = pages.filter((p) => !/^---.*---$/.test(p));
  assert.equal(previews.length, components.length);
});

test("core components carry no New badge", () => {
  const sidebar = sidebarOf(
    readFileSync(page("docs/installation.html"), "utf8"),
  );
  assert.doesNotMatch(sidebar, />New<\/span>/);
});

test("the header links Components and Lab", () => {
  const html = readFileSync(page("docs/installation.html"), "utf8");
  const header = html.slice(0, html.indexOf('id="nd-sidebar"'));
  assert.match(header, /<a[^>]*href="\/docs\/components"[^>]*>Components<\/a>/);
  assert.match(header, /<a[^>]*href="\/docs\/lab"[^>]*>Lab<\/a>/);
  assert.doesNotMatch(header, />Extras</);
});
