import { NextResponse } from "next/server";
import { authError, getRequestUser } from "@/lib/auth";
import { listBackendLinksForUser } from "@/lib/cloud-backend-auth";

export async function GET(request) {
  const user = getRequestUser(request);
  if (!user) {
    return authError("Sign in to view connected backends.", 401);
  }

  return NextResponse.json({ backends: listBackendLinksForUser(user.id) });
}
