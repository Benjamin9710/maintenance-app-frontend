# Repository guidance (maintenance-app-frontend)

## Tech & entrypoints

- React + TypeScript app built with Vite.
- App entrypoint is `src/main.tsx`; routing/providers live in `src/App.tsx`.
- UI uses MUI (`@mui/*`) with Emotion.
- Routing uses `react-router-dom`.
- Auth uses AWS Amplify/Cognito (configured from `import.meta.env.VITE_*`).
- Shared TypeScript types live under `src/types/`.

## Preferred workflows

- Use `npm run build` before committing UI changes.
- Use `npm run lint` for ESLint.
- Use `npm run dev` for local development.
- Use `npm run preview` to smoke-test the production build.

## Change discipline

- Keep changes minimal and scoped; avoid unrelated refactors.
- Do not add new dependencies unless necessary.
- Never hardcode secrets; prefer Vite environment variables (`VITE_*`).
- When changing routing/auth behavior, update pages/components/hooks together.
