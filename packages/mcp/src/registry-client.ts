// Thin HTTP client over the GodUI shadcn registry. Holds no bundled component
// data — it fetches the live catalog so even an old pinned MCP version serves
// the newest components after each site deploy. Results are cached per process.

const DEFAULT_BASE_URL = "https://godui.design/r";

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
  /** Source/deployment revision for audit and optional reproducibility checks. */
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
  /** Source/deployment revision when the registry publishes one. */
  revision?: string;
  title?: string;
  description?: string;
  type?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  cssVars?: Record<string, unknown>;
  css?: Record<string, unknown>;
};

export type RegistryClient = {
  getIndex(): Promise<CatalogIndex>;
  getComponent(name: string, variant?: string): Promise<RegistryItem>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((entry) => typeof entry === "string")
  );
}

function isCatalogComponent(value: unknown): value is CatalogComponent {
  return (
    isRecord(value) &&
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.title) &&
    typeof value.description === "string" &&
    isNonEmptyString(value.category) &&
    isStringArray(value.dependencies) &&
    isStringArray(value.registryDependencies) &&
    isNonEmptyString(value.install)
  );
}

function validateCatalogIndex(
  value: unknown,
  url: string,
  expectedRevision?: string,
): CatalogIndex {
  if (
    !isRecord(value) ||
    !isNonEmptyString(value.name) ||
    !isNonEmptyString(value.homepage) ||
    !Array.isArray(value.components) ||
    !value.components.every(isCatalogComponent)
  ) {
    throw new Error(`GodUI registry returned invalid catalog metadata: ${url}`);
  }

  if (value.generatedAt !== undefined && !isNonEmptyString(value.generatedAt)) {
    throw new Error(`GodUI registry returned an invalid generatedAt: ${url}`);
  }

  if (value.revision !== undefined && !isNonEmptyString(value.revision)) {
    throw new Error(`GodUI registry returned an invalid revision: ${url}`);
  }

  if (expectedRevision && value.revision !== expectedRevision) {
    throw new Error(
      `GodUI registry revision mismatch at ${url}: expected ${expectedRevision}, received ${String(value.revision ?? "missing")}`,
    );
  }

  return value as CatalogIndex;
}

function validateRegistryItem(
  value: unknown,
  url: string,
  expectedRevision?: string,
): RegistryItem {
  if (!isRecord(value) || !isNonEmptyString(value.name)) {
    throw new Error(
      `GodUI registry returned invalid component metadata: ${url}`,
    );
  }

  if (value.revision !== undefined && !isNonEmptyString(value.revision)) {
    throw new Error(
      `GodUI registry returned an invalid component revision: ${url}`,
    );
  }

  if (
    expectedRevision &&
    value.revision &&
    value.revision !== expectedRevision
  ) {
    throw new Error(
      `GodUI registry revision mismatch at ${url}: expected ${expectedRevision}, received ${value.revision}`,
    );
  }

  return value as RegistryItem;
}

async function fetchJson<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { headers: { accept: "application/json" } });
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
  return (await res.json()) as T;
}

/**
 * Create a registry client. `fetchJsonImpl` is injectable for tests; production
 * uses the global `fetch`.
 */
export function createRegistryClient(
  options: {
    baseUrl?: string;
    fetchJsonImpl?: typeof fetchJson;
    /** Require the catalog index to identify this exact deployment revision. */
    expectedRevision?: string;
  } = {},
): RegistryClient {
  const baseUrl = (options.baseUrl ?? registryBaseUrl).replace(/\/$/, "");
  const get = options.fetchJsonImpl ?? fetchJson;
  const expectedRevision =
    options.expectedRevision?.trim() ||
    process.env.GODUI_REGISTRY_REVISION?.trim();

  let indexCache: Promise<CatalogIndex> | undefined;
  const componentCache = new Map<string, Promise<RegistryItem>>();

  const getIndex = () => {
    if (!indexCache) {
      const url = `${baseUrl}/index.json`;
      const request = get<CatalogIndex>(url).then((index) =>
        validateCatalogIndex(index, url, expectedRevision),
      );
      const pending = request.catch((error) => {
        if (indexCache === pending) {
          indexCache = undefined;
        }
        throw error;
      });
      indexCache = pending;
    }
    return indexCache;
  };

  return {
    getIndex,
    getComponent(name, variant) {
      const slug = name.trim().replace(/^@godui\//, "");
      const query = variant ? `?variant=${encodeURIComponent(variant)}` : "";
      const key = `${slug}${query}`;
      let pending = componentCache.get(key);
      if (!pending) {
        const url = `${baseUrl}/${slug}.json${query}`;
        const request = (expectedRevision ? getIndex() : Promise.resolve())
          .then(() => get<RegistryItem>(url))
          .then((item) => validateRegistryItem(item, url, expectedRevision));
        pending = request.catch((error) => {
          if (componentCache.get(key) === pending) {
            componentCache.delete(key);
          }
          throw error;
        });
        componentCache.set(key, pending);
      }
      return pending;
    },
  };
}
