import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { mutateDb, publicUser, readDb, nowIso } from "@/lib/cloud-db";
import { hashPassword, hashToken, randomId, randomToken, verifyPassword } from "@/lib/security";

export const SESSION_COOKIE = "frameos_session";
export const GOOGLE_OAUTH_COOKIE = "frameos_google_oauth";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function createUserWithPassword({ name, email, password }) {
  const cleanEmail = normalizeEmail(email);
  const cleanName = String(name || "").trim() || cleanEmail.split("@")[0];

  return mutateDb((db) => {
    if (db.users.some((user) => user.email === cleanEmail)) {
      throw new Error("An account already exists for this email.");
    }

    const user = {
      id: randomId("usr"),
      email: cleanEmail,
      name: cleanName,
      image: null,
      passwordHash: hashPassword(password),
      providers: ["password"],
      googleSub: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    db.users.push(user);
    return user;
  });
}

export function findUserByEmail(email) {
  const cleanEmail = normalizeEmail(email);
  return readDb().users.find((user) => user.email === cleanEmail) || null;
}

export function authenticatePassword(email, password) {
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }
  return user;
}

export function upsertGoogleUser(profile) {
  const cleanEmail = normalizeEmail(profile.email);

  return mutateDb((db) => {
    let user = db.users.find((candidate) => candidate.googleSub === profile.sub);
    if (!user && cleanEmail) {
      user = db.users.find((candidate) => candidate.email === cleanEmail);
    }

    if (user) {
      user.email = cleanEmail || user.email;
      user.name = profile.name || user.name;
      user.image = profile.picture || user.image || null;
      user.googleSub = profile.sub;
      user.providers = Array.from(new Set([...(user.providers || []), "google"]));
      user.updatedAt = nowIso();
      return user;
    }

    user = {
      id: randomId("usr"),
      email: cleanEmail,
      name: profile.name || cleanEmail.split("@")[0],
      image: profile.picture || null,
      passwordHash: null,
      providers: ["google"],
      googleSub: profile.sub,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    db.users.push(user);
    return user;
  });
}

export function createSession(userId) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  mutateDb((db) => {
    db.sessions = db.sessions.filter((session) => new Date(session.expiresAt).getTime() > Date.now());
    db.sessions.push({
      id: randomId("ses"),
      userId,
      tokenHash: hashToken(token),
      createdAt: nowIso(),
      expiresAt,
    });
  });

  return { token, expiresAt };
}

export function getUserBySessionToken(token) {
  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);
  const db = readDb();
  const session = db.sessions.find((candidate) => candidate.tokenHash === tokenHash);

  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
    return null;
  }

  return db.users.find((user) => user.id === session.userId) || null;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  return publicUser(getUserBySessionToken(cookieStore.get(SESSION_COOKIE)?.value));
}

export function getRequestUser(request) {
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  return getUserBySessionToken(sessionToken);
}

export function setSessionCookie(response, session) {
  response.cookies.set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt),
  });
}

export function clearSessionCookie(response) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export function jsonWithSession(user) {
  const response = NextResponse.json({ user: publicUser(user) });
  setSessionCookie(response, createSession(user.id));
  return response;
}

export function deleteSession(token) {
  if (!token) {
    return;
  }

  const tokenHash = hashToken(token);
  mutateDb((db) => {
    db.sessions = db.sessions.filter((session) => session.tokenHash !== tokenHash);
  });
}

export function authError(message = "Sign in to continue.", status = 401) {
  return NextResponse.json(
    {
      error: message,
      loginUrl: "/login",
    },
    { status },
  );
}
