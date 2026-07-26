"use client";

import { createContext, useContext, useState } from "react";

type StageCopy = {
  /** Snippet the stage exposes for the rail's copy button (null → no copy). */
  copyValue: string | null;
  setCopyValue: (value: string | null) => void;
};

const StageCopyContext = createContext<StageCopy | null>(null);

/**
 * Lets a stage component (e.g. the embedded BackgroundShowcase) publish a
 * variant-specific snippet up to the workbench rail, so the rail can offer a
 * copy button that tracks the live selection. When a value is present the rail
 * treats the demo as a "static" showcase (copy replaces the Code icon; replay
 * is hidden).
 */
export function StageCopyProvider({ children }: { children: React.ReactNode }) {
  const [copyValue, setCopyValue] = useState<string | null>(null);
  return (
    <StageCopyContext.Provider value={{ copyValue, setCopyValue }}>
      {children}
    </StageCopyContext.Provider>
  );
}

export function useStageCopy(): StageCopy {
  return (
    useContext(StageCopyContext) ?? {
      copyValue: null,
      setCopyValue: () => {},
    }
  );
}
