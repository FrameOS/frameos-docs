import { redirect } from "next/navigation";

export default async function LegacyCasesPage({ params }) {
  const { slug = [] } = await params;
  redirect(`/docs/cases${slug.length ? `/${slug.join("/")}` : ""}`);
}
