import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';

export type Persona = 'manager' | 'contractor';

export function configureAmplifyForPersona(persona: Persona) {
  try {
    const config = persona === 'manager' 
      ? {
          userPoolId: import.meta.env.VITE_MANAGER_USER_POOL_ID,
          userPoolClientId: import.meta.env.VITE_MANAGER_USER_POOL_CLIENT_ID,
          oauthDomain: import.meta.env.VITE_MANAGER_OAUTH_DOMAIN,
        }
      : {
          userPoolId: import.meta.env.VITE_CONTRACTOR_USER_POOL_ID,
          userPoolClientId: import.meta.env.VITE_CONTRACTOR_USER_POOL_CLIENT_ID,
          oauthDomain: import.meta.env.VITE_CONTRACTOR_OAUTH_DOMAIN,
        };

    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: config.userPoolId,
          userPoolClientId: config.userPoolClientId,
          loginWith: {
            oauth: {
              domain: config.oauthDomain,
              scopes: ['openid', 'email', 'profile'],
              redirectSignIn: ['http://localhost:5173/'],
              redirectSignOut: ['http://localhost:5173/'],
              responseType: 'code',
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Failed to configure Amplify:', error);
  }
}

// Initialize Amplify with persona from localStorage or default to manager
const getStoredPersona = (): Persona => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('authPersona');
    return stored === 'manager' || stored === 'contractor' ? stored : 'manager';
  }
  return 'manager';
};

configureAmplifyForPersona(getStoredPersona());

export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() ?? null;
  } catch {
    return null;
  }
}
