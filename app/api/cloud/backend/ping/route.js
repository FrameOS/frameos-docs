import { NextResponse } from "next/server";
import { authError, getRequestUser } from "@/lib/auth";

export async function POST(request) {
  const user = getRequestUser(request);
  if (!user) {
    return authError("Backend token is missing or invalid.");
  }

  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
}
