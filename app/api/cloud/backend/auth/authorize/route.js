import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth";
import { createBackendAuthCode, validateBackendRedirectUri } from "@/lib/cloud-backend-auth";

function formString(form, key) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

function backendAuthConfirmPath({ redirectUri, state, backendName, backendUrl }) {
  const params = new URLSearchParams();
  if (redirectUri) params.set("redirect_uri", redirectUri);
  if (state) params.set("state", state);
  if (backendName) params.set("backend_name", backendName);
  if (backendUrl) params.set("backend_url", backendUrl);
  const query = params.toString();
  return `/cloud/backend/auth/confirm${query ? `?${query}` : ""}`;
}

export async function POST(request) {
  const form = await request.formData();
  const redirectUriValue = formString(form, "redirect_uri");
  const state = formString(form, "state");
  const backendName = formString(form, "backend_name");
  const backendUrl = formString(form, "backend_url");
  const returnTo = backendAuthConfirmPath({ redirectUri: redirectUriValue, state, backendName, backendUrl });
  const user = getRequestUser(request);

  if (!user) {
    return NextResponse.redirect(new URL(`/login?returnTo=${encodeURIComponent(returnTo)}`, request.url), 303);
  }

  const redirectUri = validateBackendRedirectUri(redirectUriValue);
  if (!redirectUri) {
    return NextResponse.json({ error: "redirect_uri must be an http or https URL." }, { status: 400 });
  }

  const code = createBackendAuthCode({
    userId: user.id,
    backendName,
    backendUrl,
    redirectUri: redirectUri.toString(),
    state,
  });

  redirectUri.searchParams.set("code", code);
  if (state) {
    redirectUri.searchParams.set("state", state);
  }

  return NextResponse.redirect(redirectUri, 303);
}
