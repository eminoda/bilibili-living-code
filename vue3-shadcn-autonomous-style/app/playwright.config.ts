import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const draftVideosRoot = path.resolve(__dirname, "../videos");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  timeout: 120_000,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:5199",
    trace: "on-first-retry",
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    video: {
      mode: "on",
      size: { width: 1920, height: 1080 },
    },
  },
  outputDir: path.join(draftVideosRoot, "test-results"),
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 2,
        video: {
          mode: "on",
          size: { width: 1920, height: 1080 },
        },
      },
    },
  ],
  webServer: {
    command:
      "pnpm run build && pnpm exec vite preview --host 127.0.0.1 --port 5199 --strictPort",
    url: "http://127.0.0.1:5199",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
