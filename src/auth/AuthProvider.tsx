import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { ApolloProvider } from '@apollo/client/react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { clearAccessToken, getAccessToken, setAccessToken } from './authStorage';
import {
  GoogleSignInCancelledError,
  signInWithGoogleIdToken,
  signOutFromGoogle,
} from './googleSignIn';
import { createApolloClient } from '../graphql/client';
import {
  LOGIN_WITH_GOOGLE,
  ME,
  type LoginWithGoogleMutation,
  type LoginWithGoogleMutationVariables,
  type MeQuery,
  type User,
} from '../graphql/operations/auth';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null;
  isSigningIn: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleUnauthenticated = useCallback(async () => {
    await clearAccessToken();
    setAccessTokenState(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const apolloClient = useMemo(
    () =>
      createApolloClient({
        onUnauthenticated: () => {
          void handleUnauthenticated();
        },
      }),
    [handleUnauthenticated],
  );

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const storedToken = await getAccessToken();

      if (cancelled) {
        return;
      }

      if (!storedToken) {
        setStatus('unauthenticated');
        return;
      }

      setAccessTokenState(storedToken);

      try {
        const { data } = await apolloClient.query<MeQuery>({
          query: ME,
          fetchPolicy: 'network-only',
        });

        if (cancelled) {
          return;
        }

        if (!data?.me) {
          throw new Error('Unable to load current user.');
        }

        setUser(data.me);
        setStatus('authenticated');
      } catch {
        if (cancelled) {
          return;
        }

        await clearAccessToken();
        setAccessTokenState(null);
        setUser(null);
        setStatus('unauthenticated');
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [apolloClient]);

  const signInWithGoogle = useCallback(async () => {
    setIsSigningIn(true);

    try {
      const idToken = await signInWithGoogleIdToken();
      const { data } = await apolloClient.mutate<
        LoginWithGoogleMutation,
        LoginWithGoogleMutationVariables
      >({
        mutation: LOGIN_WITH_GOOGLE,
        variables: {
          input: { idToken },
        },
      });

      if (!data?.loginWithGoogle) {
        throw new Error('Login failed.');
      }

      const { accessToken: token, user: authenticatedUser } = data.loginWithGoogle;

      await setAccessToken(token);
      setAccessTokenState(token);
      setUser(authenticatedUser);
      setStatus('authenticated');
    } finally {
      setIsSigningIn(false);
    }
  }, [apolloClient]);

  const signOut = useCallback(async () => {
    await signOutFromGoogle();
    await clearAccessToken();
    setAccessTokenState(null);
    setUser(null);
    setStatus('unauthenticated');
    await apolloClient.clearStore();
  }, [apolloClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      accessToken,
      isSigningIn,
      signInWithGoogle,
      signOut,
    }),
    [status, user, accessToken, isSigningIn, signInWithGoogle, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

export function getAuthErrorMessage(error: unknown): string | null {
  if (error instanceof GoogleSignInCancelledError) {
    return null;
  }

  if (CombinedGraphQLErrors.is(error)) {
    const message = error.errors[0]?.message;

    if (message === 'Account not registered') {
      return 'Your account is not registered yet.';
    }

    if (message === 'Account disabled') {
      return 'Your account has been disabled.';
    }

    if (message) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
