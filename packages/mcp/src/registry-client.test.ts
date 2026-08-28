import { describe, expect, it, vi } from "vitest";
import { createRegistryClient } from "./registry-client.js";

describe("registry client", () => {
  const index = { name: "godui", homepage: "x", components: [] };
  const response = (body: string) =>
    new Response(body, { headers: { "content-type": "application/json" } });

  it("fetches the index from <base>/index.json and caches it", async () => {
    const fetchJsonImpl = vi.fn().mockResolvedValue(index);
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

  it("times out a stalled registry request and aborts it", async () => {
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

  it("retries the index after a rejected request", async () => {
    const fetchJsonImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary outage"))
      .mockResolvedValueOnce(index);
    const client = createRegistryClient({ fetchJsonImpl });

    await expect(client.getIndex()).rejects.toThrow("temporary outage");
    await expect(client.getIndex()).resolves.toEqual(index);

    expect(fetchJsonImpl).toHaveBeenCalledTimes(2);
  });

  it("rejects oversized responses and retries after the failure", async () => {
    const validBody = JSON.stringify(index);
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(response(`${validBody}x`))
      .mockResolvedValueOnce(response(validBody));
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchImpl,
      maxResponseBytes: new TextEncoder().encode(validBody).byteLength,
    });

    await expect(client.getIndex()).rejects.toThrow(
      "GodUI registry response exceeded the",
    );
    await expect(client.getIndex()).resolves.toEqual(index);

    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("rejects malformed responses and retries after the failure", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(response("not json"))
      .mockResolvedValueOnce(response(JSON.stringify(index)));
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      fetchImpl,
    });

    await expect(client.getIndex()).rejects.toThrow(
      "Failed to parse GodUI registry response",
    );
    await expect(client.getIndex()).resolves.toEqual(index);

    expect(fetchImpl).toHaveBeenCalledTimes(2);
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
    const fetchJsonImpl = vi.fn().mockResolvedValue({ components: [] });
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r/",
      fetchJsonImpl,
    });

    await client.getIndex();

    expect(fetchJsonImpl).toHaveBeenCalledWith(
      "http://localhost:3000/r/index.json",
    );
  });
});
