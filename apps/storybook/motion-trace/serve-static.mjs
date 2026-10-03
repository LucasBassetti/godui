// Minimal static server for storybook-static/ — used by playwright.config.ts.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../storybook-static/", import.meta.url));
const PORT = Number(process.env.PORT ?? 6007);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let path = normalize(join(ROOT, decodeURIComponent(url.pathname)));
  if (!path.startsWith(ROOT)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(path) && statSync(path).isDirectory())
    path = join(path, "index.html");
  if (!existsSync(path)) {
    res.writeHead(404).end("Not found");
    return;
  }
  res.writeHead(200, {
    "content-type": TYPES[extname(path)] ?? "application/octet-stream",
  });
  createReadStream(path).pipe(res);
}).listen(PORT, "127.0.0.1");
