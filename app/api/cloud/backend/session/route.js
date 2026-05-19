import { NextResponse } from "next/server";
import { getCloudActor } from "@/lib/cloud-backups";
import { authError } from "@/lib/auth";
import { publicBackendLink } from "@/lib/cloud-backend-auth";

export async function GET(request) {
  const actor = getCloudActor(request);
  if (!actor) {
    return authError("Sign in or use a linked backend token.", 401);
  }

  return NextResponse.json({
    actor: actor.type,
    userId: actor.userId,
    backend: publicBackendLink(actor.backendLink),
  });
}
