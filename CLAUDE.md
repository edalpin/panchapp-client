# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Project structure

Expo SDK 57, React Native Web, Apollo Client, cookie-based auth via `panchapp-api`.

```text
panchapp-client/
├── app/                    # Expo Router routes (thin re-exports only)
│   ├── _layout.tsx         # Root layout: providers, auth bootstrap
│   ├── index.tsx           # Auth gate → redirect to (app) or (auth)
│   ├── (auth)/             # Unauthenticated routes (login)
│   └── (app)/              # Authenticated routes (home, groups)
├── src/
│   ├── features/           # Feature modules (primary code lives here)
│   │   ├── auth/
│   │   │   ├── api/        # GraphQL queries & mutations (gql strings)
│   │   │   ├── components/
│   │   │   ├── constants/
│   │   │   ├── context/    # AuthProvider, useAuth
│   │   │   ├── lib/        # Side-effect helpers (googleSignIn, refreshSession)
│   │   │   ├── screens/
│   │   │   └── types/
│   │   ├── groups/
│   │   └── home/
│   ├── components/         # Shared UI (ScreenContainer, AnimatedEntrance, …)
│   ├── config/             # env.ts (EXPO_PUBLIC_* vars)
│   ├── graphql/            # Apollo client setup (client.ts)
│   └── theme/              # colors and shared styling tokens
├── assets/                 # App icons, logos bundled by Expo
├── public/                 # Static web assets (PWA manifest, icons)
└── [root configs]          # app.config.ts, Caddyfile, railway.toml, etc.
```

### Conventions

- **Routing**: `app/` files stay thin — they re-export screen components from `src/features/*/screens/` (example: `app/(app)/home.tsx` → `HomeScreen`)
- **Features**: Each domain gets its own folder under `src/features/` with `api/`, `components/`, `screens/`, `types/`; auth additionally uses `context/`, `lib/`, `constants/`
- **GraphQL**: Operation strings live in `src/features/*/api/*.query.ts` and `*.mutation.ts`; the shared Apollo client is in `src/graphql/client.ts`
- **Shared code**: Cross-feature UI goes in `src/components/`; env vars in `src/config/env.ts`; theme in `src/theme/`
- **Imports**: Use `@/` alias for anything under `src/` (e.g. `@/features/auth/context/AuthProvider`, `@/theme/colors`)
