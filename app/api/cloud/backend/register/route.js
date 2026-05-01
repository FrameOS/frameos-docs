import { NextResponse } from "next/server";
import { authError, getRequestUser } from "@/lib/auth";
import { mutateDb, nowIso } from "@/lib/cloud-db";
import { badRequest, readJson } from "@/lib/http";
import { hashToken, randomId, randomToken } from "@/lib/security";

export async function GET(request) {
  const user = getRequestUser(request);
  if (!user) {
    return authError();
  }

  const instances = mutateDb((db) =>
    db.backendInstances
      .filter((instance) => instance.userId === user.id && !instance.revokedAt)
      .map(({ tokenHash: _tokenHash, ...instance }) => instance)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
  );

  return NextResponse.json({ instances });
}

export async function POST(request) {
  const user = getRequestUser(request);
  if (!user) {
    return authError("Cloud login is required to connect a FrameOS backend instance.");
  }

  const body = await readJson(request);
  const name = String(body.name || "").trim();
  if (!name) {
    return badRequest("Backend name is required.");
  }

  const token = randomToken();
  const instance = mutateDb((db) => {
    const item = {
      id: randomId("bin"),
      userId: user.id,
      name,
      endpoint: String(body.endpoint || "").trim(),
      tokenHash: hashToken(token),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      lastSeenAt: null,
      revokedAt: null,
    };
    db.backendInstances.push(item);
    return item;
  });

  return NextResponse.json({
    token,
    instance: {
      id: instance.id,
      name: instance.name,
      endpoint: instance.endpoint,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
      lastSeenAt: instance.lastSeenAt,
    },
  });
}
