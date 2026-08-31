import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  type CatalogIndex,
  createRegistryClient,
  type RegistryManifest,
} from "./registry-client.js";

const revision = "revision-a";
const index: CatalogIndex = {
  name: "godui",
  homepage: "https://godui.design",
  components: [],
};
const component = { name: "magic-button" };

function jsonBody(value: unknown): string {
  return JSON.stringify(value);
}

function digest(value: unknown): string {
  return createHash("sha256").update(jsonBody(value)).digest("hex");
}

function manifestFor(
  entries: Record<string, unknown>,
  manifestRevision = revision,
): RegistryManifest {
  return {
    version: 1,
    revision: manifestRevision,
    algorithm: "sha256",
    files: Object.fromEntries(
      Object.entries(entries).map(([path, value]) => [path, digest(value)]),
    ),
  };
}

function registryFetch(
  entries: Record<string, unknown>,
  manifestRevision = revision,
  overrides: Record<string, unknown> = {},
) {
  const responses = new Map<string, unknown>([
    ["manifest.json", manifestFor(entries, manifestRevision)],
    ...Object.entries(entries),
  ]);

  return vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
    const url = new URL(String(input));
    const path = `${url.pathname.split("/").at(-1)}${url.search}`;
    const value = Object.hasOwn(overrides, path)
      ? overrides[path]
      : responses.get(path);
    if (value === undefined) return new Response("Not found", { status: 404 });
    return new Response(jsonBody(value), {
      headers: { "content-type": "application/json" },
    });
  });
}

describe("registry client", () => {
  it("fetches and verifies the index from <base>/index.json, then caches it", async () => {
    const fetchImpl = registryFetch({ "index.json": index });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchImpl,
    });

    await client.getIndex();
    await client.getIndex();

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls.map(([url]) => String(url))).toEqual([
      "http://localhost:3000/r/manifest.json",
      "http://localhost:3000/r/index.json",
    ]);
  });

  it("fetches a verified component, strips the @godui/ prefix, and caches per key", async () => {
    const fetchImpl = registryFetch({
      "index.json": index,
      "magic-button.json": component,
    });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchImpl,
    });

    await client.getComponent("@godui/magic-button");
    await client.getComponent("magic-button");

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls.map(([url]) => String(url))).toEqual([
      "http://localhost:3000/r/manifest.json",
      "http://localhost:3000/r/magic-button.json",
    ]);
  });

  it.each([
    ["@godui/../private", "path traversal"],
    ["..%2Fprivate", "encoded path traversal"],
    ["private/component", "slash"],
    ["private\\component", "backslash"],
  ])("rejects %s (%s) before fetching", async (name) => {
    const fetchImpl = vi.fn();
    const client = createRegistryClient({ fetchImpl });

    await expect(client.getComponent(name)).rejects.toThrow(
      "Invalid GodUI component name",
    );
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("supports verified variant payloads", async () => {
    const variantPath = "gradient-background.json?variant=aurora-glow";
    const fetchImpl = registryFetch({
      "index.json": index,
      [variantPath]: { name: "gradient-background" },
    });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchImpl,
    });

    await client.getComponent("gradient-background", "aurora-glow");

    expect(fetchImpl).toHaveBeenCalledWith(
      "http://localhost:3000/r/gradient-background.json?variant=aurora-glow",
      expect.anything(),
    );
  });

  it("trims a trailing slash from the base url", async () => {
    const fetchImpl = registryFetch({ "index.json": index });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r/",
      fetchImpl,
    });

    await client.getIndex();

    expect(fetchImpl.mock.calls.map(([url]) => String(url))).toEqual([
      "http://localhost:3000/r/manifest.json",
      "http://localhost:3000/r/index.json",
    ]);
  });

  it("rejects a component whose bytes do not match the manifest digest", async () => {
    const fetchImpl = registryFetch(
      {
        "index.json": index,
        "magic-button.json": component,
      },
      revision,
      { "magic-button.json": { name: "tampered" } },
    );
    const client = createRegistryClient({ fetchImpl });

    await expect(client.getComponent("magic-button")).rejects.toThrow(
      "integrity check failed",
    );
  });

  it("refuses to fetch a component that is absent from the manifest", async () => {
    const fetchImpl = registryFetch({ "index.json": index });
    const client = createRegistryClient({ fetchImpl });

    await expect(client.getComponent("magic-button")).rejects.toThrow(
      "refusing unverified payload",
    );
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("rejects an invalid manifest", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          jsonBody({
            version: 1,
            revision,
            algorithm: "sha256",
            files: { "index.json": "not-a-digest" },
          }),
          { headers: { "content-type": "application/json" } },
        ),
    );
    const client = createRegistryClient({ fetchImpl });

    await expect(client.getIndex()).rejects.toThrow("invalid manifest");
  });

  it("rejects a mismatched pinned revision", async () => {
    const fetchImpl = registryFetch({ "index.json": index }, "revision-b");
    const client = createRegistryClient({
      expectedRevision: revision,
      fetchImpl,
    });

    await expect(client.getIndex()).rejects.toThrow("revision mismatch");
  });

  it("evicts rejected requests so a later call can retry", async () => {
    const fetchImpl = registryFetch({ "index.json": index });
    fetchImpl.mockRejectedValueOnce(new Error("temporary failure"));
    const client = createRegistryClient({ fetchImpl });

    await expect(client.getIndex()).rejects.toThrow("temporary failure");
    await expect(client.getIndex()).resolves.toEqual(index);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });
});
