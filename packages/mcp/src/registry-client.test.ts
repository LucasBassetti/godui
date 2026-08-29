import { afterEach, describe, expect, it, vi } from "vitest";
import { createRegistryClient } from "./registry-client.js";

describe("registry client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

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

  it("retries an index request after it rejects", async () => {
    const error = new Error("temporary failure");
    const fetchJsonImpl = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce({ name: "godui", homepage: "x", components: [] });
    const client = createRegistryClient({ fetchJsonImpl });

    await expect(client.getIndex()).rejects.toBe(error);
    await expect(client.getIndex()).resolves.toEqual({
      name: "godui",
      homepage: "x",
      components: [],
    });
    expect(fetchJsonImpl).toHaveBeenCalledTimes(2);
  });

  it("retries a component request after it rejects", async () => {
    const error = new Error("temporary failure");
    const fetchJsonImpl = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce({ name: "magic-button" });
    const client = createRegistryClient({ fetchJsonImpl });

    await expect(client.getComponent("magic-button")).rejects.toBe(error);
    await expect(client.getComponent("magic-button")).resolves.toEqual({
      name: "magic-button",
    });
    expect(fetchJsonImpl).toHaveBeenCalledTimes(2);
  });

  it("times out an injected request and retries it", async () => {
    vi.useFakeTimers();
    const fetchJsonImpl = vi
      .fn()
      .mockImplementationOnce(() => new Promise<never>(() => {}))
      .mockResolvedValueOnce({ name: "godui", homepage: "x", components: [] });
    const client = createRegistryClient({
      fetchJsonImpl,
      requestTimeoutMs: 25,
    });

    const request = client.getIndex();
    const rejection = expect(request).rejects.toThrow(
      "GodUI registry request timed out after 25ms",
    );
    await vi.advanceTimersByTimeAsync(25);
    await rejection;

    await expect(client.getIndex()).resolves.toEqual({
      name: "godui",
      homepage: "x",
      components: [],
    });
    expect(fetchJsonImpl).toHaveBeenCalledTimes(2);
  });

  it("aborts and rejects a stalled network request", async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn(
      (..._args: Parameters<typeof fetch>) => new Promise<Response>(() => {}),
    );
    vi.stubGlobal("fetch", fetchImpl);
    const client = createRegistryClient({
      baseUrl: "http://localhost:3000/r",
      requestTimeoutMs: 25,
    });

    const request = client.getIndex();
    const rejection = expect(request).rejects.toThrow(
      "GodUI registry request timed out after 25ms",
    );
    await vi.advanceTimersByTimeAsync(25);
    await rejection;

    const [, init] = fetchImpl.mock.calls[0] ?? [];
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    expect(init?.signal?.aborted).toBe(true);
  });
});
