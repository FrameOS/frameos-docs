import { notFound } from "next/navigation";
import { MarkdownPage } from "@/components/MarkdownPage";
import { getAllBlogPosts, getBlogPost, renderMarkdown } from "@/lib/content";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="contentLayout singleColumn">
      <MarkdownPage page={{ ...post, html: renderMarkdown(post) }} />
    </main>
  );
}
