import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { excerptFromMarkdown, getAllBlogPosts } from "@/lib/content";

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="pageShell">
      <section className="sectionHeader pageHeader">
        <div>
          <p className="eyebrow">FrameOS updates</p>
          <h1>Blog</h1>
        </div>
      </section>
      <section className="postList">
        {posts.map((post) => (
          <Link className="postRow" href={post.href} key={post.href}>
            <div>
              <span>{post.date ? new Date(post.date).toLocaleDateString() : "FrameOS"}</span>
              <h2>{post.title}</h2>
              <p>{excerptFromMarkdown(post.content)}</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        ))}
      </section>
    </main>
  );
}
