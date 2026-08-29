// Thin HTTP client over the GodUI shadcn registry. Holds no bundled component
// data — it fetches the live catalog so even an old pinned MCP version serves
// the newest components after each site deploy. Results are cached per process.

const DEFAULT_BASE_URL = "https://godui.design/r";
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RESPONSE_BYTES = 1_048_576;

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

type FetchJsonOptions = {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  maxResponseBytes?: number;
};

async function readResponseText(
  res: Response,
  maxResponseBytes: number,
  url: string,
): Promise<string> {
  const contentLength = res.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxResponseBytes) {
    throw new Error(
      `GodUI registry response exceeded the ${maxResponseBytes}-byte limit: ${url}`,
    );
  }

  if (!res.body) return "";

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bytesRead += value.byteLength;
      if (bytesRead > maxResponseBytes) {
        void reader.cancel().catch(() => undefined);
        throw new Error(
          `GodUI registry response exceeded the ${maxResponseBytes}-byte limit: ${url}`,
        );
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

async function fetchJson<T>(
  url: string,
  {
    fetchImpl = fetch,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxResponseBytes = DEFAULT_MAX_RESPONSE_BYTES,
  }: FetchJsonOptions = {},
): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
    throw new RangeError(
      "Registry request timeout must be a finite non-negative number",
    );
  }
  if (!Number.isFinite(maxResponseBytes) || maxResponseBytes <= 0) {
    throw new RangeError(
      "Registry response size limit must be a finite positive number",
    );
  }

  const controller = new AbortController();
  const timeoutError = new Error(
    `GodUI registry request timed out after ${timeoutMs}ms: ${url}`,
  );
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort(timeoutError);
      reject(timeoutError);
    }, timeoutMs);
  });

  const request = (async () => {
    let res: Response;
    try {
      res = await fetchImpl(url, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      });
    } catch (cause) {
      if (controller.signal.aborted) throw timeoutError;
      throw new Error(
        `Failed to reach GodUI registry at ${url}: ${String(cause)}`,
      );
    }
    if (!res.ok) {
      throw new Error(
        `GodUI registry request failed (${res.status} ${res.statusText}): ${url}`,
      );
    }

    const text = await readResponseText(res, maxResponseBytes, url);
    try {
      return JSON.parse(text) as T;
    } catch (cause) {
      throw new Error(`Failed to parse GodUI registry response: ${url}`, {
        cause,
      });
    }
  })();

  try {
    return await Promise.race([request, timeout]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

type FetchJson = <T>(url: string) => Promise<T>;

/**
 * Create a registry client. `fetchImpl` and `fetchJsonImpl` are injectable for
 * tests; production uses the global `fetch`.
 */
export function createRegistryClient(
  options: {
    baseUrl?: string;
    fetchImpl?: typeof fetch;
    fetchJsonImpl?: FetchJson;
    timeoutMs?: number;
    maxResponseBytes?: number;
  } = {},
): RegistryClient {
  const baseUrl = (options.baseUrl ?? registryBaseUrl).replace(/\/$/, "");
  const get: FetchJson =
    options.fetchJsonImpl ??
    (<T>(url: string) =>
      fetchJson<T>(url, {
        fetchImpl: options.fetchImpl,
        timeoutMs: options.timeoutMs,
        maxResponseBytes: options.maxResponseBytes,
      }));

  let indexCache: Promise<CatalogIndex> | undefined;
  const componentCache = new Map<string, Promise<RegistryItem>>();

  return {
    getIndex() {
      if (!indexCache) {
        const pending = get<CatalogIndex>(`${baseUrl}/index.json`);
        const cached = pending.catch((cause) => {
          if (indexCache === cached) indexCache = undefined;
          throw cause;
        });
        indexCache = cached;
      }
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
