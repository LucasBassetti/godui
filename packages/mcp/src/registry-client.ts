import { createHash } from "node:crypto";

// The registry is intentionally live for freshness, but every payload served
// to an agent must be bound to the versioned manifest fetched for this process.
const DEFAULT_BASE_URL = "https://godui.design/r";
const MANIFEST_PATH = "manifest.json";
const SHA256_HEX = /^[a-f0-9]{64}$/;

/** Base registry URL, overridable for local testing (e.g. http://localhost:3000/r). */
export const registryBaseUrl = (
  process.env.GODUI_REGISTRY_URL ?? DEFAULT_BASE_URL
).replace(/\/$/, "");

export type CatalogComponent = {
  name: string;
  title: string;
  description: string;
  category: string;
  dependencies: string[];
  registryDependencies: string[];
  install: string;
};

export type CatalogIndex = {
  name: string;
  homepage: string;
  generatedAt?: string;
  revision?: string;
  components: CatalogComponent[];
};

export type RegistryFile = {
  path: string;
  target?: string;
  type?: string;
  content?: string;
};

export type RegistryItem = {
  name: string;
  title?: string;
  description?: string;
  type?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  cssVars?: Record<string, unknown>;
  css?: Record<string, unknown>;
};

export type RegistryManifest = {
  version: 1;
  revision: string;
  algorithm: "sha256";
  files: Record<string, string>;
};

export type RegistryClient = {
  getIndex(): Promise<CatalogIndex>;
  getComponent(name: string, variant?: string): Promise<RegistryItem>;
};

type FetchImpl = typeof fetch;

type FetchedJson<T> = {
  value: T;
  bytes: Uint8Array;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isDigestMap(value: unknown): value is Record<string, string> {
  return (
    isRecord(value) &&
    Object.entries(value).every(
      ([path, digest]) =>
        path.split("?", 1)[0].endsWith(".json") &&
        typeof digest === "string" &&
        SHA256_HEX.test(digest),
    )
  );
}

function validateManifest(value: unknown, url: string): RegistryManifest {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    value.algorithm !== "sha256" ||
    !isNonEmptyString(value.revision) ||
    !isDigestMap(value.files) ||
    !SHA256_HEX.test(value.files["index.json"] as string)
  ) {
    throw new Error(`GodUI registry returned an invalid manifest: ${url}`);
  }

  return {
    version: 1,
    revision: value.revision,
    algorithm: "sha256",
    files: value.files as Record<string, string>,
  };
}

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

async function fetchJson<T>(
  url: string,
  fetchImpl: FetchImpl,
): Promise<FetchedJson<T>> {
  let res: Response;
  try {
    res = await fetchImpl(url, { headers: { accept: "application/json" } });
  } catch (cause) {
    throw new Error(
      `Failed to reach GodUI registry at ${url}: ${String(cause)}`,
    );
  }
  if (!res.ok) {
    throw new Error(
      `GodUI registry request failed (${res.status} ${res.statusText}): ${url}`,
    );
  }

  const bytes = new Uint8Array(await res.arrayBuffer());
  try {
    return {
      value: JSON.parse(new TextDecoder().decode(bytes)) as T,
      bytes,
    };
  } catch (cause) {
    throw new Error(`Failed to parse GodUI registry response: ${url}`, {
      cause,
    });
  }
}

function verifyDigest(
  path: string,
  bytes: Uint8Array,
  expected: string,
  url: string,
): void {
  const received = sha256(bytes);
  if (received !== expected) {
    throw new Error(
      `GodUI registry integrity check failed for ${path}: expected ${expected}, received ${received} (${url})`,
    );
  }
}

/**
 * Create a registry client. `fetchImpl` is injectable for tests; production
 * uses the global `fetch`.
 */
export function createRegistryClient(
  options: {
    baseUrl?: string;
    expectedRevision?: string;
    fetchImpl?: FetchImpl;
  } = {},
): RegistryClient {
  const baseUrl = (options.baseUrl ?? registryBaseUrl).replace(/\/$/, "");
  const fetchImpl = options.fetchImpl ?? fetch;
  const expectedRevision =
    options.expectedRevision?.trim() ||
    process.env.GODUI_REGISTRY_REVISION?.trim();

  let manifestCache: Promise<RegistryManifest> | undefined;
  let indexCache: Promise<CatalogIndex> | undefined;
  const componentCache = new Map<string, Promise<RegistryItem>>();

  const getManifest = (): Promise<RegistryManifest> => {
    if (!manifestCache) {
      const url = `${baseUrl}/${MANIFEST_PATH}`;
      let pending: Promise<RegistryManifest>;
      pending = fetchJson<unknown>(url, fetchImpl)
        .then(({ value }) => validateManifest(value, url))
        .then((manifest) => {
          if (expectedRevision && manifest.revision !== expectedRevision) {
            throw new Error(
              `GodUI registry revision mismatch at ${url}: expected ${expectedRevision}, received ${manifest.revision}`,
            );
          }
          return manifest;
        })
        .catch((cause) => {
          if (manifestCache === pending) manifestCache = undefined;
          throw cause;
        });
      manifestCache = pending;
    }
    return manifestCache;
  };

  const getVerifiedJson = async <T>(path: string, url: string): Promise<T> => {
    const manifest = await getManifest();
    const expected = manifest.files[path];
    if (!expected) {
      throw new Error(
        `GodUI registry manifest does not contain ${path}; refusing unverified payload: ${url}`,
      );
    }

    const { value, bytes } = await fetchJson<T>(url, fetchImpl);
    verifyDigest(path, bytes, expected, url);
    return value;
  };

  return {
    getIndex() {
      if (!indexCache) {
        const url = `${baseUrl}/index.json`;
        let pending: Promise<CatalogIndex>;
        pending = getVerifiedJson<CatalogIndex>("index.json", url).catch(
          (cause) => {
            if (indexCache === pending) indexCache = undefined;
            throw cause;
          },
        );
        indexCache = pending;
      }
      return indexCache;
    },
    getComponent(name, variant) {
      const slug = name.trim().replace(/^@godui\//, "");
      const query = variant ? `?variant=${encodeURIComponent(variant)}` : "";
      const path = `${slug}.json${query}`;
      const url = `${baseUrl}/${path}`;
      const key = path;
      let pending = componentCache.get(key);
      if (!pending) {
        pending = getVerifiedJson<RegistryItem>(path, url).catch((cause) => {
          if (componentCache.get(key) === pending) componentCache.delete(key);
          throw cause;
        });
        componentCache.set(key, pending);
      }
      return pending;
    },
  };
}
