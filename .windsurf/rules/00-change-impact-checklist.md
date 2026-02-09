# Change Impact Checklist

Use this checklist whenever making changes.

## Docs & rules impact

- Determine whether the changes being made are worthy of `README.md` changes.
- Determine whether the changes being made are worthy of `AGENTS.md` changes or new `AGENTS.md` files.
- Determine whether the changes being made are worthy of Windsurf rules changes or new Windsurf rules files.

## UX & behavior impact

- If you changed routing, navigation, or authentication gating:
  - Ensure all intended routes are reachable.
  - Ensure unauthenticated users are redirected to `/login` (or the intended route).
- If you changed UI behavior:
  - Validate loading/error/empty states.
  - Validate accessibility basics (keyboard navigation and focus).

## Safety & scope

- Keep changes minimal and scoped; avoid unrelated refactors.
- Do not add new dependencies unless necessary.
- Never hardcode secrets; prefer Vite environment variables (`VITE_*`).

## Suggested local verification (when relevant)

- `npm run build`
- `npm run lint`
- `npm run dev` (manual smoke test in browser)
- `npm run preview` (production build smoke test)
