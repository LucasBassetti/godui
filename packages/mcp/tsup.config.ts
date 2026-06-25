import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  clean: true,
  minify: false,
  // Shebang so the published bin is directly executable via npx.
  banner: { js: "#!/usr/bin/env node" },
});
