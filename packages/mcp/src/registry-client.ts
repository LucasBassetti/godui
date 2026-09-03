// Thin HTTP client over the GodUI shadcn registry. Holds no bundled component
// data — it fetches the live catalog so even an old pinned MCP version serves
// the newest components after each site deploy. Results are cached per process.

const DEFAULT_BASE_URL = "https://godui.design/r";
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RESPONSE_BYTES = 1_048_576;
const MAX_ERROR_DETAIL_LENGTH = 200;

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

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

function isRegistryFile(value: unknown): value is RegistryFile {
  return (
    isRecord(value) &&
    isNonEmptyString(value.path) &&
    isOptionalString(value.target) &&
    isOptionalString(value.type) &&
    isOptionalString(value.content)
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
  if (
    !isRecord(value) ||
    !isNonEmptyString(value.name) ||
    !isOptionalString(value.revision) ||
    !isOptionalString(value.title) ||
    !isOptionalString(value.description) ||
    !isOptionalString(value.type) ||
    (value.dependencies !== undefined && !isStringArray(value.dependencies)) ||
    (value.registryDependencies !== undefined &&
      !isStringArray(value.registryDependencies)) ||
    (value.files !== undefined &&
      (!Array.isArray(value.files) || !value.files.every(isRegistryFile))) ||
    (value.cssVars !== undefined && !isRecord(value.cssVars)) ||
    (value.css !== undefined && !isRecord(value.css))
  ) {
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

type FetchJsonOptions = {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  maxResponseBytes?: number;
};

function boundedErrorDetail(cause: unknown): string {
  const detail = cause instanceof Error ? cause.message : String(cause);
  return detail.slice(0, MAX_ERROR_DETAIL_LENGTH);
}

function responseTooLarge(maxResponseBytes: number, url: string): Error {
  return new Error(
    `GodUI registry response exceeded the ${maxResponseBytes}-byte limit: ${url}`,
  );
}

async function readResponseText(
  res: Response,
  maxResponseBytes: number,
  signal: AbortSignal,
  url: string,
): Promise<string> {
  const contentLengthHeader = res.headers.get("content-length");
  if (contentLengthHeader !== null) {
    const normalizedContentLength = contentLengthHeader.trim();
    const contentLength = Number(normalizedContentLength);
    if (
      !/^\d+$/.test(normalizedContentLength) ||
      !Number.isSafeInteger(contentLength)
    ) {
      throw new Error(
        `GodUI registry returned an invalid Content-Length: ${url}`,
      );
    }
    if (contentLength > maxResponseBytes) {
      throw responseTooLarge(maxResponseBytes, url);
    }
  }

  if (!res.body) return "";

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytesRead = 0;
  let text = "";

  const cancel = () => {
    void reader.cancel(signal.reason).catch(() => undefined);
  };
  signal.addEventListener("abort", cancel, { once: true });

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bytesRead += value.byteLength;
      if (bytesRead > maxResponseBytes) {
        cancel();
        throw responseTooLarge(maxResponseBytes, url);
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    signal.removeEventListener("abort", cancel);
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
  if (!Number.isSafeInteger(maxResponseBytes) || maxResponseBytes <= 0) {
    throw new RangeError(
      "Registry response size limit must be a positive safe integer",
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
        `Failed to reach GodUI registry at ${url}: ${boundedErrorDetail(cause)}`,
      );
    }
    if (!res.ok) {
      throw new Error(`GodUI registry request failed (${res.status}): ${url}`);
    }

    const contentType = res.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase();
    if (contentType !== "application/json") {
      throw new Error(
        `GodUI registry returned an unexpected content type (expected application/json): ${url}`,
      );
    }

    let text: string;
    try {
      text = await readResponseText(
        res,
        maxResponseBytes,
        controller.signal,
        url,
      );
    } catch (cause) {
      if (controller.signal.aborted) throw timeoutError;
      if (
        cause instanceof Error &&
        cause.message.includes("response exceeded")
      ) {
        throw cause;
      }
      throw new Error(
        `Failed to read GodUI registry response at ${url}: ${boundedErrorDetail(cause)}`,
      );
    }

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

/**
 * Create a registry client. `fetchJsonImpl` is injectable for tests; production
 * uses the global `fetch`.
 */
export function createRegistryClient(
  options: {
    baseUrl?: string;
    fetchJsonImpl?: typeof fetchJson;
    fetchImpl?: typeof fetch;
    timeoutMs?: number;
    maxResponseBytes?: number;
    /** Require the catalog index to identify this exact deployment revision. */
    expectedRevision?: string;
  } = {},
): RegistryClient {
  const baseUrl = (options.baseUrl ?? registryBaseUrl).replace(/\/$/, "");
  const get =
    options.fetchJsonImpl ??
    (<T>(url: string) =>
      fetchJson<T>(url, {
        fetchImpl: options.fetchImpl,
        timeoutMs: options.timeoutMs,
        maxResponseBytes: options.maxResponseBytes,
      }));
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
