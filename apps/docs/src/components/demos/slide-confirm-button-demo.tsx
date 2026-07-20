"use client";

import { SlideConfirmButton } from "@godui/components";

/**
 * Async confirm: `onConfirm` returns a promise, so the thumb spins and the
 * track shows `loadingLabel` until it settles, then lands on the confirmed
 * state.
 */
export function SlideConfirmButtonAsyncDemo() {
  return (
    <SlideConfirmButton
      label="Slide to pay"
      loadingLabel="Charging…"
      confirmedLabel="Paid"
      onConfirm={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1600));
      }}
    />
  );
}
