import { test, expect } from '@playwright/test';

test.describe('Authentication and routing', () => {
  test('unauthenticated user visiting home is redirected to login', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/login$/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login$/);
  });

  test('login page renders login button', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('sign out button is not visible on login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Sign Out' })).not.toBeVisible();
  });
});
