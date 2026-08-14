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

### API CORS and cookies

Browser requests from `http://localhost:8081` to the GraphQL API require CORS to be enabled on [`panchapp-api`](../panchapp-api/). Configure the API to allow the web dev origin before testing login in the browser.

The client sends credentialed requests (`credentials: 'include'`), so the API must also allow credentials for that origin. Cookie attributes (`Secure`, `HttpOnly`, `SameSite`, domain, path) and any CSRF policy are owned by the API and must match your client/API origin topology in each environment.

**Production (iOS PWA):** the PWA must call GraphQL on the **same origin** as the client (`/graphql` via Caddy reverse proxy). Cross-origin cookies to a separate API subdomain are blocked by iOS Safari and standalone PWAs. See [Deploy to Railway](#deploy-to-railway).

## Run

```bash
pnpm dev
```

This opens the app in your browser. Google sign-in uses `expo-auth-session`, and the API establishes an HttpOnly cookie session.

> **PWA note:** Install-to-home-screen only works with the **production build** (`pnpm build`), not the dev server. See [Install as PWA (iPhone)](#install-as-pwa-iphone) below.

## Auth flow

1. App bootstraps by calling the GraphQL `me` query with browser cookies.
2. If the access cookie is missing or expired, the client calls `refreshSession` once and retries the original request.
3. If no valid session exists, the login screen prompts for Google sign-in.
4. The app sends the Google idToken to `loginWithGoogle`; the API sets session cookies and returns the current user.
5. Sign out calls the GraphQL `logout` mutation to revoke the server session, then clears local app state.

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
7. Sign out — you should return to the login screen and subsequent requests should require login again.
8. Confirm GraphQL requests include cookies, do not send an `Authorization` header, and the app never reads or writes auth tokens in `localStorage`.

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

Production URLs:

| Service      | Public URL                                       |
| ------------ | ------------------------------------------------ |
| Client (PWA) | `https://client-production-536a.up.railway.app`  |
| API          | `https://panchapp-api-production.up.railway.app` |

The PWA calls **`/graphql` on the client origin** (same-origin). [`Caddyfile`](Caddyfile) proxies that path to the API over [Railway private networking](https://docs.railway.com/networking/private-networking). HttpOnly session cookies are stored for the client hostname — required for iOS Safari and home-screen PWAs.

Railway's default builder (Railpack) detects the `build` script, runs `pnpm build`, and serves the `dist/` folder via the custom Caddyfile.

### Client service

1. Create a Railway service connected to this repo.
2. Railway reads [`railway.toml`](railway.toml) for the build command and health check. [`Staticfile`](Staticfile) and [`Caddyfile`](Caddyfile) configure SPA routing and the `/graphql` proxy.
3. Set these environment variables:

| Variable                           | When             | Example                                                                |
| ---------------------------------- | ---------------- | ---------------------------------------------------------------------- |
| `EXPO_PUBLIC_GRAPHQL_URL`          | **Build** time   | `/graphql`                                                             |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | **Build** time   | Same Web OAuth client ID used locally                                  |
| `RAILPACK_SPA_OUTPUT_DIR`          | Deploy           | `dist`                                                                 |
| `API_PRIVATE_HOST`                 | Deploy (runtime) | `${{panchapp-api.RAILWAY_PRIVATE_DOMAIN}}` — use your API service name |
| `API_PORT`                         | Deploy (runtime) | `3000`                                                                 |

4. Deploy — Railway runs `pnpm build` and serves `dist/` with Caddy. GraphQL requests go to `https://client-production-536a.up.railway.app/graphql`.

### API service (panchapp-api)

Set on the API Railway service (after the client proxy is live):

| Variable           | Value                                            |
| ------------------ | ------------------------------------------------ |
| `CORS_ORIGIN`      | `https://client-production-536a.up.railway.app`  |
| `COOKIE_SAME_SITE` | `lax`                                            |
| `COOKIE_SECURE`    | `true`                                           |
| `TRUST_PROXY`      | `true`                                           |
| `GOOGLE_CLIENT_ID` | Same value as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` |

Do **not** use `COOKIE_SAME_SITE=none` in proxied production — cookies are first-party via the client origin. Local dev still uses cross-origin (`localhost:8081` → `localhost:3000`) and needs `COOKIE_SAME_SITE=none` on the API.

The API public URL remains available for admin and health checks; the PWA no longer calls it directly for GraphQL.

### Google Cloud OAuth (production)

In Google Cloud Console, update your **Web OAuth client**:

- **Authorized JavaScript origins**: your Railway frontend URL (e.g. `https://panchapp-client-production.up.railway.app`)
- **Authorized redirect URIs**: the same origin (with and without trailing slash)

After first deploy, confirm the exact redirect URI if sign-in fails — `AuthSession.makeRedirectUri()` resolves to the current page origin on web.

## Verify production auth (iPhone PWA)

After deploying the client proxy and updating API env vars:

1. Delete any existing home-screen shortcut.
2. Open `https://client-production-536a.up.railway.app` in **Safari** and add to home screen.
3. Launch from the home-screen icon and sign in with Google.
4. Confirm the home screen shows your name/email and does **not** redirect back to login.
5. Refresh the PWA — session should persist.

With Safari Web Inspector (Mac → Develop → iPhone → PWA):

1. On `loginWithGoogle`: `Set-Cookie` for `panchapp_access_token` / `panchapp_refresh_token` scoped to **client-production-536a.up.railway.app** (not the API domain).
2. On the next `me` request to `/graphql`: confirm a `Cookie` header is sent.
3. Safari tab and home-screen PWA should behave the same.
