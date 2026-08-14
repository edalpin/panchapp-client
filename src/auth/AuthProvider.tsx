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
import {
  GoogleSignInCancelledError,
  hasGoogleRedirectCallback,
  signInWithGoogleIdToken,
  signOutFromGoogle,
} from './googleSignIn';
import { createApolloClient } from '../graphql/client';
import {
  LOGIN_WITH_GOOGLE,
  LOGOUT,
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
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSessionExpired = useCallback(() => {
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const apolloClient = useMemo(
    () =>
      createApolloClient({
        onSessionExpired: handleSessionExpired,
      }),
    [handleSessionExpired],
  );

  const completeGoogleLogin = useCallback(
    async (idToken: string) => {
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

      setUser(data.loginWithGoogle.user);
      setStatus('authenticated');
    },
    [apolloClient],
  );

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (hasGoogleRedirectCallback()) {
        setIsSigningIn(true);

        try {
          const idToken = await signInWithGoogleIdToken();

          if (cancelled) {
            return;
          }

          await completeGoogleLogin(idToken);
        } catch {
          if (cancelled) {
            return;
          }

          setUser(null);
          setStatus('unauthenticated');
        } finally {
          if (!cancelled) {
            setIsSigningIn(false);
          }
        }

        return;
      }

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

        setUser(null);
        setStatus('unauthenticated');
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [apolloClient, completeGoogleLogin]);

  const signInWithGoogle = useCallback(async () => {
    setIsSigningIn(true);

    try {
      const idToken = await signInWithGoogleIdToken();
      await completeGoogleLogin(idToken);
    } finally {
      setIsSigningIn(false);
    }
  }, [completeGoogleLogin]);

  const signOut = useCallback(async () => {
    try {
      await apolloClient.mutate({
        mutation: LOGOUT,
      });
    } catch {
      // Continue local cleanup even if server logout fails.
    }

    await signOutFromGoogle();
    setUser(null);
    setStatus('unauthenticated');
    await apolloClient.clearStore();
  }, [apolloClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isSigningIn,
      signInWithGoogle,
      signOut,
    }),
    [status, user, isSigningIn, signInWithGoogle, signOut],
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
