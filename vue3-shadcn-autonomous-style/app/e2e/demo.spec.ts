import { test, expect } from "@playwright/test";

/** blog.md：ColdOpen — 两档并排：Ant primary / 绿色+圆角（class + :deep + !important） */
test("coldopen ant pain", async ({ page }) => {
  await page.goto("/pain");
  await expect(page.getByTestId("pain-stage")).toBeVisible();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "默认 Primary" }).hover();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: /pain-btn--green/ }).hover();
  await page.waitForTimeout(1200);
});

/** blog.md：五分钟代码所有权 — 预览区按钮/卡片强对比，便于录屏 */
test("ownership local ui", async ({ page }) => {
  await page.goto("/ownership");
  await expect(page.getByTestId("ownership-stage")).toBeVisible();
  await expect(page.getByTestId("ownership-preview")).toBeVisible();
  await page.waitForTimeout(600);
  await page.getByTestId("ownership-demo-button").hover();
  await page.waitForTimeout(700);
  await page.getByTestId("ownership-demo-card").hover();
  await page.waitForTimeout(900);
});

/** blog.md：暗黑主题一键切换 */
test("theme toggle", async ({ page }) => {
  await page.goto("/theme");
  await expect(page.getByTestId("theme-stage")).toBeVisible();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "切换明暗" }).click();
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "切换明暗" }).click();
  await page.waitForTimeout(800);
});

/** blog.md：TanStack 表格 — 搜索 / 排序 / 分页（对齐 DESIGN.md 中后台密度） */
test("table sort header", async ({ page }) => {
  await page.goto("/table");
  await expect(page.getByTestId("table-stage")).toBeVisible();
  await page.waitForTimeout(900);
  await page.getByTestId("table-search").fill("结算");
  await page.waitForTimeout(700);
  await page.getByTestId("table-search").clear();
  await page.waitForTimeout(400);
  await page.getByRole("columnheader", { name: /金额/ }).click();
  await page.waitForTimeout(900);
  await page.getByRole("columnheader", { name: /名称/ }).click();
  await page.waitForTimeout(900);
  await page.getByTestId("table-next").click();
  await page.waitForTimeout(900);
  await page.getByTestId("table-prev").click();
  await page.waitForTimeout(700);
  await page.getByTestId("table-refresh").click();
  await page.waitForTimeout(800);
});
