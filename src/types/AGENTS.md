# src/types/

## Purpose

- Shared TypeScript types used across the app.

## Conventions

- Prefer exported `type`/`interface` definitions with clear names.
- Keep this directory free of runtime logic (no side effects, no network calls).
- Prefer placing API request/response shapes here so components and hooks can share consistent types.
