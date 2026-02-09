# Security & configuration

## Secrets

- Do not hardcode credentials, tokens, domains, or IDs.
- Use Vite environment variables for runtime configuration (`import.meta.env.VITE_*`).
- Avoid checking `.env` secrets into git.

## Auth

- Auth is handled via AWS Amplify/Cognito; avoid duplicating configuration.
- Avoid logging tokens or sensitive user attributes.

## Logging

- Avoid logging full error objects that may include sensitive details.
- Never log secrets.
