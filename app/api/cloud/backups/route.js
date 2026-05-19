import { NextResponse } from "next/server";
import { authError } from "@/lib/auth";
import { getCloudActor, listBackups, upsertBackup } from "@/lib/cloud-backups";
import { badRequest, readJson } from "@/lib/http";

export async function GET(request) {
  const actor = getCloudActor(request);
  if (!actor) {
    return authError("Sign in or use a linked backend token.", 401);
  }

  return NextResponse.json({ backups: listBackups(actor.userId) });
}

export async function POST(request) {
  const actor = getCloudActor(request);
  if (!actor) {
    return authError("Sign in or use a linked backend token.", 401);
  }

  try {
    const backup = upsertBackup(actor, await readJson(request));
    return NextResponse.json({ backup });
  } catch (error) {
    return badRequest(error.message);
  }
}
