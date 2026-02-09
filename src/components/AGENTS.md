# src/components/

## Purpose

- Reusable UI components used across pages.

## Component design

- Prefer explicit, typed props.
- Keep components presentational when possible; push side effects and stateful logic into hooks.
- Keep loading/error/empty states explicit.

## Routing

- Components that integrate with routing (e.g. auth gating) should keep behavior stable and predictable.
