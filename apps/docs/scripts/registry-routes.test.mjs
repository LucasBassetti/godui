import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import next from "next";

// Serves the production build (`pnpm build`) and resolves registry and docs
// URLs through Next's real routing: public files, rewrites, redirects and the
// dynamic background route. The Lab registry used to be called Extras, so
// components.json files that map "@godui-extras" to /r/extras/{name}.json and
// pre-split /r/{name}.json URLs must keep returning the same JSON.

const dir = fileURLToPath(new URL("..", import.meta.url));
let server;
let origin;

before(async () => {
  const app = next({ dir, dev: false, quiet: true });
  await app.prepare();
  const handle = app.getRequestHandler();
  server = createServer((req, res) => handle(req, res));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server?.closeAllConnections?.();
  server?.close();
});

const get = (path) => fetch(`${origin}${path}`, { redirect: "manual" });

const json = async (path) => {
  const res = await get(path);
  assert.equal(res.status, 200, `${path} → ${res.status}`);
  return res.json();
};

const built = (path) =>
  JSON.parse(
    readFileSync(new URL(`../public/r/${path}`, import.meta.url), "utf8"),
  );

test("/r/lab/<name>.json serves the built Lab item", async () => {
  assert.deepEqual(
    await json("/r/lab/magic-button.json"),
    built("lab/magic-button.json"),
  );
});

test("/r/extras/<name>.json and /r/<name>.json return the same JSON, no redirect", async () => {
  const lab = await json("/r/lab/magic-button.json");
  assert.deepEqual(await json("/r/extras/magic-button.json"), lab);
  assert.deepEqual(await json("/r/magic-button.json"), lab);
});

test("core items still resolve at /r/<name>.json", async () => {
  assert.deepEqual(await json("/r/button.json"), built("button.json"));
});

test("parameterized background installs resolve under /r/lab and /r/extras", async () => {
  const query = "?variant=cyan-radial-glow";
  const plain = await json("/r/lab/gradient-background.json");
  const lab = await json(`/r/lab/gradient-background.json${query}`);
  assert.equal(lab.name, "gradient-background");
  assert.notEqual(lab.files[0].content, plain.files[0].content);
  assert.deepEqual(
    await json(`/r/extras/gradient-background.json${query}`),
    lab,
  );
  assert.deepEqual(await json(`/r/gradient-background.json${query}`), lab);
});

test("old Extras and pre-pivot docs URLs 308 to /docs/lab in one hop", async () => {
  for (const [from, to] of [
    ["/docs/extras", "/docs/lab"],
    ["/docs/extras/buttons/magic-button", "/docs/lab/buttons/magic-button"],
    [
      "/docs/extras/buttons/magic-button/learn",
      "/docs/lab/buttons/magic-button/learn",
    ],
    ["/docs/components/buttons/magic-button", "/docs/lab/buttons/magic-button"],
  ]) {
    const res = await get(from);
    assert.equal(res.status, 308, `${from} → ${res.status}`);
    assert.equal(new URL(res.headers.get("location"), origin).pathname, to);
    assert.equal((await get(to)).status, 200, `${to} should render`);
  }
});
