/**
 * Authentication E2E Tests
 */

import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should display login form", async ({ page }) => {
    await page.click('text=Login');
    
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.click('text=Login');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid email')).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.click('text=Login');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test("should navigate to register form", async ({ page }) => {
    await page.click('text=Login');
    await page.click('text=Register');
    
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("should register new user successfully", async ({ page }) => {
    await page.click('text=Login');
    await page.click('text=Register');
    
    const timestamp = Date.now();
    await page.fill('input[name="username"]', `testuser${timestamp}`);
    await page.fill('input[name="email"]', `test${timestamp}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
});
