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
