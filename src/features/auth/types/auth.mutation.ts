import type { User } from './user';

export type AuthPayload = {
  user: User;
};

export type LoginWithGoogleInput = {
  idToken: string;
};

export type LoginWithGoogleMutation = {
  loginWithGoogle: AuthPayload;
};

export type LoginWithGoogleMutationVariables = {
  input: LoginWithGoogleInput;
};

export type RefreshSessionMutation = {
  refreshSession: AuthPayload;
};

export type LogoutMutation = {
  logout: boolean;
};
