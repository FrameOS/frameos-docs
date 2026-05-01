import { redirect } from "next/navigation";
import { TemplatesManager } from "@/components/TemplatesManager";
import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/cloud-db";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?returnTo=/templates");
  }

  const templates = readDb()
    .templates.filter((template) => template.ownerId === user.id)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));

  return (
    <main className="pageShell">
      <TemplatesManager initialTemplates={templates} />
    </main>
  );
}
