const ACCESS_TOKEN_KEY = 'panchapp.accessToken';

let inMemoryAccessToken: string | null = null;

export function getInMemoryAccessToken(): string | null {
  return inMemoryAccessToken;
}

export async function getAccessToken(): Promise<string | null> {
  if (inMemoryAccessToken) {
    return inMemoryAccessToken;
  }

  const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  inMemoryAccessToken = storedToken;
  return storedToken;
}

export async function setAccessToken(token: string): Promise<void> {
  inMemoryAccessToken = token;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export async function clearAccessToken(): Promise<void> {
  inMemoryAccessToken = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
