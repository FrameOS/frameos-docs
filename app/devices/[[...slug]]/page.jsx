import { redirect } from "next/navigation";

export default async function LegacyDevicesPage({ params }) {
  const { slug = [] } = await params;
  redirect(`/docs/devices${slug.length ? `/${slug.join("/")}` : ""}`);
}
