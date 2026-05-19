import { NextResponse } from "next/server";
import { authError } from "@/lib/auth";
import { deleteBackup, getBackup, getCloudActor } from "@/lib/cloud-backups";
import { badRequest } from "@/lib/http";

export async function GET(request, { params }) {
  const actor = getCloudActor(request);
  if (!actor) {
    return authError("Sign in or use a linked backend token.", 401);
  }

  try {
    const { id } = await params;
    const backup = getBackup(actor.userId, id);
    if (!backup) {
      return NextResponse.json({ error: "Backup not found." }, { status: 404 });
    }
    return NextResponse.json({ backup });
  } catch (error) {
    return badRequest(error.message);
  }
}

export async function DELETE(request, { params }) {
  const actor = getCloudActor(request);
  if (!actor) {
    return authError("Sign in or use a linked backend token.", 401);
  }

  try {
    const { id } = await params;
    if (!deleteBackup(actor.userId, id)) {
      return NextResponse.json({ error: "Backup not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return badRequest(error.message);
  }
}
