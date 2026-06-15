---
name: godui-component-creation
description: Create new components for the GoDUI design system in @godui/components. Use when adding a component, fixing missing Tailwind styles on components, wiring Storybook stories, or writing docs pages with ComponentPreview and ComponentInstall.
---

# GoDUI Component Creation

Follow this workflow when adding a component to `@godui/components`.

## Quick reference

| Step | File |
|------|------|
| Component | `packages/components/src/{name}.tsx` |
| Export | `packages/components/src/index.ts` |
| Tailwind scan | `packages/components/styles.css` → `@source "./src"` |
| Complex CSS | `packages/components/styles.css` → `@layer components` |
| Storybook | `apps/storybook/src/stories/{name}.stories.tsx` |
| Docs | `apps/docs/content/docs/components/{name}.mdx` |
| Nav | `apps/docs/content/docs/components/meta.json` |

## 1. Create the component

Use static Tailwind utility classes with design tokens. Map variants to static class strings:

```typescript
import * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  outline: "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center font-medium ${variantClasses[variant]} ${className ?? ""}`}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button };
```

Export from `packages/components/src/index.ts`.

## 2. Ensure Tailwind scans component files

**This is the most common reason styles don't apply.**

`packages/components/styles.css` must include:

```css
@source "./src";
```

Consuming apps also scan explicitly:

- `apps/storybook/src/tailwind.css` → `@source "../node_modules/@godui/components/src"`
- `apps/docs/src/app/globals.css` → `@source "../../../../packages/components/src"`

If utilities like `bg-primary` render unstyled, verify `@source "./src"` exists and restart the dev server.

## 3. Choose a styling approach

**Tailwind utilities** (Button, Typography): classes in `.tsx`, scanned via `@source "./src"`.

**CSS components layer** (MagicButton): static class names + rules in `styles.css`:

```css
@layer components {
  .three-d-button { /* layered 3D styles */ }
}
```

Do not mix approaches unnecessarily. Use CSS layer only when utilities cannot express the design.

## 4. Storybook story

```typescript
import { MyComponent, type MyComponentProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
```

Include stories for each variant, sizes, and disabled state.

## 5. Docs page

Use the established docs layout — Preview/Code tabs, then Installation, Usage, Props:

```mdx
---
title: My Component
description: Short description.
---

import { MyComponent } from "@godui/components";

<ComponentPreview code={`...`}>
  <MyComponent variant="primary">Example</MyComponent>
</ComponentPreview>

## Installation
<ComponentInstall componentName="MyComponent" />

## Usage
\`\`\`tsx
import { MyComponent } from "@godui/components";
\`\`\`

## Props
| Prop | Type | Default | Description |
```

Add slug to `apps/docs/content/docs/components/meta.json`.

## 6. Naming rules

- Component names must be valid JS identifiers (`MagicButton` not `3DButton`)
- File names: kebab-case (`shimmer-button.tsx`, `magic-button.tsx`)
- Export PascalCase component + prop types from `index.ts`

## 7. Checklist

- [ ] `packages/components/src/{name}.tsx` with `forwardRef`
- [ ] Exported from `index.ts`
- [ ] `@source "./src"` in `styles.css`
- [ ] Storybook story with autodocs
- [ ] Docs MDX with ComponentPreview + ComponentInstall
- [ ] Added to `components/meta.json`
- [ ] Static Tailwind classes only (no dynamic class construction)
- [ ] Verified styles in Storybook and docs after dev server restart
