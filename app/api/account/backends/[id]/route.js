import { NextResponse } from "next/server";
import { authError, getRequestUser } from "@/lib/auth";
import { revokeBackendLinkForUser } from "@/lib/cloud-backend-auth";

export async function DELETE(request, { params }) {
  const user = getRequestUser(request);
  if (!user) {
    return authError("Sign in to manage connected backends.", 401);
  }

  const { id } = await params;
  const backend = revokeBackendLinkForUser(user.id, id);
  if (!backend) {
    return NextResponse.json({ error: "Connected backend not found." }, { status: 404 });
  }

  return NextResponse.json({ backend });
}
