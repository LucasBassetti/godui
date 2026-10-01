import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// The homepage's primary CTA lands on the core shadcn drop-ins; Extras stay
// one click away in the footer.
const html = readFileSync(
  new URL("../.next/server/app/index.html", import.meta.url),
  "utf8",
);

test("homepage Browse Components CTA links to the core catalog", () => {
  const cta = html.match(
    /<a[^>]*href="([^"]+)"[^>]*>(?:(?!<\/a>).)*Browse Components/s,
  );
  assert.ok(cta, "Could not find the Browse Components CTA");
  assert.equal(cta[1], "/docs/components");
});

test("footer links to Components and Extras", () => {
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer, "Could not find the footer");
  assert.match(footer, /<a[^>]*href="\/docs\/components"[^>]*>Components<\/a>/);
  assert.match(footer, /<a[^>]*href="\/docs\/extras"[^>]*>Extras<\/a>/);
});
