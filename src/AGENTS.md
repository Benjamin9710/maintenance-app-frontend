# src/

## TypeScript & React conventions

- Prefer strict typing; avoid `any` unless there is no practical alternative.
- Keep imports at the top.
- Prefer small, focused components/hooks with clear responsibilities.

## Architecture boundaries

- Route-level screens belong in `src/pages/`.
- Reusable UI belongs in `src/components/`.
- Shared stateful logic belongs in `src/hooks/`.
- Shared TypeScript types belong in `src/types/`.
- HTTP/API helpers belong in `src/lib/`.
