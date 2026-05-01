import { NextResponse } from "next/server";
import { clearSessionCookie, deleteSession, SESSION_COOKIE } from "@/lib/auth";

export async function GET(request) {
  deleteSession(request.cookies.get(SESSION_COOKIE)?.value);
  const response = NextResponse.redirect(new URL("/", request.url));
  clearSessionCookie(response);
  return response;
}
