import { gql } from '@apollo/client';

export const LOGIN_WITH_GOOGLE = gql`
  mutation LoginWithGoogle($input: LoginWithGoogleInput!) {
    loginWithGoogle(input: $input) {
      user {
        id
        email
        name
      }
    }
  }
`;

export const REFRESH_SESSION = gql`
  mutation RefreshSession {
    refreshSession {
      user {
        id
        email
        name
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;
