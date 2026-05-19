import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2, Server, ShieldCheck, XCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { validateBackendRedirectUri } from "@/lib/cloud-backend-auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Connect Backend - FrameOS Cloud",
  description: "Confirm a self-hosted FrameOS backend connection.",
};

function param(params, key) {
  const value = params?.[key];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function backendAuthConfirmPath(params) {
  const query = new URLSearchParams();
  for (const key of ["redirect_uri", "state", "backend_name", "backend_url"]) {
    const value = param(params, key);
    if (value) {
      query.set(key, value);
    }
  }
  const queryString = query.toString();
  return `/cloud/backend/auth/confirm${queryString ? `?${queryString}` : ""}`;
}

function displayUrl(value, fallback = "Not provided") {
  const cleanValue = String(value || "").trim();
  if (!cleanValue) {
    return fallback;
  }
  try {
    return new URL(cleanValue).toString();
  } catch {
    return cleanValue;
  }
}

function safeBackendHref(value) {
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return "";
  }
  return "";
}

function deniedRedirectHref(redirectUri, state, fallback) {
  const url = new URL(redirectUri.toString());
  url.searchParams.set("error", "access_denied");
  if (state) {
    url.searchParams.set("state", state);
  }
  return url.toString() || fallback;
}

export default async function BackendAuthConfirmPage({ searchParams }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const returnTo = backendAuthConfirmPath(params);

  if (!user) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const redirectUriValue = param(params, "redirect_uri");
  const redirectUri = validateBackendRedirectUri(redirectUriValue);
  const state = param(params, "state");
  const backendName = param(params, "backend_name") || "FrameOS backend";
  const backendUrl = param(params, "backend_url");
  const cancelFallback = safeBackendHref(backendUrl) || "/account/backends";

  if (!redirectUri) {
    return (
      <main className="centerShell authorizationShell">
        <div className="loginIntro">
          <p className="eyebrow">FrameOS Cloud</p>
          <h1>Invalid backend request</h1>
          <p>The backend did not send a valid callback URL. Go back to the local backend and try connecting again.</p>
        </div>
        <section className="authPanel authorizationPanel">
          <p className="notice danger">redirect_uri must be an http or https URL.</p>
          <Link className="button secondary fullWidth" href="/account/backends">
            Connected backends
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="centerShell authorizationShell">
      <div className="loginIntro">
        <p className="eyebrow">FrameOS Cloud</p>
        <h1>Connect this backend?</h1>
        <p>
          Confirm that this self-hosted FrameOS backend may connect to your cloud account for encrypted backup sync.
        </p>
        <div className="backupBadges" aria-label="Backend authorization properties">
          <span>
            <Server size={15} />
            Self-hosted backend
          </span>
          <span>
            <ShieldCheck size={15} />
            Explicit approval
          </span>
        </div>
      </div>

      <section className="authPanel authorizationPanel" aria-label="Confirm backend connection">
        <div className="authorizationTitle">
          <CheckCircle2 size={22} />
          <div>
            <h2>{backendName}</h2>
            <p>{displayUrl(backendUrl, "No backend URL provided")}</p>
          </div>
        </div>

        <dl className="authDetailList">
          <div>
            <dt>Cloud account</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Callback</dt>
            <dd>{redirectUri.origin}</dd>
          </div>
          <div>
            <dt>Access granted</dt>
            <dd>Backend sync token for encrypted backups</dd>
          </div>
        </dl>

        <p className="notice">
          FrameOS Cloud stores encrypted backup data. Your backup encryption key and decrypted data stay on the local
          backend.
        </p>

        <form className="stackForm" method="post" action="/api/cloud/backend/auth/authorize">
          <input name="redirect_uri" type="hidden" value={redirectUri.toString()} />
          <input name="state" type="hidden" value={state} />
          <input name="backend_name" type="hidden" value={backendName} />
          <input name="backend_url" type="hidden" value={backendUrl} />
          <div className="authorizationActions">
            <button className="button primary" type="submit">
              Connect backend
              <ArrowRight size={17} />
            </button>
            <Link className="button secondary" href={deniedRedirectHref(redirectUri, state, cancelFallback)}>
              <XCircle size={17} />
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
