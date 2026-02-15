export let apiToken: string | null = null;

export const setApiToken = (token: string | null) => {
  apiToken = token;
};
