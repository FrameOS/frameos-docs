"use client";

import { useMemo, useState } from "react";
import { KeyRound, LogIn, Mail, UserPlus } from "lucide-react";

export function AuthForms({ returnTo = "/", oauthStatus }) {
  const [mode, setMode] = useState("login");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const googleHref = useMemo(() => {
    return `/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`;
  }, [returnTo]);

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    setPending(false);

    if (!response.ok) {
      setError(payload.error || "Could not sign in.");
      return;
    }

    window.location.assign(returnTo);
  }

  return (
    <section className="authPanel" aria-label="FrameOS cloud login">
      <div className="segmented">
        <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>
          <LogIn size={16} />
          Sign in
        </button>
        <button className={mode === "register" ? "active" : ""} type="button" onClick={() => setMode("register")}>
          <UserPlus size={16} />
          Create account
        </button>
      </div>

      {oauthStatus === "not_configured" ? (
        <p className="notice warning">Google OAuth needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET before it can be used.</p>
      ) : null}
      {oauthStatus === "failed" ? <p className="notice warning">Google sign-in failed. Try again.</p> : null}
      {error ? <p className="notice danger">{error}</p> : null}

      <form className="stackForm" onSubmit={submit}>
        {mode === "register" ? (
          <label>
            <span>Name</span>
            <input autoComplete="name" name="name" placeholder="Ada Lovelace" />
          </label>
        ) : null}
        <label>
          <span>Email</span>
          <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
        </label>
        <label>
          <span>Password</span>
          <input autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={8} name="password" required type="password" />
        </label>
        <button className="button primary" disabled={pending} type="submit">
          <KeyRound size={17} />
          {pending ? "Working..." : mode === "register" ? "Create cloud account" : "Sign in with password"}
        </button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <a className="button secondary fullWidth" href={googleHref}>
        <Mail size={17} />
        Continue with Google
      </a>
    </section>
  );
}
