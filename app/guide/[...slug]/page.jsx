import { redirect } from "next/navigation";

export default async function LegacyGuidePage({ params }) {
  const { slug = [] } = await params;
  redirect(`/docs/guide/${slug.join("/")}`);
}
