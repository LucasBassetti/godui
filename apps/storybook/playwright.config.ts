import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./motion-trace",
  timeout: 30_000,
  retries: 0,
  workers: 1,
  use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:6007" },
  webServer: {
    command: "node motion-trace/serve-static.mjs",
    url: "http://127.0.0.1:6007/iframe.html",
    reuseExistingServer: !process.env.CI,
  },
});
