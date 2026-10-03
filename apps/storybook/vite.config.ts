import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const core = (p: string) =>
  fileURLToPath(new URL(`../../packages/components/src/${p}`, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Core components use shadcn-install-shaped imports; point them at core.
  resolve: {
    alias: [
      { find: /^@\/lib\/utils$/, replacement: core("lib/utils.ts") },
      { find: /^@\/hooks\/(.*)$/, replacement: `${core("hooks")}/$1` },
      { find: /^@\/components\/ui\/(.*)$/, replacement: `${core("ui")}/$1` },
    ],
  },
});
