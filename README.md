# panchapp-client

Web client for Panchapp, built with Expo SDK 57 and React Native Web.

This project is independent from [`panchapp-api`](../panchapp-api/) — separate dependencies, lockfile, and git repo.

## Prerequisites

- Node.js 22.13+
- pnpm 11+
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
pnpm dev
```

This opens the app in your browser. Google sign-in uses `expo-auth-session` and stores the JWT in `localStorage`.

> **PWA note:** Install-to-home-screen only works with the **production build** (`pnpm build`), not the dev server. See [Install as PWA (iPhone)](#install-as-pwa-iphone) below.

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
4. Run `pnpm dev` and sign in with Google.
5. Confirm the home screen shows your name/email.
6. Refresh the browser — session should restore without signing in again.
7. Sign out — you should return to the login screen.

## Build for production

Export a static web bundle to the `dist/` directory:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm build:preview
```

`EXPO_PUBLIC_*` variables are inlined at build time. Set production values in `.env` before running `pnpm build`.

## Install as PWA (iPhone)

Standalone mode (no Safari URL bar or bottom toolbar) only works when:

1. The app is served from the **production static build** on Railway (not `pnpm dev`).
2. You add it from **Safari** — Chrome on iPhone creates a bookmark that still opens with browser chrome.
3. You open the app from the **home screen icon**, not from a Safari tab or bookmark.

Steps after deploying:

1. Delete any existing home screen shortcut for this app.
2. Open your Railway URL in **Safari** (e.g. `https://panchapp-client-production.up.railway.app`).
3. Confirm `https://your-url/manifest.json` loads JSON (not an HTML page).
4. Tap **Share** → **Add to Home Screen**.
5. Launch from the new icon.

If browser bars still appear, verify Railway has `RAILPACK_SPA_OUTPUT_DIR=dist` set. Without it, Railway may run the Expo dev server instead of the static `dist/` folder, and PWA mode will not work.

## Deploy to Railway

Railway's default builder (Railpack) detects the `build` script, runs `pnpm build`, and serves the `dist/` folder as a static SPA.

### Client service

1. Create a new Railway service connected to this repo.
2. Railway reads [`railway.toml`](railway.toml) for the build command and health check. [`Staticfile`](Staticfile) enables SPA routing from `dist/`.
3. Set these environment variables (required at **build** time):

| Variable                           | Example                                                  |
| ---------------------------------- | -------------------------------------------------------- |
| `EXPO_PUBLIC_GRAPHQL_URL`          | `https://panchapp-api-production.up.railway.app/graphql` |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Same Web OAuth client ID used locally                    |
| `RAILPACK_SPA_OUTPUT_DIR`          | `dist`                                                   |

3. Deploy — Railway runs `pnpm build` and serves `dist/` via Caddy with SPA fallback.

### API service (panchapp-api)

Set on the API Railway service:

| Variable           | Value                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `CORS_ORIGIN`      | `https://panchapp-client-production.up.railway.app` (comma-separate if multiple origins) |
| `GOOGLE_CLIENT_ID` | Same value as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`                                         |

The browser calls the API directly, so `EXPO_PUBLIC_GRAPHQL_URL` must be the API's **public Railway URL**, not an internal hostname.

### Google Cloud OAuth (production)

In Google Cloud Console, update your **Web OAuth client**:

- **Authorized JavaScript origins**: your Railway frontend URL (e.g. `https://panchapp-client-production.up.railway.app`)
- **Authorized redirect URIs**: the same origin (with and without trailing slash)

After first deploy, confirm the exact redirect URI if sign-in fails — `AuthSession.makeRedirectUri()` resolves to the current page origin on web.
