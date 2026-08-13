# panchapp-client

React Native client for Panchapp, built with Expo SDK 57. Targets **iOS** for production and **web** for browser-based development and testing.

This project is independent from [`panchapp-api`](../panchapp-api/) — separate dependencies, lockfile, and git repo.

## Prerequisites

- Node.js 22.13+
- pnpm
- A running [`panchapp-api`](../panchapp-api/) instance for login
- Google Cloud OAuth credentials (Web client required; iOS client required for native builds)

For iOS native development:

- Xcode + iOS Simulator (Expo SDK 57 recommends Xcode 26.4+)

Google Sign-In on iOS uses native modules and **does not work in Expo Go**. Use a development build (`pnpm ios`).

## Setup

```bash
pnpm install
cp .env.example .env
```

Set these values in `.env`:

| Variable                           | Description                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_GRAPHQL_URL`          | GraphQL endpoint, e.g. `http://localhost:3000/graphql` (auto-adjusted for Android emulator) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Web OAuth client ID (also set as `GOOGLE_CLIENT_ID` on the API)                             |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | iOS OAuth client ID for bundle ID `com.panchapp.client` (native only)                       |

On a physical device, use your machine's LAN IP instead of `localhost` for the GraphQL URL.

### Google Cloud Console

1. Create an **iOS OAuth client** with bundle ID `com.panchapp.client` (required for `pnpm ios`).
2. Create a **Web OAuth client** — this ID is sent to the API as the Google idToken audience and used for browser sign-in.
3. Set `GOOGLE_CLIENT_ID` on `panchapp-api` to the **Web client ID**.

For **web development**, configure the Web OAuth client:

- **Authorized JavaScript origins**: `http://localhost:8081` (confirm the port in the Expo terminal output if different)
- **Authorized redirect URIs**: the redirect URI from `AuthSession.makeRedirectUri()` on first run (typically `http://localhost:8081`)

The iOS URL scheme is derived automatically from `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` in [`app.config.ts`](app.config.ts) when that variable is set. Override with `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` if needed.

### API user requirement

Login only works for users already registered in the API database. Insert a `User` row with your Google email before signing in for the first time.

### API CORS (web only)

Browser requests from `http://localhost:8081` to the GraphQL API require CORS to be enabled on [`panchapp-api`](../panchapp-api/). Configure the API to allow the web dev origin before testing login in the browser.

## Run on web (recommended for testing)

```bash
pnpm web
```

This opens the app in your browser. Google sign-in uses `expo-auth-session` and stores the JWT in `localStorage`.

## Run on iOS Simulator

Build and run the native iOS project (required after changing native plugins or env):

```bash
pnpm ios
```

After changing `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, the Google Sign-In plugin, or other native config, regenerate the iOS project first:

```bash
pnpm ios:clean
```

### Troubleshooting: missing Google URL scheme

If Google sign-in fails with an error like `Your app is missing support for the following URL schemes: com.googleusercontent.apps.*`, the native `ios/` project is stale. Run `pnpm ios:clean` so Expo re-applies the Google Sign-In config plugin to `Info.plist`.

Or start Metro separately:

```bash
pnpm start
# Press `i` in the terminal to launch the iOS Simulator
# Press `w` to open in the web browser
```

## Auth flow

1. App reads the stored JWT from SecureStore (native) or `localStorage` (web) on launch.
2. If a token exists, it validates the session with the GraphQL `me` query.
3. Otherwise, the login screen prompts for Google sign-in.
4. The app sends the Google idToken to `loginWithGoogle`, stores the returned JWT, and navigates to home.
5. Sign out clears the local session and Google account selection (native only).

GraphQL endpoint when [`panchapp-api`](../panchapp-api/) is running locally:

```
http://localhost:3000/graphql
```

## Verify login

### Web

1. Start `panchapp-api` on port 3000 with CORS enabled for `http://localhost:8081`.
2. Ensure your Google email exists in the API `User` table.
3. Fill in `.env` with GraphQL URL and Google Web client ID.
4. Run `pnpm web` and sign in with Google.
5. Confirm the home screen shows your name/email.
6. Refresh the browser — session should restore without signing in again.
7. Sign out — you should return to the login screen.

### iOS

1. Start `panchapp-api` on port 3000.
2. Ensure your Google email exists in the API `User` table.
3. Fill in `.env` with GraphQL URL and Google client IDs.
4. Run `pnpm ios` and sign in with Google.
5. Confirm the home screen shows your name/email.
6. Kill and reopen the app — session should restore without signing in again.
7. Sign out — you should return to the login screen.
