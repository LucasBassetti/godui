---
name: component-creation
description: "Use when creating a new component for the design system. Covers file structure, package setup, Tailwind wiring, Storybook stories, and common anti-patterns."
---

# Creating a New Component

This skill documents the full process for adding a new component to the `@godui` design system monorepo.

## 1. Package Structure

Create `packages/{name}/` with the following files:

```
packages/{name}/
  package.json
  tsconfig.json
  src/
    index.ts
    {name}.tsx
```

### package.json

```json
{
  "name": "@godui/{name}",
  "version": "0.0.0",
  "private": true,
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "build": "echo 'skip'",
    "lint": "tsc -p tsconfig.json --noEmit"
  },
  "peerDependencies": {
    "react": "^18 || ^19"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "typescript": "^5.9.3"
  }
}
```

Add workspace dependencies only if actually needed (e.g. a shared `@godui/hooks` or `@godui/primitives` package, once one exists).

### tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### src/index.ts

Named exports only — export the component, its props type, and any sub-components:

```typescript
export { MyComponent, type MyComponentProps } from "./my-component";
```

### src/{name}.tsx

```typescript
"use client";  // ONLY if the component uses hooks (useState, useEffect, useRef, etc.)

import * as React from "react";

export type MyComponentProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary";
  // Add component-specific props here
};

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    // Component logic here

    return (
      <div
        ref={ref}
        className={`base-classes ${variantClasses[variant]} ${className ?? ""}`}
        {...props}
      />
    );
  }
);
MyComponent.displayName = "MyComponent";

export { MyComponent };
```

## 2. Wiring Into the System

The following files must be updated to make the component available:

### A. `apps/docs/src/tailwind.css`

Add a `@source` directive so Tailwind scans the component for class names:

```css
@source "../node_modules/@godui/{name}";
```

### B. `apps/web/src/app/globals.css`

Add a `@source` directive with the relative path to the package:

```css
@source "../../../../packages/{name}";
```

### C. `apps/docs/package.json`

Add the dependency:

```json
{
  "dependencies": {
    "@godui/{name}": "workspace:*"
  }
}
```

### D. `apps/web/next.config.ts`

Add the package to `transpilePackages`:

```typescript
transpilePackages: ["@godui/{name}"],
```

### E. Install dependencies

Run from the repo root:

```bash
pnpm install
```

## 3. Storybook Story

Create `apps/docs/src/stories/{name}.stories.tsx`:

```typescript
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MyComponent, type MyComponentProps } from "@godui/{name}";

const meta = {
  title: "Components/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",  // or "fullscreen" / "padded" for layout components
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default",
    variant: "default",
  } satisfies MyComponentProps,
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  } satisfies MyComponentProps,
};

// For complex rendering, use the render function pattern:
export const Complex: Story = {
  render: () => (
    <MyComponent variant="default">
      <span>Custom content</span>
    </MyComponent>
  ),
};
```

## 4. Styling Rules

### Use static Tailwind classes

All styling MUST use static, scannable Tailwind class strings. Tailwind JIT scans source files for class names at build time — it cannot detect dynamically constructed strings.

```typescript
// CORRECT — static class strings
const variantClasses = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

// CORRECT — conditional between static strings
<div className={`base ${active ? "opacity-100" : "opacity-0"}`} />
```

### Use design system tokens

Reference CSS custom properties through Tailwind utilities mapped in `@theme inline`:

```typescript
// CORRECT — uses theme tokens
"bg-primary"          // maps to var(--color-primary)
"z-overlay"           // maps to var(--z-index-overlay)
"rounded-lg"          // maps to var(--radius-lg)
"shadow-md"           // maps to var(--shadow-md)

// CORRECT — direct CSS variable reference when no Tailwind utility exists
"bg-[var(--some-token)]"
```

### Use inline styles only for truly dynamic values

Inline `style` prop is acceptable only for values computed at runtime that cannot be expressed as static Tailwind classes (e.g., grid positions, mouse-tracked coordinates).

