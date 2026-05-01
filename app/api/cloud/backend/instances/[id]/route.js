import { NextResponse } from "next/server";
import { authError, getRequestUser } from "@/lib/auth";
import { mutateDb, nowIso } from "@/lib/cloud-db";

export async function DELETE(request, { params }) {
  const { id } = await params;
  const user = getRequestUser(request);
  if (!user) {
    return authError();
  }

  const revoked = mutateDb((db) => {
    const instance = db.backendInstances.find((item) => item.id === id && item.userId === user.id && !item.revokedAt);
    if (!instance) {
      return false;
    }

    instance.revokedAt = nowIso();
    instance.updatedAt = nowIso();
    return true;
  });

  if (!revoked) {
    return NextResponse.json({ error: "Backend instance not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
