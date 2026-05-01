import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BackendSetup } from "@/components/BackendSetup";
import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/cloud-db";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?returnTo=/setup");
  }

  const headerStore = await headers();
  const host = headerStore.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const cloudUrl = process.env.FRAMEOS_CLOUD_URL || `${protocol}://${host}`;
  const instances = readDb()
    .backendInstances.filter((instance) => instance.userId === user.id && !instance.revokedAt)
    .map(({ tokenHash: _tokenHash, ...instance }) => instance)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  return (
    <main className="pageShell">
      <BackendSetup cloudUrl={cloudUrl} initialInstances={instances} />
    </main>
  );
}
