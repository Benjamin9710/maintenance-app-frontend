# Repository guidance (maintenance-app-frontend)

## Tech & entrypoints

- React + TypeScript app built with Vite.
- App entrypoint is `src/main.tsx`; routing/providers live in `src/App.tsx`.
- UI uses MUI (`@mui/*`) with Emotion.
- Routing uses `react-router-dom`.
- Auth uses AWS Amplify/Cognito (configured from `import.meta.env.VITE_*`).
- Shared TypeScript types live under `src/types/`.

## Preferred workflows

- Use `yarn build` before committing UI changes.
- Use `yarn lint` for ESLint.
- Use `yarn dev` for local development.
- Use `yarn preview` to smoke-test the production build.
- Use `yarn test:e2e` for automated smoke coverage during dev (auth gating, routing).
- For validating any frontend change, you must use the Playwright MCP workflows: `/e2e-author-with-mcp` for exploration and `/e2e-run` or `/e2e-ui` to verify.

## Change discipline

- Keep changes minimal and scoped; avoid unrelated refactors.
- Do not add new dependencies unless necessary.
- Never hardcode secrets; prefer Vite environment variables (`VITE_*`).
- When changing routing/auth behavior, update pages/components/hooks together.
- **All TypeScript errors must be resolved before considering a task complete.** Run `yarn build` to verify zero type errors after every code change.
- Package manager is Yarn 4 with `nodeLinker: node-modules` (`.yarnrc.yml`). Use `yarn install` after dependency changes.
