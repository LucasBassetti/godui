# PatternCraft Backgrounds — Redesign (generic props + CLI variant baking)

**Date:** 2026-06-22
**Supersedes:** the v1 background components in PR #36 (same branch
`LucasBassetti/patterncraft-components`).

## Context

v1 shipped four background components (`GradientBackground`, `GeometricBackground`,
`DecorativeBackground`, `EffectBackground`) where the chosen pattern was selected via a
`variant` prop backed by a 257-entry `Record<Variant, CSSProperties>` baked into each
installed file. The user rejected this: a consumer wanting one background should not install
a file carrying 257 patterns and a giant union type.

New goals:

1. The **installed component** is generic and tiny — accepts `background`,
   `backgroundImage`, `backgroundSize` (plus normal `div` attrs) and spreads them into
   `style`. No variant union, no 257-entry map in the shipped file.
2. **Presets** (the 257 patterns) live in a separate data module used only by the docs and
   Storybook — never shipped to the consumer.
3. **Docs** present an interactive picker: a horizontal row of all variants above the
   preview; selecting one live-updates the preview, the JSX usage snippet, and the install
   command.
4. The **CLI bakes the chosen variant's three CSS props** into the installed file, via a
   dynamic registry route reading a `?variant=` query param.

## Decisions (resolved with user)

- **CLI mechanism:** dynamic registry route + `?variant=` query param. `--variant` is not a
  shadcn flag and the namespaced `@godui/item?variant=x` shorthand is unreliable (`params`
  in `components.json` is static config; `{name}.json` mangles the `?`). shadcn `add`
  **does** accept a full URL as an item address and fetches it verbatim including the query
  string. Canonical install command:
  ```
  pnpm dlx shadcn@latest add "https://godui.design/r/geometric-background.json?variant=purple-gradient-grid-left"
  ```
- **Default render:** the installed component bakes a sensible default variant's three CSS
  values as prop defaults, so it renders out of the box with no props.

## Architecture

### 1. Component (installed file) — `packages/components/src/{cat}-background/{cat}-background.tsx`

Generic, no preset data. `forwardRef`, `aria-hidden`, `absolute inset-0 z-base`. Props:
`background?`, `backgroundImage?`, `backgroundSize?` (+ `HTMLAttributes<HTMLDivElement>`),
each defaulting to the **default variant's** literal value:

```tsx
const GeometricBackground = React.forwardRef<HTMLDivElement, GeometricBackgroundProps>(
  ({ background = "#ffffff", backgroundImage = "…", backgroundSize = "…", className, style, ...props }, ref) => (
    <div ref={ref} aria-hidden="true" data-slot="geometric-background"
      className={`absolute inset-0 z-base ${className ?? ""}`}
      style={{ background, backgroundImage, backgroundSize, ...style }} {...props} />
  ),
);
```

The component file is standalone — it does **not** import the presets module.

### 2. Presets module — `packages/components/src/{cat}-background/{cat}-background.presets.ts`

```ts
export const geometricBackgroundVariants = ["purple-gradient-grid-right", …] as const;
export type GeometricBackgroundVariant = (typeof geometricBackgroundVariants)[number];
export const geometricBackgroundPresets: Record<
  GeometricBackgroundVariant,
  { background?: string; backgroundImage?: string; backgroundSize?: string }
> = { "purple-gradient-grid-right": { background: "#ffffff", backgroundImage: "…", backgroundSize: "…" }, … };
```

`index.ts` exports the component, its `*Props`, and the variants/presets/variant-type from
the presets module. Root `src/index.ts` re-exports all four sets.

### 3. Generator — `scripts/generate-backgrounds.mjs` (rewritten)

Per category, emit: (a) the generic component with the default variant's three values baked
as defaults, (b) the presets module, (c) `index.ts`. Still loads the vendored
`gridPatterns`, still biome-self-formats. Default variant = first pattern in the category
(same as today).

### 4. Dynamic registry route — `apps/docs/src/app/r/[item]/route.ts`

`GET /r/{name}.json?variant=<id>`:
- Only handles the four background item names; otherwise `404` (static `public/r/*.json`
  files shadow this route for every other component, so it is only ever reached for the
  backgrounds, which are **excluded from `shadcn build`'s static output**).
- Resolves the preset for `?variant` (falls back to the default variant when absent/unknown).
- Builds `files[0].content` by reading the **committed** component source
  (`packages/components/src/{cat}-background/{cat}-background.tsx`) and replacing its three
  default literals with the chosen preset's values. The defaults sit inside a single
  delimited block the generator emits with stable markers (e.g.
  `/* default-props:start */ … /* default-props:end */`) so the replacement is a precise,
  non-fragile swap rather than a loose regex. `files[0].target` = `components/godui/{name}.tsx`.
- Default/unknown `?variant` → return the file unchanged (it already carries the default
  variant's values).

This keeps **one** source of truth for the file shape — the committed `.tsx` — so the route
never re-templates the component; it only substitutes the default block.

**Guard test:** assert each presets map's default-variant entry equals the literals baked in
the matching committed component file (guards generator/preset divergence).

`build:registry` must drop the four background entries from `registry.json` (so they are not
emitted to `public/r`), leaving the route as the sole owner of those paths.

### 5. Docs interactive picker — `apps/docs/src/components/background-showcase.tsx` (new client component)

`<BackgroundShowcase component="geometric" />`:
- Imports the category's `*Variants` + `*Presets` from `@godui/components`.
- Renders a horizontal, scrollable row of all variants as mini live-rendered swatches
  (each a small `relative` box with the generic component + the preset's props); selected
  state highlights one.
- Below: live preview of the selected variant; a JSX usage snippet (`<GeometricBackground
  background="…" backgroundImage="…" backgroundSize="…" />`); and the install command
  (full-URL form with `?variant=<selected>`), with copy buttons. All three update on select.
- Registered globally in `apps/docs/src/components/mdx.tsx`; the four MDX pages use
  `<BackgroundShowcase component="…" />` instead of `ComponentPreview`/`ComponentInstall`.

### 6. Storybook — `apps/storybook/src/stories/{cat}-background.stories.tsx`

`variant` select control maps the chosen name → the preset's three props (via the presets
map) and passes them to the generic component. Gallery story iterates `*Variants`.

## Out of scope / unchanged

- The GitHubStars hydration fix, biome `scripts/vendor` ignore, and skill-doc updates from
  PR #36 stay as-is.
- No change to other components or the global theme.

## Verification

1. `pnpm --filter @godui/components lint` (tsc) + `generate:backgrounds` idempotent & biome-clean.
2. Drift-guard test passes (route default output == committed component file).
3. `pnpm build:registry` emits **no** background JSONs to `public/r`; `registry.json` index
   omits them.
4. Route: `curl "localhost:3000/r/geometric-background.json?variant=purple-gradient-grid-left"`
   returns JSON whose file content has the masked/grid props baked; unknown/missing variant
   returns the default.
5. Docs `docs:dev`: picker renders all variants, selecting updates preview + snippet +
   command; no `<p>`-in-`<p>` hydration errors.
6. Storybook: variant select renders correct backgrounds.
