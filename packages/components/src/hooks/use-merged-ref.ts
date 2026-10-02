import * as React from "react";

/**
 * One callback ref that points both `local` and the caller's `ref` (callback
 * or object) at the same node. React 19: a callback ref may return its own
 * cleanup, which React then calls instead of `ref(null)`; it's passed through,
 * so a caller's cleanup runs on unmount and their ref is never called with null.
 */
export function useMergedRef<T>(
  local: React.RefObject<T | null>,
  ref: React.Ref<T> | undefined,
) {
  return React.useCallback(
    (node: T | null) => {
      local.current = node;
      if (typeof ref === "function") {
        const cleanup = ref(node);
        return () => {
          local.current = null;
          if (typeof cleanup === "function") cleanup();
          else ref(null);
        };
      }
      if (ref) ref.current = node;
      return () => {
        local.current = null;
        if (ref) ref.current = null;
      };
    },
    [local, ref],
  );
}
