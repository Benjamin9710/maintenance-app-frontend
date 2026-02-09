import { getAccessToken } from './auth';

interface ApiFetchOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T>(url: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  if (auth) {
    const token = await getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, { ...fetchOptions, headers });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
