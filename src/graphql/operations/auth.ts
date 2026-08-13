import { gql } from '@apollo/client';

export type User = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthPayload = {
  accessToken: string;
  user: User;
};

export type LoginWithGoogleInput = {
  idToken: string;
};

export const LOGIN_WITH_GOOGLE = gql`
  mutation LoginWithGoogle($input: LoginWithGoogleInput!) {
    loginWithGoogle(input: $input) {
      accessToken
      user {
        id
        email
        name
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      email
      name
    }
  }
`;

export type LoginWithGoogleMutation = {
  loginWithGoogle: AuthPayload;
};

export type LoginWithGoogleMutationVariables = {
  input: LoginWithGoogleInput;
};

export type MeQuery = {
  me: User;
};
