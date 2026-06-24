# GodUI Docs Facelift — Design

Date: 2026-06-24
Status: Approved

## Goal

Bring the GodUI documentation site (Fumadocs app at `apps/docs`) closer to the
provided mockup (`GoDUI Design System.zip`). Three focus areas: the sidenav, the
content page (preview/code block, install, usage, props table, title/lead), and a
"Built with GodUI" CTA card under the right-hand table of contents.

Explicitly out of scope (per user): the eyebrow line above the title
(`✦ Buttons · Signature`), the meta-row pills (`3 layers`, `CSS-only`, …), and
per-page/per-group badges (`3D`, `New`). Breadcrumb + title remain structurally as
they are today.

## Constraints

- No content-file or frontmatter changes. Sidenav stays driven entirely by the
  existing `content/docs/meta.json` `---Label---` separators.
- Rainbow tokens `--rainbow-1..5` already exist (from `@godui/components` theme,
  imported in `globals.css`). Reuse them; do not redefine.
- Keep Fumadocs as the framework. Prefer CSS-on-existing-DOM and component reworks
  over replacing Fumadocs internals.
- Must work in both light and dark themes.

## Pieces

### 1. Sidenav (CSS-only, `globals.css`, targeting `#nd-sidebar`)

- Group separator labels: uppercase, letter-spaced, muted; a small rainbow dot
  before each label. Dot color cycles `--rainbow-1..5` by separator order using
  `nth-of-type` on the separator `<p>` elements (verify the rendered DOM during
  implementation; if separators are not direct typed siblings, fall back to a
  CSS counter or per-color list selectors).
- Active link: tinted pill background (`color-mix(--primary 9%)`) + a rainbow
  vertical bar indicator on the left edge (`linear-gradient(--rainbow-1, -3, -5)`).
- Preserve existing density, sticky position, and no-border treatment.

### 2. Content header (`page.tsx` + `globals.css`)

- Keep `Breadcrumbs` + `DocsTitle` + `DocsDescription` structure.
- Typography: larger, tighter-tracked title; muted lead description; a thin
  divider rule between the description and the body content.

### 3. Example block — rework `ComponentPreview` (`component-preview.tsx`, `docs-tabs.tsx`)

- Add a `Segmented` control to `docs-tabs.tsx` (pill-style segmented Preview/Code).
- Card: `rounded-2xl`, border, xs shadow, overflow-hidden.
- Top bar: segmented control on the left, optional filename, right-side action —
  replay button in Preview, copy button in Code.
- Preview stage: dotted-grid background (existing `.component-preview-canvas`
  pattern) + a radial fade overlay toward the page background; centered demo row;
  `min-h` ~280px.
- Code: existing `DynamicCodeBlock`/Shiki, seamless (no double border) in the card.

### 4. Install — restyle `ComponentInstall` (`component-install.tsx` + `globals.css`)

- Visual only; keep CLI/Manual tabs and all registry-fetch logic.
- Command card matches the mockup terminal look: package-manager pill tabs row +
  a body with a terminal glyph and the command in mono. Applies to the CLI command
  card and the Manual "install dependencies" card (both already use `PillTabs`).

### 5. Props table (`globals.css`)

- Already styled ("celestial" grid: uppercase header, mono prop names, accent type
  pills). Light-touch alignment to the mockup only; no structural change.

### 6. Built with GodUI CTA (`_components/toc-cta.tsx`, wired in `page.tsx`)

- New client/server component: gradient card (`linear-gradient` from `--primary`
  tint to `--card`), bordered, rounded. Contents: title "Built with GodUI", a
  one-line description, and a "Star on GitHub ↗" link to the repo.
- Injected via `DocsPage` `tableOfContent={{ footer: <TocCta/> }}` and
  `tableOfContentPopover={{ footer: <TocCta/> }}` so it appears under the TOC on
  desktop and in the mobile TOC popover.

## Files

- `apps/docs/src/app/globals.css` — sidenav, divider, install/preview tweaks not
  expressible in component classes, props-table touch-ups.
- `apps/docs/src/components/component-preview.tsx` — rework.
- `apps/docs/src/components/docs-tabs.tsx` — add `Segmented` control.
- `apps/docs/src/components/component-install.tsx` — command-card restyle.
- `apps/docs/src/app/docs/[[...slug]]/page.tsx` — TOC footer wiring, header/divider.
- `apps/docs/src/app/docs/_components/toc-cta.tsx` — new.

## Verification

- `pnpm --filter docs build` (or dev) compiles clean; Biome/lint passes.
- Manual visual check in light + dark: sidenav dots/active bar, preview segmented
  control + dotted stage, install terminal card, props table, TOC CTA card.
- Reduced-motion and mobile (sidebar drawer + TOC popover) still function.

## Risks

- Dot-color cycling depends on the Fumadocs sidebar DOM. Mitigation: inspect
  rendered markup; fall back to CSS counters or explicit per-color selectors.
- Fumadocs class names can change across versions (pinned at `16.10.2`). The CSS
  overrides are scoped to stable ids (`#nd-sidebar`) where possible.
