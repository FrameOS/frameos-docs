import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownPage } from "@/components/MarkdownPage";
import { getAllDocs, getDocBySlug, getDocsNav, renderMarkdown } from "@/lib/content";

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({
    slug: doc.slug ? doc.slug.split("/") : [],
  }));
}

export default async function DocsPage({ params }) {
  const { slug = [] } = await params;
  const page = getDocBySlug(slug);

  if (!page) {
    notFound();
  }

  const nav = getDocsNav();
  const html = renderMarkdown(page);

  return (
    <main className="contentLayout docsLayout">
      <aside className="contentNav">
        {nav.map((group) => (
          <div key={group.group}>
            <h2>{group.group}</h2>
            {group.items.map((item) => (
              <Link className={item.href === page.href ? "active" : ""} href={item.href} key={item.href}>
                {item.title}
              </Link>
            ))}
          </div>
        ))}
      </aside>
      <MarkdownPage page={{ ...page, html }} />
    </main>
  );
}
