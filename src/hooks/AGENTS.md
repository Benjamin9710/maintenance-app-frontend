# src/hooks/

## Purpose

- Shared stateful logic and integration code.

## Auth hooks

- Auth is handled via AWS Amplify/Cognito.
- Prefer a single place to configure Amplify; avoid configuring Amplify from multiple files.
- Avoid logging tokens or sensitive user attributes.

## Reliability

- Keep async state predictable (loading/success/error).
- Ensure hooks are safe under React StrictMode (effects may run twice in development).
