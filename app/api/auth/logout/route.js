import { NextResponse } from "next/server";
import { clearSessionCookie, deleteSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  deleteSession(token);

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
