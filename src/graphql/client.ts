import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { ErrorLink } from '@apollo/client/link/error';
import { Observable } from '@apollo/client/utilities';
import { refreshSessionSingleFlight } from '@/features/auth/lib/refreshSession';
import { env } from '@/config/env';

const AUTH_OPERATIONS_WITHOUT_REFRESH = new Set(['LoginWithGoogle', 'RefreshSession', 'Logout']);

export type CreateApolloClientOptions = {
  onSessionExpired?: () => void;
};

export function createApolloClient({ onSessionExpired }: CreateApolloClientOptions = {}) {
  const httpLink = new HttpLink({
    uri: env.graphqlUrl,
    credentials: 'include',
  });

  const errorLink = new ErrorLink(({ error, operation, forward }) => {
    if (!CombinedGraphQLErrors.is(error)) {
      return;
    }

    const isUnauthenticated = error.errors.some(
      (graphQLError) => graphQLError.extensions?.code === 'UNAUTHENTICATED',
    );

    if (!isUnauthenticated) {
      return;
    }

    const operationName = operation.operationName;

    if (operationName && AUTH_OPERATIONS_WITHOUT_REFRESH.has(operationName)) {
      return;
    }

    const context = operation.getContext();

    if (context.authRetry) {
      onSessionExpired?.();
      return;
    }

    return new Observable((observer) => {
      let innerSubscription: { unsubscribe: () => void } | undefined;

      refreshSessionSingleFlight()
        .then(() => {
          operation.setContext({ ...context, authRetry: true });
          innerSubscription = forward(operation).subscribe({
            next: (value) => observer.next(value),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });
        })
        .catch(() => {
          onSessionExpired?.();
          observer.error(error);
        });

      return () => {
        innerSubscription?.unsubscribe();
      };
    });
  });

  return new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          keyFields: ['id'],
        },
        Group: {
          keyFields: ['id'],
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });
}
