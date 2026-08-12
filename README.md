# panchapp-client

iOS-only React Native client for Panchapp, built with Expo SDK 57.

This project is independent from [`panchapp-api`](../panchapp-api/) — separate dependencies, lockfile, and git repo.

## Prerequisites

- Node.js 22.13+
- pnpm
- Xcode + iOS Simulator (Expo SDK 57 recommends Xcode 26.4+)

## Setup

```bash
pnpm install
```

## Run on iOS Simulator

Start Metro and open the simulator:

```bash
pnpm start
# Press `i` in the terminal to launch the iOS Simulator
```

Or build and run the native iOS project locally:

```bash
pnpm ios
```

This generates the `ios/` folder via Expo prebuild and compiles the app.

## API (future)

When [`panchapp-api`](../panchapp-api/) is running locally, the GraphQL endpoint is:

```
http://localhost:3000/graphql
```

On a physical device, use your machine's LAN IP instead of `localhost`.
