import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { setContext } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { env } from '../config/env';
import { getInMemoryAccessToken } from '../auth/authStorage';

export type CreateApolloClientOptions = {
  onUnauthenticated?: () => void;
};

export function createApolloClient({ onUnauthenticated }: CreateApolloClientOptions = {}) {
  const httpLink = new HttpLink({
    uri: env.graphqlUrl,
  });

  const authLink = setContext((_, { headers }) => {
    const token = getInMemoryAccessToken();

    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  const errorLink = new ErrorLink(({ error }) => {
    if (!CombinedGraphQLErrors.is(error)) {
      return;
    }

    const isUnauthenticated = error.errors.some(
      (graphQLError) => graphQLError.extensions?.code === 'UNAUTHENTICATED',
    );

    if (isUnauthenticated) {
      onUnauthenticated?.();
    }
  });

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        User: {
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
