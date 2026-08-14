import { print } from '@apollo/client/utilities';
import { env } from '../config/env';
import { REFRESH_SESSION } from '../graphql/operations/auth';

type RefreshSessionResponse = {
  data?: {
    refreshSession?: {
      user?: {
        id: string;
      };
    };
  };
  errors?: { extensions?: { code?: string } }[];
};

async function refreshSessionRequest(): Promise<void> {
  const response = await fetch(env.graphqlUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: print(REFRESH_SESSION),
      operationName: 'RefreshSession',
    }),
  });

  if (!response.ok) {
    throw new Error('Refresh request failed.');
  }

  const payload = (await response.json()) as RefreshSessionResponse;

  if (payload.errors?.some((graphQLError) => graphQLError.extensions?.code === 'UNAUTHENTICATED')) {
    throw new Error('Refresh session rejected.');
  }

  if (!payload.data?.refreshSession?.user) {
    throw new Error('Refresh session returned no user.');
  }
}

let refreshPromise: Promise<void> | null = null;

export function refreshSessionSingleFlight(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = refreshSessionRequest().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
