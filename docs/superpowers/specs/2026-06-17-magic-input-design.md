# MagicInput — Design

Date: 2026-06-17

## Summary

A text input styled with the same layered 3D "magic" stack as `MagicButton`.
On focus, the input lifts into a 3D depth effect and (optionally) ignites a
rainbow gradient animation. Both the always-on 3D mode and the focus-reveal mode
are supported via a `depth` prop.

## Component

File: `packages/components/src/magic-input.tsx`

```tsx
type MagicInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  size?: "sm" | "md" | "lg";          // default "md"
  variant?: "default" | "secondary";  // default "default"
  depth?: "focus" | "always";         // default "focus"
  rainbow?: boolean;                   // default true
};
```

- `forwardRef` forwards to the underlying `<input>` (the front layer).
- Wrapper `<div class="magic-input">` carries `data-variant`, `data-depth`,
  `data-rainbow` attributes that drive CSS.
- Children, back-to-front: `<span class="magic-input-shadow">`,
  `<span class="magic-input-edge">`, `<input class="magic-input-front
  magic-input-front--{size}">`.
- The custom `size` prop is destructured out of the spread so it never reaches
  the native input `size` attribute.
- `data-rainbow` set to `"true"` only when `rainbow` is enabled (undefined
  otherwise), matching MagicButton convention.

## Behavior

Focus state is driven purely by CSS `:focus-within` on the wrapper — no JS
state. Two modes via `depth`:

- `depth="always"`: shadow + edge visible at rest; front sits at
  `translateY(-4px)`. Focus deepens the lift.
- `depth="focus"`: flat at rest (front `translateY(0)`, edge/shadow hidden via
  opacity 0); on `:focus-within` the front lifts and edge/shadow animate in.

Rainbow (`rainbow="true"`): the edge and shadow render a flowing rainbow
gradient animation **only while `:focus-within`**. At rest the edge shows the
static per-variant color. Reuses the existing `magic-rainbow` keyframes and
`--rainbow-*` tokens.

Disabled state mirrors MagicButton: reduced opacity, no pointer events, layers
hidden, front reset.

## Styling

CSS added to `packages/components/styles.css` under `@layer components`,
mirroring the `.magic-button*` rules. Sizes reuse the shared `--button-py-*`,
`--button-px-*`, `--button-text-*`, `--button-leading-*` tokens. Radius via
`--radius-xl`. All theme colors via Tailwind tokens / CSS vars already defined.

## Surrounding work (GoDUI conventions)

- Export from `packages/components/src/index.ts`.
- Storybook story: `apps/storybook/src/stories/magic-input.stories.tsx`
  (default, secondary, sizes, depth=always, rainbow off).
- Docs MDX: `apps/docs/content/docs/components/.../magic-input.mdx` with
  ComponentPreview + ComponentInstall.
- Registry entry (`registry.json` + generated `apps/docs/public/r/*`).

## Out of scope (YAGNI)

Label, helper/error text, icon slots. Bare input only.
```