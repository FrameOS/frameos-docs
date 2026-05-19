import { NextResponse } from "next/server";
import { authError } from "@/lib/auth";
import { deleteBackupObject, getBackupObject, getCloudActor, saveBackupObject } from "@/lib/cloud-backups";
import { badRequest, readJson } from "@/lib/http";

export async function GET(request, { params }) {
  const actor = getCloudActor(request);
  if (!actor) {
    return authError("Sign in or use a linked backend token.", 401);
  }

  try {
    const { id, objectId } = await params;
    const object = getBackupObject(actor.userId, id, objectId);
    if (!object) {
      return NextResponse.json({ error: "Backup object not found." }, { status: 404 });
    }
    return NextResponse.json({ object });
  } catch (error) {
    return badRequest(error.message);
  }
}

export async function PUT(request, { params }) {
  const actor = getCloudActor(request);
  if (!actor) {
    return authError("Sign in or use a linked backend token.", 401);
  }

  try {
    const { id, objectId } = await params;
    const object = saveBackupObject(actor.userId, id, objectId, await readJson(request));
    if (!object) {
      return NextResponse.json({ error: "Backup not found." }, { status: 404 });
    }
    return NextResponse.json({ object });
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
    const { id, objectId } = await params;
    if (!deleteBackupObject(actor.userId, id, objectId)) {
      return NextResponse.json({ error: "Backup object not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return badRequest(error.message);
  }
}
