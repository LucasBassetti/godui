import { describe, expect, it, vi } from "vitest";
import { createRegistryClient } from "./registry-client.js";

describe("registry client", () => {
  const index = {
    name: "godui",
    homepage: "https://godui.design",
    components: [],
  };

  const jsonResponse = (body: string, contentType = "application/json") =>
    new Response(body, { headers: { "content-type": contentType } });

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

  it("aborts a stalled registry request after the configured deadline", async () => {
    let signal: AbortSignal | undefined;
    const fetchImpl = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      signal = init?.signal ?? undefined;
      return new Promise<Response>(() => undefined);
    });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchImpl,
      timeoutMs: 10,
    });

    await expect(client.getIndex()).rejects.toThrow(
      "GodUI registry request timed out after 10ms",
    );
    expect(signal?.aborted).toBe(true);
  });

  it("applies the deadline while reading a response body", async () => {
    let signal: AbortSignal | undefined;
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, init?: RequestInit) => {
        signal = init?.signal ?? undefined;
        const body = new ReadableStream<Uint8Array>({
          pull: () => new Promise<void>(() => undefined),
        });
        return new Response(body, {
          headers: { "content-type": "application/json" },
        });
      },
    );
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchImpl,
      timeoutMs: 10,
    });

    await expect(client.getIndex()).rejects.toThrow(
      "GodUI registry request timed out after 10ms",
    );
    expect(signal?.aborted).toBe(true);
  });

  it("rejects a response whose declared size exceeds the limit", async () => {
    const body = JSON.stringify(index);
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(body, {
        headers: {
          "content-length": String(
            new TextEncoder().encode(body).byteLength + 1,
          ),
          "content-type": "application/json",
        },
      }),
    );
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchImpl,
      maxResponseBytes: new TextEncoder().encode(body).byteLength,
    });

    await expect(client.getIndex()).rejects.toThrow(
      "GodUI registry response exceeded the",
    );
  });

  it("caps streamed response bytes before parsing JSON", async () => {
    const body = new TextEncoder().encode(JSON.stringify(index));
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(body);
            controller.close();
          },
        }),
        { headers: { "content-type": "application/json" } },
      ),
    );
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchImpl,
      maxResponseBytes: body.byteLength - 1,
    });

    await expect(client.getIndex()).rejects.toThrow(
      "GodUI registry response exceeded the",
    );
  });

  it("rejects non-JSON content types before parsing", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(JSON.stringify(index), "text/html"));
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchImpl,
    });

    await expect(client.getIndex()).rejects.toThrow("unexpected content type");
  });

  it("rejects malformed JSON without returning the response body", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse("not json"));
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchImpl,
    });

    await expect(client.getIndex()).rejects.toThrow(
      "Failed to parse GodUI registry response",
    );
  });

  it("evicts a rejected index request so a later call can retry", async () => {
    const fetchJsonImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary failure"))
      .mockResolvedValueOnce({ name: "godui", homepage: "x", components: [] });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchJsonImpl,
    });

    await expect(client.getIndex()).rejects.toThrow("temporary failure");
    await expect(client.getIndex()).resolves.toEqual({
      name: "godui",
      homepage: "x",
      components: [],
    });

    expect(fetchJsonImpl).toHaveBeenCalledTimes(2);
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

  it("shares a rejected component request and retries after it is evicted", async () => {
    const fetchJsonImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary failure"))
      .mockResolvedValueOnce({ name: "magic-button" });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchJsonImpl,
    });

    const firstCall = client.getComponent("magic-button");
    const concurrentCall = client.getComponent("magic-button");

    expect(concurrentCall).toBe(firstCall);
    await expect(firstCall).rejects.toThrow("temporary failure");
    await expect(concurrentCall).rejects.toThrow("temporary failure");
    await expect(client.getComponent("magic-button")).resolves.toEqual({
      name: "magic-button",
    });

    expect(fetchJsonImpl).toHaveBeenCalledTimes(2);
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

  it("rejects malformed component file metadata", async () => {
    const client = createRegistryClient({
      fetchJsonImpl: vi.fn().mockResolvedValue({
        name: "magic-button",
        files: [{ path: "magic-button.tsx", content: 42 }],
      }),
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
