# ProgressFoldButton — Loading Progress State Design

Date: 2026-06-18

## Summary

Give `ProgressFoldButton` a controlled loading progress state modeled on
`MagicInput`. While `status="loading"` the front face folds back (rotateX tilt)
and holds, revealing a progress bar behind it. The bar is **determinate** when a
`progress` value is supplied (fills to that percentage with a smooth transition)
or **indeterminate** when omitted (a segment loops across). This replaces the
old uncontrolled click-driven fake animation.

## API

File: `packages/components/src/progress-fold-button/progress-fold-button.tsx`

```tsx
type ProgressFoldButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";   // default "primary"
    size?: "sm" | "md" | "lg";            // default "md"
    status?: "idle" | "loading";          // default "idle"
    progress?: number;                     // 0–100; loading + value = determinate
  };
```

- `status="loading"` + `progress` present → **determinate**.
- `status="loading"` + `progress` omitted → **indeterminate**.
- `status="idle"` → resting; hover/focus tilt preserved.
- `progress` is clamped to 0–100.
- The old internal `active` state and click auto-animation are removed. The
  component is now fully controlled by `status`/`progress`; `onClick` still
  fires so the consumer can flip `status` to `loading`.

## Behavior

Driven by data-attributes on the root `<button>`, mirroring `MagicInput`:

- `data-status="loading"` (undefined when idle)
- `data-determinate="true"` when loading and `progress != null`
- `data-armed="true"` set one rAF after entering loading (snap-to-0 → arm
  transition so the determinate fill doesn't flash from full on entry; same
  pattern as MagicInput's `armed`)

Fold (front rotateX tilt):

- `idle`: flat at rest; tilts on `:hover` / `:focus-visible` (existing rule).
- `loading`: front holds the tilt (`rotateX(35deg)`) regardless of hover/focus.

Progress bar (`.progress-fold-button-bar`):

- Determinate: `width: var(--progress-fold-fill)` where the root sets
  `--progress-fold-fill: {clamped}%`. Width transitions smoothly once armed.
- Indeterminate: a partial-width segment runs a looping keyframe sweeping
  left→right.
- The `progress-fold-bar` click keyframe and `onAnimationEnd` reset are removed.

## Accessibility

- `aria-busy="true"` on the button while loading.
- A visually-hidden `role="progressbar"` element (like MagicInput's
  `magic-input-sr`) reports state while loading:
  - determinate: `aria-valuemin=0 aria-valuemax=100 aria-valuenow={clamped}`
  - indeterminate: `aria-valuetext="Loading"`, no `aria-valuenow`.

## CSS

File: `packages/components/styles.css`

- Keep `.progress-fold-button-bar` base (absolute, full-height, `width: 0`).
- New: front holds tilt under `.progress-fold-button[data-status="loading"]
  .progress-fold-button-front { transform: rotateX(35deg); }`.
- New: determinate width via `--progress-fold-fill` + transition gated by
  `data-armed`.
- New indeterminate keyframe (segment sweep) applied when
  `data-status="loading"` and not `data-determinate`.
- Remove the `data-active` bar rule and the `progress-fold-bar` keyframe.
- Extend the existing `prefers-reduced-motion` guard to the new loading
  animations.

## Tests

File: `packages/components/src/progress-fold-button/progress-fold-button.test.tsx`

- Replace the `data-active`/animationEnd click test (behavior removed).
- `status="loading"` sets `data-status="loading"` and `aria-busy`.
- determinate: `progress={40}` sets `data-determinate="true"`, exposes
  `progressbar` with `aria-valuenow=40`, and `--progress-fold-fill: 40%`.
- indeterminate: `status="loading"` without `progress` → no `data-determinate`,
  `progressbar` with `aria-valuetext="Loading"`.
- `progress` clamps out-of-range values.
- idle (default) renders no `data-status` / `progressbar`.

## Docs / Story

- Update the Storybook story + docs page with `idle`, indeterminate loading, and
  determinate loading examples (a stateful demo that flips `status` on click and
  optionally ramps `progress`).

## Out of Scope

- `success` / `error` states (explicitly dropped for this component).
