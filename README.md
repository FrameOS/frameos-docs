# FrameOS Cloud

This repository now runs the FrameOS docs, blog, cloud login, backend setup, and saved template manager as a Next.js app.

## Development

```bash
npm install
npm run dev
```

When direnv is enabled, `.envrc` activates the Flox environment and adds `node_modules/.bin` to `PATH`.

## Build

```bash
npm run build
npm run serve
```

## Local Cloud Data

Development data is stored in `.data/frameos-cloud.json`. The directory is ignored by git.

The local datastore supports:

- password accounts
- cookie sessions
- Google OAuth accounts
- backend instance bearer tokens
- saved scene templates

## Google OAuth

Set these variables before starting the app:

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FRAMEOS_CLOUD_URL=http://localhost:3000
```

Configure the Google OAuth redirect URI as:

```text
http://localhost:3000/api/auth/google/callback
```

Use the production domain instead of localhost for deployed environments.
