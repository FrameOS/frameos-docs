import { NextResponse } from "next/server";
import { authenticatePassword } from "@/lib/auth";
import { mutateDb, nowIso } from "@/lib/cloud-db";
import { badRequest, readJson } from "@/lib/http";
import { hashToken, randomId, randomToken } from "@/lib/security";

export async function POST(request) {
  const body = await readJson(request);
  const user = authenticatePassword(body.email, body.password);

  if (!user) {
    return badRequest("Invalid cloud credentials.", 401);
  }

  const token = randomToken();
  const instance = mutateDb((db) => {
    const item = {
      id: randomId("bin"),
      userId: user.id,
      name: String(body.instanceName || body.name || "FrameOS backend").trim(),
      endpoint: String(body.endpoint || "").trim(),
      tokenHash: hashToken(token),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      lastSeenAt: nowIso(),
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
      lastSeenAt: instance.lastSeenAt,
    },
  });
}
