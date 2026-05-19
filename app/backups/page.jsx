import { redirect } from "next/navigation";
import { Cloud, Lock } from "lucide-react";
import { CloudBackupsClient } from "@/components/CloudBackupsClient";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Encrypted Cloud Backups - FrameOS Cloud",
  description: "Browser-encrypted backups for self-hosted FrameOS backends and frames.",
};

export default async function BackupsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?returnTo=${encodeURIComponent("/backups")}`);
  }

  return (
    <main className="pageShell backupsShell">
      <header className="pageHeader backupHeader">
        <p className="eyebrow">FrameOS Cloud</p>
        <h1>Encrypted cloud backups</h1>
        <p>
          Sync self-hosted backend state and frame data as opaque encrypted envelopes. FrameOS Cloud stores the ciphertext; the passphrase and plaintext stay in this browser.
        </p>
        <div className="backupBadges" aria-label="Backup properties">
          <span>
            <Lock size={15} />
            Client-side decrypt
          </span>
          <span>
            <Cloud size={15} />
            Backend sync API
          </span>
        </div>
      </header>
      <CloudBackupsClient />
    </main>
  );
}
