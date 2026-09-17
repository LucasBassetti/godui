import assert from "node:assert/strict";
import { test } from "node:test";

import { freeDevPort, parsePids, parsePort } from "./free-dev-port.mjs";

test("accepts valid decimal ports", () => {
  assert.equal(parsePort("1"), 1);
  assert.equal(parsePort("3000"), 3000);
  assert.equal(parsePort("65535"), 65535);
  assert.equal(parsePort(undefined), 3000);
});

test("rejects non-decimal and out-of-range ports", () => {
  for (const value of ["0", "65536", "3000.0", "+3000", "0xBB8", " "]) {
    assert.equal(parsePort(value), null, value);
  }
});

test("does not pass shell metacharacters to lsof", () => {
  const calls = [];
  const errors = [];

  assert.equal(
    freeDevPort({
      portValue: "3000; touch /tmp/port-was-injected",
      runLsofCommand(args) {
        calls.push(args);
        return "";
      },
      onInvalidPort(message) {
        errors.push(message);
      },
    }),
    false,
  );

  assert.deepEqual(calls, []);
  assert.equal(errors.length, 1);
});

test("passes a validated port as an lsof argument", () => {
  const calls = [];

  assert.equal(
    freeDevPort({
      portValue: "4242",
      runLsofCommand(args) {
        calls.push(args);
        return "";
      },
    }),
    true,
  );

  assert.deepEqual(calls, [["-nP", "-iTCP:4242", "-sTCP:LISTEN", "-t"]]);
});

test("only accepts positive safe integer PIDs from lsof", () => {
  assert.deepEqual(
    parsePids("123\n0\n-1\n123; touch /tmp/port-was-injected\n456\n"),
    [123, 456],
  );
});
