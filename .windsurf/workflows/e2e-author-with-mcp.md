---
description: Author and update E2E tests using Playwright MCP browser for exploration
---

## Prerequisites

- `.env` must contain `VITE_MANAGER_TEST_EMAIL`, `VITE_MANAGER_TEST_PASSWORD`, `VITE_CONTRACTOR_TEST_EMAIL`, `VITE_CONTRACTOR_TEST_PASSWORD`, `VITE_ADMIN_TEST_EMAIL`, and `VITE_ADMIN_TEST_PASSWORD` with valid Cognito test user credentials for all three personas.
- Dev server must be running on port 5173.

## Steps

> Required for validating frontend changes with MCP exploration.

1. Start the dev server (if not already running):
   ```
   yarn dev
   ```

2. Read test credentials from `.env`:
   - Manager: `VITE_MANAGER_TEST_EMAIL` and `VITE_MANAGER_TEST_PASSWORD`
   - Contractor: `VITE_CONTRACTOR_TEST_EMAIL` and `VITE_CONTRACTOR_TEST_PASSWORD`
   - Admin: `VITE_ADMIN_TEST_EMAIL` and `VITE_ADMIN_TEST_PASSWORD`

3. Open the Playwright MCP browser and navigate to `http://127.0.0.1:5173`.

4. If redirected to `/login`, verify both persona buttons are visible:
   - "Sign in as Manager" button
   - "Sign in as Contractor" button
   - **Note**: Admin login is accessed via direct URL `/admin`, not from this page

5. **For Manager testing:**
   - Click the "Sign in as Manager" button. This will redirect to the Manager Cognito hosted UI.
   - On the Cognito hosted UI (`*.amazoncognito.com`):
     - Take a snapshot to identify the email/username and password fields.
     - Fill in `VITE_MANAGER_TEST_EMAIL` into the email/username field.
     - Fill in `VITE_MANAGER_TEST_PASSWORD` into the password field.
     - Click the Sign in button.

6. **For Contractor testing:**
   - Click the "Sign in as Contractor" button. This will redirect to the Contractor Cognito hosted UI.
   - On the Cognito hosted UI (`*.amazoncognito.com`):
     - Take a snapshot to identify the email/username and password fields.
     - Fill in `VITE_CONTRACTOR_TEST_EMAIL` into the email/username field.
     - Fill in `VITE_CONTRACTOR_TEST_PASSWORD` into the password field.
     - Click the Sign in button.

7. **For Admin testing:**
   - Navigate directly to `http://127.0.0.1:5173/admin`.
   - Verify the "Sign in as Admin" button is visible.
   - Click the "Sign in as Admin" button. This will redirect to the Admin Cognito hosted UI.
   - On the Cognito hosted UI (`*.amazoncognito.com`):
     - Take a snapshot to identify the email/username and password fields.
     - Fill in `VITE_ADMIN_TEST_EMAIL` into the email/username field.
     - Fill in `VITE_ADMIN_TEST_PASSWORD` into the password field.
     - Click the Sign in button.

8. After sign-in, Cognito redirects back to `http://127.0.0.1:5173/`. Wait for the page to settle (use `browser_wait_for` or snapshot) and confirm:
   - Manager users are redirected to `/manager` and see the Manager Dashboard
   - Contractor users are redirected to `/contractor` and see the Contractor Dashboard
   - Admin users are redirected to `/admin/dashboard` and see the Admin Dashboard
   - Verify the authenticated state (e.g., Sign Out button visible, persona-specific content)

9. Explore the intended flow using `browser_snapshot` and identify robust selectors (prefer `getByRole` for buttons, headings, etc.).

10. Create or update a test spec under `e2e/` (e.g., `e2e/auth.spec.ts`), encoding the explored steps for all three personas.

11. Run tests to verify:
    ```
    yarn test:e2e
    ```

12. If needed, debug interactively:
    ```
    yarn test:e2e:ui
    ```

// This workflow is human-in-the-loop: use MCP for browser exploration, then write code.
