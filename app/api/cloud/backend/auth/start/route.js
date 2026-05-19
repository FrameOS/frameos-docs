import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth";
import { validateBackendRedirectUri } from "@/lib/cloud-backend-auth";

function backendAuthConfirmUrl(url) {
  const confirmUrl = new URL("/cloud/backend/auth/confirm", url);
  for (const key of ["redirect_uri", "state", "backend_name", "backend_url"]) {
    const value = url.searchParams.get(key);
    if (value) {
      confirmUrl.searchParams.set(key, value);
    }
  }
  return confirmUrl;
}

export async function GET(request) {
  const url = new URL(request.url);
  const user = getRequestUser(request);
  const returnTo = `${url.pathname}${url.search}`;

  if (!user) {
    return NextResponse.redirect(new URL(`/login?returnTo=${encodeURIComponent(returnTo)}`, request.url));
  }

  const redirectUri = validateBackendRedirectUri(url.searchParams.get("redirect_uri"));
  if (!redirectUri) {
    return NextResponse.json({ error: "redirect_uri must be an http or https URL." }, { status: 400 });
  }

  return NextResponse.redirect(backendAuthConfirmUrl(url));
}
