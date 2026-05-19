import { mutateDb, nowIso, publicUser, readDb } from "@/lib/cloud-db";
import { hashToken, randomId, randomToken } from "@/lib/security";

const AUTH_CODE_TTL_MS = 1000 * 60 * 10;

function expiresIn(ms) {
  return new Date(Date.now() + ms).toISOString();
}

function cleanString(value, fallback = "") {
  return String(value || "").trim() || fallback;
}

function backendLinkKey(link) {
  const backendUrl = cleanString(link?.backendUrl).toLowerCase();
  if (backendUrl) {
    return `url:${backendUrl}`;
  }
  return `name:${cleanString(link?.backendName, "FrameOS backend").toLowerCase()}`;
}

export function validateBackendRedirectUri(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export function createBackendAuthCode({ userId, backendName, backendUrl, redirectUri, state }) {
  const code = randomToken(36);
  const now = nowIso();

  mutateDb((db) => {
    const cutoff = Date.now();
    db.backendAuthCodes = (db.backendAuthCodes || []).filter((candidate) => {
      return !candidate.usedAt && new Date(candidate.expiresAt).getTime() > cutoff;
    });
    db.backendAuthCodes.push({
      id: randomId("bac"),
      userId,
      codeHash: hashToken(code),
      backendName: cleanString(backendName, "FrameOS backend"),
      backendUrl: cleanString(backendUrl),
      redirectUri,
      state: cleanString(state),
      createdAt: now,
      expiresAt: expiresIn(AUTH_CODE_TTL_MS),
      usedAt: null,
    });
  });

  return code;
}

export function exchangeBackendAuthCode({ code, backendName, backendUrl }) {
  const token = randomToken(48);
  const codeHash = hashToken(code);
  const now = nowIso();
  let result = null;

  mutateDb((db) => {
    const authCode = (db.backendAuthCodes || []).find((candidate) => candidate.codeHash === codeHash);
    if (!authCode || authCode.usedAt || new Date(authCode.expiresAt).getTime() <= Date.now()) {
      return;
    }

    authCode.usedAt = now;
    const nextBackendName = cleanString(backendName, authCode.backendName);
    const nextBackendUrl = cleanString(backendUrl, authCode.backendUrl);
    const nextKey = backendLinkKey({ backendName: nextBackendName, backendUrl: nextBackendUrl });
    let link = (db.backendLinks || []).find((candidate) => {
      return candidate.userId === authCode.userId && !candidate.revokedAt && backendLinkKey(candidate) === nextKey;
    });

    if (link) {
      link.backendName = nextBackendName;
      link.backendUrl = nextBackendUrl;
      link.tokenHash = hashToken(token);
      link.updatedAt = now;
      link.lastSeenAt = now;
    } else {
      link = {
        id: randomId("bcl"),
        userId: authCode.userId,
        backendName: nextBackendName,
        backendUrl: nextBackendUrl,
        tokenHash: hashToken(token),
        createdAt: now,
        updatedAt: now,
        lastSeenAt: now,
        revokedAt: null,
      };
      db.backendLinks = [...(db.backendLinks || []), link];
    }

    for (const candidate of db.backendLinks || []) {
      if (candidate.id !== link.id && candidate.userId === authCode.userId && !candidate.revokedAt && backendLinkKey(candidate) === nextKey) {
        candidate.revokedAt = now;
        candidate.updatedAt = now;
      }
    }
    result = {
      token,
      link,
      user: db.users.find((user) => user.id === authCode.userId) || null,
    };
  });

  return result;
}

export function findBackendLinkByToken(token) {
  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);
  return (readDb().backendLinks || []).find((link) => link.tokenHash === tokenHash && !link.revokedAt) || null;
}

export function listBackendLinksForUser(userId) {
  const links = (readDb().backendLinks || [])
    .filter((link) => link.userId === userId && !link.revokedAt)
    .sort((a, b) => String(b.lastSeenAt || b.updatedAt).localeCompare(String(a.lastSeenAt || a.updatedAt)));

  const seen = new Set();
  return links
    .filter((link) => {
      const key = backendLinkKey(link);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .map(publicBackendLink);
}

export function revokeBackendLinkForUser(userId, linkId) {
  let revoked = null;

  mutateDb((db) => {
    const link = (db.backendLinks || []).find((candidate) => candidate.userId === userId && candidate.id === linkId && !candidate.revokedAt);
    if (!link) {
      return;
    }

    const now = nowIso();
    link.revokedAt = now;
    link.updatedAt = now;
    revoked = link;
  });

  return publicBackendLink(revoked);
}

export function touchBackendLink(linkId) {
  mutateDb((db) => {
    const link = (db.backendLinks || []).find((candidate) => candidate.id === linkId);
    if (link) {
      link.lastSeenAt = nowIso();
    }
  });
}

export function publicBackendLink(link) {
  if (!link) {
    return null;
  }

  return {
    id: link.id,
    backendName: link.backendName,
    backendUrl: link.backendUrl,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
    lastSeenAt: link.lastSeenAt,
  };
}

export function backendAuthExchangeResponse(result) {
  return {
    backendToken: result.token,
    backend: publicBackendLink(result.link),
    user: publicUser(result.user),
    backupApi: {
      backups: "/api/cloud/backups",
      auth: "Bearer backendToken",
    },
  };
}
