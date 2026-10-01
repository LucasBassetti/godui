import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Until wave 1 ships core shadcn components, /docs/components is a placeholder,
// so the homepage's primary CTA must land on the populated Extras catalog.
const html = readFileSync(
  new URL("../.next/server/app/index.html", import.meta.url),
  "utf8",
);

test("homepage Browse Components CTA links to the Extras catalog", () => {
  const cta = html.match(
    /<a[^>]*href="([^"]+)"[^>]*>(?:(?!<\/a>).)*Browse Components/s,
  );
  assert.ok(cta, "Could not find the Browse Components CTA");
  assert.equal(cta[1], "/docs/extras");
});

test("footer links to Extras", () => {
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer, "Could not find the footer");
  assert.match(footer, /<a[^>]*href="\/docs\/extras"[^>]*>Extras<\/a>/);
});
