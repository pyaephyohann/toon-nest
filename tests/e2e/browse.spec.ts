/**
 * Browse E2E Tests
 */

import { test, expect } from "@playwright/test";

test.describe("Browse Manga", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should display manga list", async ({ page }) => {
    await page.goto("http://localhost:3000/trending");
    
    const mangaCards = page.locator('[data-testid="manga-card"]');
    const count = await mangaCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should search for manga", async ({ page }) => {
    await page.fill('input[placeholder="Search manga..."]', 'One Piece');
    await page.press('input[placeholder="Search manga..."]', 'Enter');
    
    await expect(page).toHaveURL(/\/search/);
    await expect(page.locator('text=One Piece')).toBeVisible();
  });

  test("should filter by genre", async ({ page }) => {
    await page.goto("http://localhost:3000/genres");
    
    await page.click('text=Action');
    
    await expect(page).toHaveURL(/\/genres/);
    const mangaCards = page.locator('[data-testid="manga-card"]');
    const count = await mangaCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should navigate to manga details", async ({ page }) => {
    await page.goto("http://localhost:3000/trending");
    
    const firstManga = page.locator('[data-testid="manga-card"]').first();
    await firstManga.click();
    
    await expect(page).toHaveURL(/\/series\/.+/);
    await expect(page.locator('[data-testid="manga-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="manga-description"]')).toBeVisible();
  });
});
