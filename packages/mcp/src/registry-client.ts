// Thin HTTP client over the GodUI shadcn registry. Holds no bundled component
// data — it fetches the live catalog so even an old pinned MCP version serves
// the newest components after each site deploy. Results are cached per process.

const DEFAULT_BASE_URL = "https://godui.design/r";
const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;

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

function requestTimeoutError(url: string, timeoutMs: number): Error {
  return new Error(
    `GodUI registry request timed out after ${timeoutMs}ms: ${url}`,
  );
}

function withRequestTimeout<T>(
  request: Promise<T>,
  url: string,
  timeoutMs: number,
  onTimeout?: () => void,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      onTimeout?.();
      reject(requestTimeoutError(url, timeoutMs));
    }, timeoutMs);
  });

  return Promise.race([request, timeout]).finally(() => {
    clearTimeout(timeoutId);
  });
}

async function fetchJson<T>(
  url: string,
  requestTimeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const request = (async () => {
    let res: Response;
    try {
      res = await fetch(url, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      });
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
  })();

  try {
    return await withRequestTimeout(request, url, requestTimeoutMs, () =>
      controller.abort(),
    );
  } catch (cause) {
    if (controller.signal.aborted) {
      throw requestTimeoutError(url, requestTimeoutMs);
    }
    throw cause;
  }
}

/**
 * Create a registry client. `fetchJsonImpl` is injectable for tests;
 * production uses the global `fetch`.
 */
export function createRegistryClient(
  options: {
    baseUrl?: string;
    fetchJsonImpl?: typeof fetchJson;
    requestTimeoutMs?: number;
  } = {},
): RegistryClient {
  const baseUrl = (options.baseUrl ?? registryBaseUrl).replace(/\/$/, "");
  const requestTimeoutMs =
    options.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
  if (!Number.isFinite(requestTimeoutMs) || requestTimeoutMs <= 0) {
    throw new RangeError(
      "requestTimeoutMs must be a finite number greater than 0",
    );
  }

  const fetchJsonImpl = options.fetchJsonImpl;
  const get: typeof fetchJson = fetchJsonImpl
    ? <T>(url: string) =>
        withRequestTimeout(fetchJsonImpl<T>(url), url, requestTimeoutMs)
    : <T>(url: string) => fetchJson<T>(url, requestTimeoutMs);

  let indexCache: Promise<CatalogIndex> | undefined;
  const componentCache = new Map<string, Promise<RegistryItem>>();

  return {
    getIndex() {
      if (indexCache) return indexCache;

      let pending: Promise<CatalogIndex>;
      pending = get<CatalogIndex>(`${baseUrl}/index.json`).catch((cause) => {
        if (indexCache === pending) indexCache = undefined;
        throw cause;
      });
      indexCache = pending;
      return indexCache;
    },
    getComponent(name, variant) {
      const slug = name.trim().replace(/^@godui\//, "");
      const query = variant ? `?variant=${encodeURIComponent(variant)}` : "";
      const key = `${slug}${query}`;
      let pending = componentCache.get(key);
      if (!pending) {
        pending = get<RegistryItem>(`${baseUrl}/${slug}.json${query}`);
        pending = pending.catch((cause) => {
          if (componentCache.get(key) === pending) componentCache.delete(key);
          throw cause;
        });
        componentCache.set(key, pending);
      }
      return pending;
    },
  };
}
