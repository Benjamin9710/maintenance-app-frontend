import { test, expect } from '@playwright/test';

test.describe('Admin routes unauthenticated smoke', () => {
  test('protected admin routes redirect to /admin regardless of URL params', async ({ page }) => {
    const protectedUrls = [
      '/admin/dashboard',
      '/admin/managers',
      '/admin/contractors',
      '/admin/managers/test-manager-sub/properties',
      '/admin/managers/test-manager-sub/properties?includeArchived=true',
      '/admin/managers/test-manager-sub/properties?includeArchived=false',
    ];

    for (const url of protectedUrls) {
      await page.goto(url);
      await page.waitForURL(/\/admin$/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/admin$/);
    }
  });

  test('admin entry page shows only admin sign-in button', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText('Administrator Access');
    await expect(page.getByRole('button', { name: 'Sign in as Admin' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in as Manager' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in as Contractor' })).not.toBeVisible();
  });
});
