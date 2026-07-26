/**
 * Persisted Workbench preferences.
 *
 * One namespaced, versioned blob rather than a key per setting: a single read,
 * a single write, and no migration code when the shape changes (bump `v1`).
 * The same key is read by the pre-hydration script in
 * `components/workbench/workbench-prefs-script.tsx` — keep the two in sync.
 */
export const WORKBENCH_PREFS_KEY = "godui:workbench:v1";

export type WorkbenchPrefs = {
  /** Docs pane open. Defaults to closed. */
  open?: boolean;
  /** Docs pane width in px. */
  panelW?: number;
  /** Code pane open. Defaults to closed. */
  codeOpen?: boolean;
  /** Code pane height in px. */
  codeH?: number;
};

export function readWorkbenchPrefs(): WorkbenchPrefs {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(WORKBENCH_PREFS_KEY);
    return raw ? (JSON.parse(raw) as WorkbenchPrefs) : {};
  } catch {
    // Private mode / disabled storage — preferences are a nicety, not a
    // requirement. Fall back to defaults rather than breaking the page.
    return {};
  }
}

/** Merge-writes; pass `undefined` for a field to clear it. */
export function writeWorkbenchPrefs(patch: WorkbenchPrefs): void {
  if (typeof window === "undefined") return;
  try {
    const next = { ...readWorkbenchPrefs(), ...patch };
    for (const key of Object.keys(next) as (keyof WorkbenchPrefs)[]) {
      if (next[key] === undefined) delete next[key];
    }
    window.localStorage.setItem(WORKBENCH_PREFS_KEY, JSON.stringify(next));
  } catch {
    // Ignore — see above.
  }
}
