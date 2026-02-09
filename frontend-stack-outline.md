# Frontend Stack and Setup Outline

## Overview
This is a React SPA built with Vite + TypeScript, optimized for a CRUD-heavy admin portal with Cognito Hosted UI auth. Hosted on AWS Amplify for simplicity and AWS-native integration.

## Stack Choices
- **Framework**: React + Vite + TypeScript
- **UI Library**: MUI (Material-UI) – excellent for admin tables/forms
- **Data Fetching**: Lightweight manual approach (fetch wrapper + small hooks) – avoids extra dependencies
- **Forms**: React Hook Form – manual validation + type safety via TypeScript
- **Auth**: Cognito Hosted UI (Auth Code + PKCE) via AWS Amplify Auth library
- **Hosting**: AWS Amplify Hosting (git-based deploys, previews, HTTPS)
- **Build Tool**: Vite (fast dev server, optimized production builds)

## Project Structure
```
./
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components (tables, forms, etc.)
│   ├── pages/            # Route components (dashboard, lists, etc.)
│   ├── hooks/            # Custom React hooks (auth, data fetching)
│   ├── lib/              # Utilities (API client, auth helpers)
│   ├── types/            # Shared TypeScript types (from OpenAPI gen)
│   └── App.tsx           # Main app component
├── index.html            # Vite entry point
├── vite.config.ts        # Vite config
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## Auth Flow
1. User clicks "Login" → redirect to Cognito Hosted UI
2. Cognito handles sign-in → redirects back with auth code
3. Frontend exchanges code for tokens (access/ID/refresh)
4. Store tokens securely (memory or secure storage)
5. Use access token in API calls (Authorization header)
6. Refresh tokens as needed

## Key Integrations
- **Cognito Setup**:
  - User Pool with Hosted UI enabled
  - App client: public, PKCE enabled
  - Callback URLs: local dev + Amplify domain
- **API Calls**:
  - Generate typed client from `openapi/api.yaml`
  - Use a shared fetch/API wrapper + small hooks for GET/POST/PUT/DELETE
  - Handle errors, loading states
- **Routing**:
  - React Router for SPA navigation
  - Protected routes based on auth state

## Development Workflow
- `npm run dev` → local dev server (http://localhost:5173)
- `npm run build` → production build
- Push to Git → Amplify auto-deploys to staging/production

## Deployment Steps
1. Create Amplify app in AWS Console
2. Connect Git repo
3. Configure build settings (Vite SPA)
4. Set environment variables (Cognito client ID, etc.)
5. Deploy

## Pros/Cons of This Approach
- **Pros**: Fast to start, AWS-native, minimal infra overhead, great for solo dev
- **Cons**: If you later need SSR, you'll need to migrate to Next.js

## Next Steps
- Generate OpenAPI client from backend
- Set up Cognito User Pool
- Initialize Vite project with the above stack
- Wire up auth + basic CRUD page

## Resources
- [Vite React Template](https://vitejs.dev/guide/)
- [AWS Amplify Auth Docs](https://docs.amplify.aws/react/build-a-backend/auth/)
- [MUI Admin Examples](https://mui.com/material-ui/getting-started/templates/)
