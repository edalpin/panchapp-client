import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { env } from '../config/env';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
};

const AUTH_STATE_KEY = 'panchapp.google_auth_state';

export class GoogleSignInCancelledError extends Error {
  constructor() {
    super('Google sign-in was cancelled');
    this.name = 'GoogleSignInCancelledError';
  }
}

function parseHashParams(hash: string): Record<string, string> {
  if (!hash || hash === '#') {
    return {};
  }

  return Object.fromEntries(new URLSearchParams(hash.replace(/^#/, '')));
}

function clearAuthParamsFromUrl(): void {
  const url = new URL(window.location.href);
  url.hash = '';
  window.history.replaceState({}, document.title, url.pathname + url.search);
}

export function hasGoogleRedirectCallback(): boolean {
  const params = parseHashParams(window.location.hash);
  return Boolean(params.id_token || params.error);
}

export function configureGoogleSignIn(): void {
  // Web auth is initialized per sign-in request via expo-auth-session.
}

export async function signInWithGoogleIdToken(): Promise<string> {
  const params = parseHashParams(window.location.hash);

  if (params.id_token || params.error) {
    const expectedState = sessionStorage.getItem(AUTH_STATE_KEY);
    sessionStorage.removeItem(AUTH_STATE_KEY);
    clearAuthParamsFromUrl();

    if (params.error) {
      if (params.error === 'access_denied') {
        throw new GoogleSignInCancelledError();
      }

      throw new Error(params.error_description ?? params.error);
    }

    if (expectedState && params.state !== expectedState) {
      throw new Error('Google sign-in state mismatch.');
    }

    if (!params.id_token) {
      throw new Error('Google sign-in did not return an ID token.');
    }

    return params.id_token;
  }

  const redirectUri = AuthSession.makeRedirectUri();
  const nonce = Crypto.randomUUID();

  const request = new AuthSession.AuthRequest({
    clientId: env.googleWebClientId,
    scopes: ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.IdToken,
    redirectUri,
    extraParams: { nonce },
    // Google rejects PKCE params with the implicit id_token flow.
    usePKCE: false,
  });

  sessionStorage.setItem(AUTH_STATE_KEY, request.state);

  const authUrl = await request.makeAuthUrlAsync(discovery);
  window.location.assign(authUrl);

  // The page navigates away; keep the caller pending until reload completes.
  return new Promise(() => {});
}

export async function signOutFromGoogle(): Promise<void> {
  // Local session is cleared by AuthProvider; no Google SDK session on web.
}
