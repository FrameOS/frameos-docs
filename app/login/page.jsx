import { AuthForms } from "@/components/AuthForms";
import { safeReturnTo } from "@/lib/http";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const returnTo = safeReturnTo(params?.returnTo, "/account/backends");

  return (
    <main className="centerShell">
      <div className="loginIntro">
        <p className="eyebrow">Cloud account</p>
        <h1>Sign in to FrameOS Cloud</h1>
        <p>Use password login or Google OAuth for your FrameOS account.</p>
      </div>
      <AuthForms oauthStatus={params?.oauth} returnTo={returnTo} />
    </main>
  );
}
