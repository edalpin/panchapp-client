import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { env } from '../config/env';

let configured = false;

export class GoogleSignInCancelledError extends Error {
  constructor() {
    super('Google sign-in was cancelled');
    this.name = 'GoogleSignInCancelledError';
  }
}

export function hasGoogleRedirectCallback(): boolean {
  return false;
}

export function configureGoogleSignIn(): void {
  if (configured) {
    return;
  }

  GoogleSignin.configure({
    webClientId: env.googleWebClientId,
    iosClientId: env.googleIosClientId,
  });

  configured = true;
}

export async function signInWithGoogleIdToken(): Promise<string> {
  configureGoogleSignIn();

  try {
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;

    if (!idToken) {
      throw new Error('Google sign-in did not return an ID token.');
    }

    return idToken;
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new GoogleSignInCancelledError();
    }

    throw error;
  }
}

export async function signOutFromGoogle(): Promise<void> {
  configureGoogleSignIn();

  try {
    await GoogleSignin.signOut();
  } catch {
    // Best effort — local session is cleared regardless.
  }
}
