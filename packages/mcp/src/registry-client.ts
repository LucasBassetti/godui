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

export type RegistryClient = {
  getIndex(): Promise<CatalogIndex>;
  getComponent(name: string, variant?: string): Promise<RegistryItem>;
};

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
 * Create a registry client. `fetchImpl` is injectable for tests; production
 * uses the global `fetch`.
 */
export function createRegistryClient(
  options: { baseUrl?: string; fetchJsonImpl?: typeof fetchJson } = {},
): RegistryClient {
  const baseUrl = (options.baseUrl ?? registryBaseUrl).replace(/\/$/, "");
  const get = options.fetchJsonImpl ?? fetchJson;

  let indexCache: Promise<CatalogIndex> | undefined;
  const componentCache = new Map<string, Promise<RegistryItem>>();

  return {
    getIndex() {
      indexCache ??= get<CatalogIndex>(`${baseUrl}/index.json`);
      return indexCache;
    },
    getComponent(name, variant) {
      const slug = name.trim().replace(/^@godui\//, "");
      const query = variant ? `?variant=${encodeURIComponent(variant)}` : "";
      const key = `${slug}${query}`;
      let pending = componentCache.get(key);
      if (!pending) {
        pending = get<RegistryItem>(`${baseUrl}/${slug}.json${query}`);
        componentCache.set(key, pending);
      }
      return pending;
    },
  };
}
