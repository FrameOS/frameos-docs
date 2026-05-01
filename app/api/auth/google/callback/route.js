import { NextResponse } from "next/server";
import { GOOGLE_OAUTH_COOKIE, createSession, setSessionCookie, upsertGoogleUser } from "@/lib/auth";
import { clearOAuthCookie, decodeOAuthCookie, fetchGoogleProfile } from "@/lib/google-oauth";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = decodeOAuthCookie(request.cookies.get(GOOGLE_OAUTH_COOKIE)?.value);

  if (!code || !state || !storedState || state !== storedState.state) {
    return NextResponse.redirect(new URL("/login?oauth=failed", request.url));
  }

  try {
    const profile = await fetchGoogleProfile({
      request,
      code,
      codeVerifier: storedState.codeVerifier,
    });
    const user = upsertGoogleUser(profile);
    const response = NextResponse.redirect(new URL(storedState.returnTo || "/", request.url));
    setSessionCookie(response, createSession(user.id));
    clearOAuthCookie(response);
    return response;
  } catch {
    const response = NextResponse.redirect(new URL("/login?oauth=failed", request.url));
    clearOAuthCookie(response);
    return response;
  }
}
