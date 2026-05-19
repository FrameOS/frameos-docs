---
sidebar_position: 2
---

# Encrypted Cloud Backups

FrameOS Cloud can store optional backups for self-hosted FrameOS backends and frames. The backup service is designed so FrameOS Cloud only stores ciphertext. Backend records, scene data, frame state, assets, and secrets must be encrypted before upload and decrypted only in the browser.

Use this when you want a self-hosted backend to recover onto a new machine, keep multiple frames in sync, or preserve assets generated on the frame SD card.

## What gets backed up

A complete backup should include:

- backend database metadata: frames, scenes, settings, schedules, device configuration, generated access keys, deploy state, and custom assets stored in the backend database
- frame-local state: `/srv/frameos/state`, current scene state, generated files, and any runtime state the frame exposes through the backend
- frame assets: `/srv/assets`, copied fonts, generated images, downloaded provider assets, and other files referenced by scenes
- restore metadata: FrameOS version, backend export schema version, frame runtime version, and enough device information to decide whether a restore is compatible

Logs and transient build output can be skipped by default. They may be included as encrypted objects if a user explicitly exports them.

## Security model

- The frontend derives an encryption key from a passphrase with Web Crypto PBKDF2-SHA-256 and encrypts with AES-GCM.
- The passphrase, derived key, plaintext backup manifest, and decrypted assets are never sent to FrameOS Cloud.
- The cloud API rejects obvious plaintext backup fields such as `frames`, `assets`, `metadata`, `state`, and `payload` at the top level.
- Backend tokens authorize sync, but they do not give FrameOS Cloud enough material to decrypt backup contents.
- Object IDs and timestamps are visible to FrameOS Cloud. Put filenames, frame names, asset paths, and restore details inside encrypted envelopes.

## Cloud auth for self-hosted backends

During first-user setup, a self-hosted backend can offer **Authenticate via FrameOS Cloud**. The backend starts with no local user, redirects to FrameOS Cloud, and exchanges the returned one-time code for a backend sync token.

Start URL:

```text
GET https://frameos.net/api/cloud/backend/auth/start
  ?redirect_uri=http://localhost:8989/api/cloud/callback
  &state=<backend-csrf-state>
  &backend_name=<display-name>
  &backend_url=<backend-origin>
```

If the user is not signed in to FrameOS Cloud, the cloud app sends them through `/login` first. After cloud login, it redirects back to the backend:

```text
http://localhost:8989/api/cloud/callback?code=<one-time-code>&state=<backend-csrf-state>
```

The backend exchanges the code:

```http
POST /api/cloud/backend/auth/exchange
Content-Type: application/json

{
  "code": "<one-time-code>",
  "backendName": "Kitchen backend",
  "backendUrl": "http://localhost:8989"
}
```

Response:

```json
{
  "backendToken": "cloud-backend-token",
  "backend": {
    "id": "bcl_...",
    "backendName": "Kitchen backend",
    "backendUrl": "http://localhost:8989"
  },
  "user": {
    "id": "usr_...",
    "email": "owner@example.com"
  },
  "backupApi": {
    "backups": "/api/cloud/backups",
    "auth": "Bearer backendToken"
  }
}
```

The code is single-use and expires after 10 minutes. Store only the returned backend token in the self-hosted backend.

## Backup manifest API

Cloud account sessions and linked backend tokens can both use the backup API.

```http
Authorization: Bearer <backendToken>
```

List backups:

```text
GET /api/cloud/backups
```

Create or replace an encrypted manifest:

```http
POST /api/cloud/backups
Content-Type: application/json

{
  "backupId": "optional-stable-id",
  "encryptedManifest": {
    "version": 1,
    "algorithm": "AES-256-GCM",
    "kdf": "PBKDF2-SHA-256",
    "iterations": 250000,
    "encoding": "base64url",
    "salt": "...",
    "iv": "...",
    "ciphertext": "..."
  }
}
```

Fetch or delete one backup:

```text
GET /api/cloud/backups/:id
DELETE /api/cloud/backups/:id
```

The encrypted manifest should describe the backend export, frame list, encrypted object IDs, restore order, and compatibility metadata. Frame names, asset paths, scene details, and secrets belong inside this encrypted manifest.

## Encrypted object API

Large assets should be uploaded as separate encrypted objects referenced by the encrypted manifest.

```http
PUT /api/cloud/backups/:id/objects/:objectId
Content-Type: application/json

{
  "digest": "sha256:<ciphertext-digest>",
  "encryptedObject": {
    "version": 1,
    "algorithm": "AES-256-GCM",
    "encoding": "base64url",
    "iv": "...",
    "ciphertext": "..."
  }
}
```

Download or delete one object:

```text
GET /api/cloud/backups/:id/objects/:objectId
DELETE /api/cloud/backups/:id/objects/:objectId
```

Use opaque object IDs. Store the original filename, frame path, content type, plaintext size, and restore destination inside the encrypted manifest or encrypted object envelope.

## Browser restore flow

1. The frontend downloads the encrypted manifest and object list.
2. The user enters the passphrase locally.
3. The frontend decrypts the manifest in the browser.
4. The frontend asks the self-hosted backend to import metadata and stream encrypted objects.
5. The frontend decrypts objects in the browser or passes already encrypted object bytes through a local restore session where the backend never receives the cloud passphrase.

The manual `/backups` screen already exercises the browser encryption path for JSON exports. The self-hosted backend still needs export/import endpoints and frame asset collection.
