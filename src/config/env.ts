export const env = {
  graphqlUrl: process.env.EXPO_PUBLIC_GRAPHQL_URL ?? '',
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
};

function assertEnv(): void {
  if (!env.graphqlUrl) {
    throw new Error('Missing required environment variable: EXPO_PUBLIC_GRAPHQL_URL');
  }

  if (!env.googleWebClientId) {
    throw new Error('Missing required environment variable: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');
  }
}

assertEnv();
