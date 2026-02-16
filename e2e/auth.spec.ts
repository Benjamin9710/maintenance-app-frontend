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

  test('login page does not show admin button', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Sign in as Manager' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in as Contractor' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in as Admin' })).not.toBeVisible();
  });

  test('admin entry page renders sign-in button', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Sign in as Admin' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in as Manager' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in as Contractor' })).not.toBeVisible();
  });

  test('unauthenticated admin dashboard redirects', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForURL(/\/admin$/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin$/);
  });

  test.describe('Cognito Hosted UI sign-up disabled', () => {
    test('manager hosted UI does not show sign-up', async ({ page }) => {
      await page.goto('https://backend-app-api-dev-dev-auth.auth.ap-southeast-2.amazoncognito.com/oauth2/authorize?client_id=6bd36d510n93a3anb1m2db0qti&response_type=code&scope=openid+email+profile&redirect_uri=http://localhost:5173/');
      await page.waitForLoadState('networkidle');
      
      // Main verification: sign-up should not be visible
      await expect(page.getByRole('link', { name: /sign.?up/i })).not.toBeVisible();
      await expect(page.getByText(/sign.?up/i)).not.toBeVisible();
    });

    test('contractor hosted UI does not show sign-up', async ({ page }) => {
      await page.goto('https://backend-app-api-dev-dev-contractor-auth.auth.ap-southeast-2.amazoncognito.com/oauth2/authorize?client_id=5s4fctfpciv6smu5ig34a2mma6&response_type=code&scope=openid+email+profile&redirect_uri=http://localhost:5173/');
      await page.waitForLoadState('networkidle');
      
      // Main verification: sign-up should not be visible
      await expect(page.getByRole('link', { name: /sign.?up/i })).not.toBeVisible();
      await expect(page.getByText(/sign.?up/i)).not.toBeVisible();
    });

    test('admin hosted UI does not show sign-up', async ({ page }) => {
      await page.goto('https://backend-app-api-dev-dev-admin-auth.auth.ap-southeast-2.amazoncognito.com/oauth2/authorize?client_id=3jlk2v3nml59elf5hdilifo1e0&response_type=code&scope=openid+email+profile&redirect_uri=http://localhost:5173/');
      await page.waitForLoadState('networkidle');
      
      // Main verification: sign-up should not be visible
      await expect(page.getByRole('link', { name: /sign.?up/i })).not.toBeVisible();
      await expect(page.getByText(/sign.?up/i)).not.toBeVisible();
    });
  });
});
