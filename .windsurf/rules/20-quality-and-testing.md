# Quality expectations

## TypeScript

- Keep `strict` typing expectations.
- Avoid `any` unless there is no practical alternative; prefer explicit types for API payloads.

## Linting

- ESLint is required: `npm run lint` should pass.
- Prefer small, focused changes; avoid introducing unused exports/vars.

## Testing

- If/when tests are present, prefer deterministic tests for:
  - auth gating behavior
  - routing behavior
  - API error handling and loading states
