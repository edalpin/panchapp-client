# panchapp-client

Web client for Panchapp, built with Expo SDK 57 and React Native Web.

This project is independent from [`panchapp-api`](../panchapp-api/) — separate dependencies, lockfile, and git repo.

## Prerequisites

- Node.js 22.13+
- pnpm
- A running [`panchapp-api`](../panchapp-api/) instance for login
- Google Cloud OAuth credentials (Web client)

## Setup

```bash
pnpm install
cp .env.example .env
```

Set these values in `.env`:

| Variable                           | Description                                                     |
| ---------------------------------- | --------------------------------------------------------------- |
| `EXPO_PUBLIC_GRAPHQL_URL`          | GraphQL endpoint, e.g. `http://localhost:3000/graphql`          |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Web OAuth client ID (also set as `GOOGLE_CLIENT_ID` on the API) |

### Google Cloud Console

1. Create a **Web OAuth client** — this ID is sent to the API as the Google idToken audience and used for browser sign-in.
2. Set `GOOGLE_CLIENT_ID` on `panchapp-api` to the **Web client ID**.

Configure the Web OAuth client:

- **Authorized JavaScript origins**: `http://localhost:8081` (confirm the port in the Expo terminal output if different)
- **Authorized redirect URIs**: the redirect URI from `AuthSession.makeRedirectUri()` on first run (typically `http://localhost:8081`)

### API user requirement

Login only works for users already registered in the API database. Insert a `User` row with your Google email before signing in for the first time.

### API CORS

Browser requests from `http://localhost:8081` to the GraphQL API require CORS to be enabled on [`panchapp-api`](../panchapp-api/). Configure the API to allow the web dev origin before testing login in the browser.

## Run

```bash
pnpm start
```

This opens the app in your browser. Google sign-in uses `expo-auth-session` and stores the JWT in `localStorage`.

## Auth flow

1. App reads the stored JWT from `localStorage` on launch.
2. If a token exists, it validates the session with the GraphQL `me` query.
3. Otherwise, the login screen prompts for Google sign-in.
4. The app sends the Google idToken to `loginWithGoogle`, stores the returned JWT, and navigates to home.
5. Sign out clears the local session.

GraphQL endpoint when [`panchapp-api`](../panchapp-api/) is running locally:

```
http://localhost:3000/graphql
```

## Verify login

1. Start `panchapp-api` on port 3000 with CORS enabled for `http://localhost:8081`.
2. Ensure your Google email exists in the API `User` table.
3. Fill in `.env` with GraphQL URL and Google Web client ID.
4. Run `pnpm start` and sign in with Google.
5. Confirm the home screen shows your name/email.
6. Refresh the browser — session should restore without signing in again.
7. Sign out — you should return to the login screen.
