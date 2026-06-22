---
name: component-creation
description: "Use when creating a new component for the design system. Covers file structure, package setup, Tailwind wiring, Storybook stories, and common anti-patterns."
---

# Creating a New Component

This skill documents the full process for adding a new component to the `@godui/components` design system monorepo.

## 1. Package Structure

All components live in the shared package at `packages/components/`:

```
packages/components/
  package.json          # @godui/components
  styles.css            # theme tokens + @source "./src" + @layer components
  src/
    index.ts            # re-exports all components
    shimmer-button.tsx
    magic-button.tsx
```

### src/{name}.tsx

```typescript
import * as React from "react";

export type MyComponentVariant = "primary" | "secondary";
export type MyComponentProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: MyComponentVariant;
};

const variantClasses: Record<MyComponentVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`base-classes ${variantClasses[variant]} ${className ?? ""}`}
        {...props}
      />
    );
  },
);
MyComponent.displayName = "MyComponent";

export { MyComponent };
```

### src/index.ts

Add named exports for the component and its prop types:

```typescript
export { MyComponent, type MyComponentProps, type MyComponentVariant } from "./my-component";
```

## 2. Wiring Into the System

### A. `packages/components/styles.css` — **required for Tailwind utilities**

The package stylesheet must include `@source "./src"` so Tailwind scans component files for utility classes:

```css
@import "tailwindcss";
@import "./theme/light.css";
@import "./theme/dark.css";

@source "./src";
```

Without this, Tailwind utility classes in component `.tsx` files (e.g. `bg-primary`) will not be generated.

For complex components that cannot use Tailwind utilities alone (e.g. 3D effects), add styles under `@layer components` in the same file.

### B. `apps/storybook/src/tailwind.css`

Storybook imports the package stylesheet and scans component source:

```css
@import "tailwindcss";
@import "@godui/components/fonts/vite.css";
@import "@godui/components/styles.css";

@source "../node_modules/@godui/components/src";
```

### C. `apps/docs/src/app/globals.css`

Docs already import `@godui/components/styles.css`. Keep an explicit source path:

```css
@source "../../../../packages/components/src";
```

### D. `apps/docs/next.config.ts`

`@godui/components` is already in `transpilePackages`. No change needed unless adding a new package.

### E. Storybook & docs dependencies

Both apps already depend on `@godui/components` via `workspace:*`. No `pnpm install` needed for new components in the shared package.

## 3. Storybook Story

Create `apps/storybook/src/stories/{name}.stories.tsx`:

```typescript
import { MyComponent, type MyComponentProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Default",
    variant: "primary",
  } satisfies MyComponentProps,
};
```

Include stories for each variant, disabled state, and sizes where applicable.

## 4. Docs Page

Create `apps/docs/content/docs/components/{name}.mdx` using the Preview/Code + Installation + Usage pattern:

```mdx
---
title: My Component
description: Short description.
---

import { MyComponent } from "@godui/components";

<ComponentPreview code={`import { MyComponent } from "@godui/components";

export function MyComponentDemo() {
  return <MyComponent variant="primary">Example</MyComponent>;
}`}>
  <MyComponent variant="primary">Example</MyComponent>
</ComponentPreview>

## Installation

<ComponentInstall componentName="MyComponent" />

## Usage

\`\`\`tsx
import { MyComponent } from "@godui/components";
\`\`\`

\`\`\`tsx
<MyComponent variant="primary">Example</MyComponent>
\`\`\`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `"primary" \| "secondary"` | `"primary"` | Visual style |
```

Add the page slug to `apps/docs/content/docs/components/meta.json`:

```json
{
  "title": "Components",
  "pages": ["button", "my-component"]
}
```

`ComponentPreview` and `ComponentInstall` are registered globally in `apps/docs/src/components/mdx.tsx`.

## 5. Styling Rules

### Prefer static Tailwind utility classes

All styling MUST use static, scannable Tailwind class strings:

```typescript
const variantClasses: Record<string, string> = {
  primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  outline: "border border-border bg-background hover:bg-accent",
};
```

### Use design system tokens

Reference CSS custom properties through Tailwind utilities mapped in `@theme inline`:

```typescript
"bg-primary"       // var(--color-primary)
"text-foreground"  // var(--color-foreground)
"rounded-lg"       // var(--radius-lg)
"shadow-sm"        // var(--shadow-sm)
```

### Use `@layer components` for non-utility styles

When a component needs layered DOM, animations, or pseudo-elements that Tailwind utilities cannot express cleanly, add CSS classes to `packages/components/styles.css`:

```css
@layer components {
  .my-component { /* ... */ }
}
```

Reference those classes from the component with static strings: `className="my-component"`.

## 6. Anti-Patterns

### NEVER construct Tailwind class names dynamically

```typescript
// WRONG
<div className={`grid-cols-${count}`} />

// CORRECT
const columnClasses: Record<number, string> = {
  4: "grid-cols-4",
  8: "grid-cols-8",
};
```

### NEVER skip `@source "./src"` in styles.css

Tailwind will not generate utility classes used in component files without it.

### NEVER use `"use client"` unnecessarily

Only add when the component uses React hooks or requires client-only APIs.

### NEVER skip `forwardRef`

All components must forward refs for composition.

### NEVER use arbitrary z-index values

Use the design system scale: `z-base`, `z-raised`, `z-overlay`, `z-sticky`, `z-popover`, `z-modal`, `z-toast`.

## 7. Checklist

Before considering a component done:

- [ ] Component created at `packages/components/src/{name}.tsx`
- [ ] Component and prop types exported from `packages/components/src/index.ts`
- [ ] `@source "./src"` present in `packages/components/styles.css`
- [ ] Complex CSS (if any) added to `@layer components` in `styles.css`
- [ ] Storybook story at `apps/storybook/src/stories/{name}.stories.tsx` with `tags: ["autodocs"]`
- [ ] Docs page at `apps/docs/content/docs/components/{name}.mdx`
- [ ] Page added to `apps/docs/content/docs/components/meta.json`
- [ ] All Tailwind classes are static strings
- [ ] `React.forwardRef` used
- [ ] Variant, disabled, and size stories included where applicable

## 8. Available Theme Tokens

| Category | Examples | Usage |
|----------|----------|-------|
| Colors | `bg-primary`, `text-foreground`, `border-border` | `--color-*` tokens |
| Radius | `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` | `--radius-*` tokens |
| Shadows | `shadow-2xs` through `shadow-2xl` | `--shadow-*` tokens |
| Z-index | `z-base`, `z-raised`, `z-overlay`, `z-sticky`, `z-popover`, `z-modal`, `z-toast` | `--z-index-*` tokens |
| Fonts | `font-sans`, `font-mono`, `font-serif` | `--font-*` tokens |
