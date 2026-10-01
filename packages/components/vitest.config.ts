import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const src = (p: string) =>
  fileURLToPath(new URL(`./src/${p}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  // shadcn-install-shaped imports (`@/lib/utils`, `@/components/ui/*`,
  // `@/hooks/*`) resolve to this package's sources.
  resolve: {
    alias: [
      { find: /^@\/lib\/(.*)$/, replacement: `${src("lib")}/$1` },
      { find: /^@\/hooks\/(.*)$/, replacement: `${src("hooks")}/$1` },
      { find: /^@\/components\/ui\/(.*)$/, replacement: `${src("ui")}/$1` },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
