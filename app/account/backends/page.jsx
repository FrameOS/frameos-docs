import { redirect } from "next/navigation";
import { Cloud, Server } from "lucide-react";
import { ConnectedBackendsClient } from "@/components/ConnectedBackendsClient";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Connected Backends - FrameOS Cloud",
  description: "Manage self-hosted FrameOS backends connected to your cloud account.",
};

export default async function ConnectedBackendsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?returnTo=${encodeURIComponent("/account/backends")}`);
  }

  return (
    <main className="pageShell accountShell">
      <header className="pageHeader accountHeader">
        <p className="eyebrow">My account</p>
        <h1>Connected backends</h1>
        <p>Review self-hosted FrameOS backends that can sync encrypted backups with this cloud account.</p>
        <div className="backupBadges" aria-label="Connected backend properties">
          <span>
            <Server size={15} />
            Self-hosted access
          </span>
          <span>
            <Cloud size={15} />
            Backup sync token
          </span>
        </div>
      </header>
      <ConnectedBackendsClient />
    </main>
  );
}
