import assert from "node:assert/strict";
import { test } from "node:test";
import { assertNoCollisions } from "./registry-names.mjs";

test("throws when core and extras share an item name", () => {
  assert.throws(
    () => assertNoCollisions([{ name: "button" }], [{ name: "button" }]),
    /button/,
  );
});

test("passes when names are unique", () => {
  assert.doesNotThrow(() =>
    assertNoCollisions([{ name: "button" }], [{ name: "magic-button" }]),
  );
});
