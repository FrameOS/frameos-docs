import { NextResponse } from "next/server";
import { createOAuthState, googleAuthorizeUrl, googleOAuthConfigured, setOAuthCookie } from "@/lib/google-oauth";
import { safeReturnTo } from "@/lib/http";

export async function GET(request) {
  const url = new URL(request.url);
  const returnTo = safeReturnTo(url.searchParams.get("returnTo"), "/account/backends");

  if (!googleOAuthConfigured()) {
    return NextResponse.redirect(new URL(`/login?oauth=not_configured&returnTo=${encodeURIComponent(returnTo)}`, request.url));
  }

  const state = createOAuthState(returnTo);
  const response = NextResponse.redirect(googleAuthorizeUrl({ request, state }));
  setOAuthCookie(response, state);
  return response;
}