```typescript
// CORRECT — runtime-computed positioning
<div style={{ gridColumnStart: column, gridColumnEnd: column + span }} />

// CORRECT — animation driven by JS
<div style={{ transform: `translate(${x}px, ${y}px)` }} />
```

## 5. Anti-Patterns

### NEVER use `dangerouslySetInnerHTML` for styling

```typescript
// WRONG — injecting <style> tags
<style dangerouslySetInnerHTML={{ __html: `.grid { grid-template-columns: ... }` }} />

// CORRECT — use static Tailwind classes or inline style for dynamic values
<div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12" />
```

### NEVER construct Tailwind class names dynamically

```typescript
// WRONG — Tailwind cannot scan template literals
<div className={`grid-cols-${count}`} />
<div className={`grid-cols-[repeat(${n},1fr)]`} />

// CORRECT — map to static classes
const columnClasses: Record<number, string> = {
  4: "grid-cols-4",
  8: "grid-cols-8",
  12: "grid-cols-12",
};
<div className={columnClasses[count]} />
```

### NEVER use `"use client"` unnecessarily

Only add the directive when the component uses React hooks (`useState`, `useEffect`, `useRef`, `useContext`, etc.) or event handlers that require client-side interactivity. Pure layout/presentational components should NOT have it.

### NEVER use `useLayoutEffect` or `window` in initial state

Server-side rendering will cause hydration mismatches:

```typescript
// WRONG — window is undefined on the server
const [width, setWidth] = useState(window.innerWidth);

// CORRECT — use mobile-first default, update in useEffect
const [width, setWidth] = useState(0);
useEffect(() => setWidth(window.innerWidth), []);
```

### NEVER skip `forwardRef`

All components must forward refs for composition and imperative access:

```typescript
// WRONG
function MyComponent(props: MyComponentProps) { ... }

// CORRECT
const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  (props, ref) => { ... }
);
```

### NEVER use arbitrary z-index values

Use the design system z-index scale:

```typescript
// WRONG
"z-10"
"z-[999]"

// CORRECT
"z-base"       // 0
"z-raised"     // 10
"z-overlay"    // 20
"z-sticky"     // 30
"z-popover"    // 40
"z-modal"      // 50
"z-toast"      // 60
```

## 6. Checklist

Before considering a component done:

- [ ] Package created at `packages/{name}/` with `package.json`, `tsconfig.json`, `src/index.ts`, `src/{name}.tsx`
- [ ] Component and props type exported from `src/index.ts`
- [ ] `@source` added to `apps/docs/src/tailwind.css`
- [ ] `@source` added to `apps/web/src/app/globals.css`
- [ ] Added to `apps/docs/package.json` dependencies
- [ ] Added to `apps/web/next.config.ts` `transpilePackages`
- [ ] `pnpm install` run from repo root
- [ ] Storybook story created at `apps/docs/src/stories/{name}.stories.tsx` with `tags: ["autodocs"]`
- [ ] All Tailwind classes are static strings
- [ ] `"use client"` only if hooks are used
- [ ] `React.forwardRef` used
- [ ] Z-index uses design system tokens
- [ ] No `dangerouslySetInnerHTML`
- [ ] No hydration mismatches (no `window` in initial state)

## 7. Available Theme Tokens

When styling components, these tokens are available via Tailwind utilities:

| Category | Examples | Usage |
|----------|----------|-------|
| Colors | `bg-primary`, `text-foreground`, `border-border` | `--color-*` tokens |
| Radius | `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` | `--radius-*` tokens |
| Shadows | `shadow-2xs` through `shadow-2xl` | `--shadow-*` tokens |
| Z-index | `z-base`, `z-raised`, `z-overlay`, `z-sticky`, `z-popover`, `z-modal`, `z-toast` | `--z-index-*` tokens |
| Fonts | `font-sans`, `font-mono`, `font-serif` | `--font-*` tokens |
| Spacing | Standard Tailwind spacing scale (`p-1` = 4px through `p-24` = 96px) | Default scale |
