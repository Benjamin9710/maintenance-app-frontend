# Quality expectations

## TypeScript

- Keep `strict` typing expectations.
- Avoid `any` unless there is no practical alternative; prefer explicit types for API payloads.
- **All TypeScript errors must be resolved before considering a task complete.** Run `yarn build` (which invokes `tsc`) to verify zero type errors after every code change.
- When adding or modifying imports, verify the referenced package is installed and its types are available in `devDependencies` (e.g. `@types/*`).

## Linting

- ESLint is required: `npm run lint` should pass.
- Prefer small, focused changes; avoid introducing unused exports/vars.

## Testing

- Validate frontend changes using the Playwright MCP workflows: `/e2e-author-with-mcp` for exploration and `/e2e-run` or `/e2e-ui` for verification.
- If/when tests are present, prefer deterministic tests for:
  - auth gating behavior
  - routing behavior
  - API error handling and loading states
- For E2E tests (Playwright), prefer `getByRole` locators and avoid brittle selectors.
