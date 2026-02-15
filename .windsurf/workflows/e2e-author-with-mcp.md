---
description: Author and update E2E tests using Playwright MCP browser for exploration
---

## Prerequisites

- `.env` must contain `VITE_TEST_EMAIL` and `VITE_TEST_PASSWORD` with valid Cognito test user credentials.
- Dev server must be running on port 5173.

## Steps

> Required for validating frontend changes with MCP exploration.

1. Start the dev server (if not already running):
   ```
   yarn dev
   ```

2. Read test credentials from `.env` (`VITE_TEST_EMAIL` and `VITE_TEST_PASSWORD`).

3. Open the Playwright MCP browser and navigate to `http://127.0.0.1:5173`.

4. If redirected to `/login`, click the Login button. This will redirect to the Cognito hosted UI.

5. On the Cognito hosted UI (`*.amazoncognito.com`):
   - Take a snapshot to identify the email/username and password fields.
   - Fill in `VITE_TEST_EMAIL` into the email/username field.
   - Fill in `VITE_TEST_PASSWORD` into the password field.
   - Click the Sign in button.

6. After sign-in, Cognito redirects back to `http://127.0.0.1:5173/`. Wait for the page to settle (use `browser_wait_for` or snapshot) and confirm the authenticated state (e.g., Sign Out button visible, no Login button).

7. Explore the intended flow using `browser_snapshot` and identify robust selectors (prefer `getByRole` for buttons, headings, etc.).

8. Create or update a test spec under `e2e/` (e.g., `e2e/auth.spec.ts`), encoding the explored steps.

9. Run tests to verify:
   ```
   yarn test:e2e
   ```

10. If needed, debug interactively:
    ```
    yarn test:e2e:ui
    ```

// This workflow is human-in-the-loop: use MCP for browser exploration, then write code.
