/**
 * Admin E2E Tests
 */

import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto("http://localhost:3000/login");
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/$/);
  });

  test("should access admin dashboard", async ({ page }) => {
    await page.goto("http://localhost:3000/admin");
    
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test("should display statistics", async ({ page }) => {
    await page.goto("http://localhost:3000/admin");
    
    const statCards = page.locator('[data-testid="stat-card"]');
    const count = await statCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should navigate to settings", async ({ page }) => {
    await page.goto("http://localhost:3000/admin");
    await page.click('text=Settings');
    
    await expect(page).toHaveURL(/\/admin\/settings$/);
    await expect(page.locator('text=System Settings')).toBeVisible();
  });

  test("should update general settings", async ({ page }) => {
    await page.goto("http://localhost:3000/admin/settings");
    await page.click('text=General');
    
    await page.fill('input[name="siteName"]', 'Test Site');
    await page.click('button:has-text("Save")');
    
    await expect(page.locator('text=Settings saved')).toBeVisible();
  });

  test("should navigate to moderation", async ({ page }) => {
    await page.goto("http://localhost:3000/admin");
    await page.click('text=Moderation');
    
    await expect(page).toHaveURL(/\/admin\/moderation$/);
    await expect(page.locator('text=Reports')).toBeVisible();
  });
});
