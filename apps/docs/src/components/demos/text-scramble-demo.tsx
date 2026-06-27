"use client";

import { TextScramble } from "@godui/components";
import * as React from "react";

const WORDS = ["Encrypted.", "Decrypted.", "Authentic.", "Verified."];

export function TextScrambleDemo() {
  const [i, setI] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid w-full place-items-center py-10">
      <TextScramble
        text={WORDS[i] as string}
        trigger="in-view"
        charset="symbols"
        className="font-mono text-4xl font-semibold text-foreground sm:text-5xl"
      />
    </div>
  );
}
