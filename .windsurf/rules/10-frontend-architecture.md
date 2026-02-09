# Frontend architecture & boundaries

## Entry points

- App entrypoint is `src/main.tsx`.
- Top-level routing and global providers live in `src/App.tsx`.

## Layering

- Route-level screens live under `src/pages/`.
- Reusable UI pieces live under `src/components/`.
- Reusable logic lives under `src/hooks/`.
- Shared TypeScript types live under `src/types/`.
- Shared utilities (HTTP, API, theming) live under `src/lib/`.

## Design rules

- Keep route components focused on composition and page-level state.
- Keep reusable components focused on UI rendering with explicit, typed props.
- Prefer hooks for shared stateful logic; avoid duplicating auth / fetch logic in components.
- Keep API/HTTP details out of components when possible; delegate to `src/lib/`.
