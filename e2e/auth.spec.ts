import { test, expect } from '@playwright/test';

test.describe('Authentication and routing', () => {
  test('unauthenticated user visiting home is redirected to login', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/login$/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login$/);
  });

  test('login page renders both persona sign-in buttons', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Sign in as Manager' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in as Contractor' })).toBeVisible();
  });

  test('sign out button is not visible on login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Sign Out' })).not.toBeVisible();
  });
});
