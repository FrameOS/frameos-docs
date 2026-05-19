import fs from "fs";
import path from "path";
import { authError, getRequestUser } from "@/lib/auth";
import { findBackendLinkByToken, touchBackendLink } from "@/lib/cloud-backend-auth";
import { DATA_DIR, mutateDb, nowIso, readDb } from "@/lib/cloud-db";
import { randomId } from "@/lib/security";

const BACKUP_OBJECTS_DIR = path.join(DATA_DIR, "backup-objects");
const SAFE_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,159}$/;
const FORBIDDEN_PLAINTEXT_KEYS = new Set(["asset", "assets", "frame", "frames", "manifest", "metadata", "payload", "plaintext", "state"]);

function ensureObjectDir(userId, backupId) {
  const dir = path.join(BACKUP_OBJECTS_DIR, userId, backupId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function objectPath(userId, backupId, objectId) {
  assertSafeId(backupId, "backup id");
  assertSafeId(objectId, "object id");
  return path.join(ensureObjectDir(userId, backupId), `${objectId}.json`);
}

function removeBackupObjects(userId, backupId) {
  assertSafeId(backupId, "backup id");
  const dir = path.join(BACKUP_OBJECTS_DIR, userId, backupId);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export function assertSafeId(value, label = "id") {
  if (!SAFE_ID_RE.test(String(value || ""))) {
    throw new Error(`Invalid ${label}.`);
  }
}

export function assertEncryptedEnvelope(envelope, label = "encrypted payload") {
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
    throw new Error(`${label} must be an object.`);
  }

  const algorithm = String(envelope.algorithm || "");
  if (!algorithm.toUpperCase().includes("AES") || !algorithm.toUpperCase().includes("GCM")) {
    throw new Error(`${label} must use AES-GCM.`);
  }

  if (typeof envelope.iv !== "string" || envelope.iv.length < 12) {
    throw new Error(`${label} must include an iv.`);
  }

  if (typeof envelope.ciphertext !== "string" || envelope.ciphertext.length < 16) {
    throw new Error(`${label} must include ciphertext.`);
  }

  return JSON.parse(JSON.stringify(envelope));
}

export function rejectPlaintextBackupKeys(body) {
  for (const key of Object.keys(body || {})) {
    if (FORBIDDEN_PLAINTEXT_KEYS.has(key.toLowerCase())) {
      throw new Error(`Send ${key} inside an encrypted envelope, not as plaintext.`);
    }
  }
}

export function getCloudActor(request) {
  const user = getRequestUser(request);
  if (user) {
    return { type: "user", userId: user.id, user, backendLink: null };
  }

  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : "";
  const backendLink = findBackendLinkByToken(token);
  if (!backendLink) {
    return null;
  }

  touchBackendLink(backendLink.id);
  return { type: "backend", userId: backendLink.userId, user: null, backendLink };
}

export function requireCloudActor(request) {
  const actor = getCloudActor(request);
  return actor || authError("Sign in or use a linked backend token.", 401);
}

function publicBackup(backup, includeManifest = false) {
  const result = {
    id: backup.id,
    schemaVersion: backup.schemaVersion,
    createdAt: backup.createdAt,
    updatedAt: backup.updatedAt,
    createdBy: backup.createdBy,
    objectCount: (backup.objects || []).length,
    objects: backup.objects || [],
  };

  if (includeManifest) {
    result.encryptedManifest = backup.encryptedManifest;
  }

  return result;
}

export function listBackups(userId) {
  return (readDb().backups || [])
    .filter((backup) => backup.userId === userId)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .map((backup) => publicBackup(backup));
}

export function getBackup(userId, backupId) {
  assertSafeId(backupId, "backup id");
  const backup = (readDb().backups || []).find((candidate) => candidate.userId === userId && candidate.id === backupId);
  return backup ? publicBackup(backup, true) : null;
}

export function upsertBackup(actor, body) {
  rejectPlaintextBackupKeys(body);
  const encryptedManifest = assertEncryptedEnvelope(body.encryptedManifest, "encryptedManifest");
  const requestedId = body.backupId ? String(body.backupId) : randomId("bak");
  assertSafeId(requestedId, "backup id");

  let saved = null;
  mutateDb((db) => {
    db.backups = db.backups || [];
    const existing = db.backups.find((candidate) => candidate.userId === actor.userId && candidate.id === requestedId);
    const now = nowIso();
    const next = {
      ...(existing || {}),
      id: requestedId,
      userId: actor.userId,
      schemaVersion: "frameos.cloud.backup.v1",
      encryptedManifest,
      createdBy: actor.backendLink ? { type: "backend", id: actor.backendLink.id } : { type: "frontend" },
      objects: existing?.objects || [],
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    if (existing) {
      Object.assign(existing, next);
      saved = existing;
    } else {
      db.backups.push(next);
      saved = next;
    }
  });

  return publicBackup(saved, true);
}

export function deleteBackup(userId, backupId) {
  assertSafeId(backupId, "backup id");
  let deleted = false;
  mutateDb((db) => {
    const before = (db.backups || []).length;
    db.backups = (db.backups || []).filter((backup) => backup.userId !== userId || backup.id !== backupId);
    deleted = db.backups.length !== before;
  });

  if (deleted) {
    removeBackupObjects(userId, backupId);
  }

  return deleted;
}

export function saveBackupObject(userId, backupId, objectId, body) {
  rejectPlaintextBackupKeys(body);
  const encryptedObject = assertEncryptedEnvelope(body.encryptedObject, "encryptedObject");
  assertSafeId(backupId, "backup id");
  assertSafeId(objectId, "object id");

  const objectRecord = {
    id: objectId,
    ciphertextBytes: encryptedObject.ciphertext.length,
    digest: typeof body.digest === "string" ? body.digest : null,
    updatedAt: nowIso(),
  };

  let saved = false;
  mutateDb((db) => {
    const backup = (db.backups || []).find((candidate) => candidate.userId === userId && candidate.id === backupId);
    if (!backup) {
      return;
    }

    const objects = backup.objects || [];
    const existing = objects.find((candidate) => candidate.id === objectId);
    if (existing) {
      Object.assign(existing, objectRecord);
    } else {
      objects.push(objectRecord);
    }
    backup.objects = objects;
    backup.updatedAt = nowIso();
    saved = true;
  });

  if (!saved) {
    return null;
  }

  fs.writeFileSync(objectPath(userId, backupId, objectId), JSON.stringify({ encryptedObject }, null, 2));
  return objectRecord;
}

export function getBackupObject(userId, backupId, objectId) {
  const backup = getBackup(userId, backupId);
  if (!backup) {
    return null;
  }

  const record = (backup.objects || []).find((candidate) => candidate.id === objectId);
  if (!record) {
    return null;
  }

  const file = objectPath(userId, backupId, objectId);
  if (!fs.existsSync(file)) {
    return null;
  }

  return {
    ...record,
    encryptedObject: JSON.parse(fs.readFileSync(file, "utf8")).encryptedObject,
  };
}

export function deleteBackupObject(userId, backupId, objectId) {
  assertSafeId(backupId, "backup id");
  assertSafeId(objectId, "object id");
  let deleted = false;

  mutateDb((db) => {
    const backup = (db.backups || []).find((candidate) => candidate.userId === userId && candidate.id === backupId);
    if (!backup) {
      return;
    }
    const before = (backup.objects || []).length;
    backup.objects = (backup.objects || []).filter((object) => object.id !== objectId);
    backup.updatedAt = nowIso();
    deleted = backup.objects.length !== before;
  });

  const file = objectPath(userId, backupId, objectId);
  if (fs.existsSync(file)) {
    fs.rmSync(file, { force: true });
  }

  return deleted;
}
