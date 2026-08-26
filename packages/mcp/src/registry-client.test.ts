import { describe, expect, it, vi } from "vitest";
import { createRegistryClient } from "./registry-client.js";

describe("registry client", () => {
  it("fetches the index from <base>/index.json and caches it", async () => {
    const fetchJsonImpl = vi
      .fn()
      .mockResolvedValue({ name: "godui", homepage: "x", components: [] });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchJsonImpl,
    });

    await client.getIndex();
    await client.getIndex();

    expect(fetchJsonImpl).toHaveBeenCalledTimes(1);
    expect(fetchJsonImpl).toHaveBeenCalledWith(
      "http://localhost:3000/r/index.json",
    );
  });

  it("fetches a component, strips the @godui/ prefix, and caches per key", async () => {
    const fetchJsonImpl = vi.fn().mockResolvedValue({ name: "magic-button" });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchJsonImpl,
    });

    await client.getComponent("@godui/magic-button");
    await client.getComponent("magic-button");

    expect(fetchJsonImpl).toHaveBeenCalledTimes(1);
    expect(fetchJsonImpl).toHaveBeenCalledWith(
      "http://localhost:3000/r/magic-button.json",
    );
  });

  it("appends a variant query for background components", async () => {
    const fetchJsonImpl = vi.fn().mockResolvedValue({ name: "gradient" });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchJsonImpl,
    });

    await client.getComponent("gradient-background", "aurora-glow");

    expect(fetchJsonImpl).toHaveBeenCalledWith(
      "http://localhost:3000/r/gradient-background.json?variant=aurora-glow",
    );
  });

  it("trims a trailing slash from the base url", async () => {
    const fetchJsonImpl = vi
      .fn()
      .mockResolvedValue({ name: "godui", homepage: "x", components: [] });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r/",
      fetchJsonImpl,
    });

    await client.getIndex();

    expect(fetchJsonImpl).toHaveBeenCalledWith(
      "http://localhost:3000/r/index.json",
    );
  });

  it("keeps one live revision per process and supports a pinned rollback client", async () => {
    let revision = "revision-a";
    const fetchJsonImpl = vi.fn().mockImplementation(async (url: string) => ({
      name: "godui",
      homepage: "x",
      revision: url.includes("/snapshots/revision-a/")
        ? "revision-a"
        : revision,
      components: [],
    }));
    const liveClient = createRegistryClient({
      baseUrl: "https://godui.design/r",
      fetchJsonImpl,
    });

    expect((await liveClient.getIndex()).revision).toBe("revision-a");
    revision = "revision-b";
    expect((await liveClient.getIndex()).revision).toBe("revision-a");

    const rollbackClient = createRegistryClient({
      baseUrl: "https://godui.design/r/snapshots/revision-a",
      expectedRevision: "revision-a",
      fetchJsonImpl,
    });
    expect((await rollbackClient.getIndex()).revision).toBe("revision-a");
  });

  it("rejects invalid catalog metadata and mismatched pinned revisions", async () => {
    const invalidClient = createRegistryClient({
      fetchJsonImpl: vi.fn().mockResolvedValue({
        name: "godui",
        homepage: "x",
        components: "nope",
      }),
    });
    await expect(invalidClient.getIndex()).rejects.toThrow(
      "invalid catalog metadata",
    );

    const mismatchedClient = createRegistryClient({
      expectedRevision: "revision-a",
      fetchJsonImpl: vi.fn().mockResolvedValue({
        name: "godui",
        homepage: "x",
        revision: "revision-b",
        components: [],
      }),
    });
    await expect(mismatchedClient.getIndex()).rejects.toThrow(
      "revision mismatch",
    );

    const missingRevisionClient = createRegistryClient({
      expectedRevision: "revision-a",
      fetchJsonImpl: vi.fn().mockResolvedValue({
        name: "godui",
        homepage: "x",
        components: [],
      }),
    });
    await expect(missingRevisionClient.getIndex()).rejects.toThrow(
      "revision mismatch",
    );
  });

  it("rejects invalid component metadata", async () => {
    const client = createRegistryClient({
      fetchJsonImpl: vi.fn().mockResolvedValue({ title: "missing name" }),
    });

    await expect(client.getComponent("magic-button")).rejects.toThrow(
      "invalid component metadata",
    );
  });

  it("checks the pinned catalog before fetching a component", async () => {
    const fetchJsonImpl = vi.fn().mockImplementation(async (url: string) => {
      if (url.endsWith("/index.json")) {
        return {
          name: "godui",
          homepage: "x",
          revision: "revision-a",
          components: [],
        };
      }
      return { name: "magic-button", revision: "revision-a" };
    });
    const client = createRegistryClient({
      expectedRevision: "revision-a",
      fetchJsonImpl,
    });

    await client.getComponent("magic-button");

    expect(fetchJsonImpl.mock.calls.map(([url]) => url)).toEqual([
      "https://godui.design/r/index.json",
      "https://godui.design/r/magic-button.json",
    ]);
  });
});
