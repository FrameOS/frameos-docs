import Link from 'next/link';
import type { Metadata } from 'next';
import { getSortedBlogPosts } from '@/lib/source';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News and build logs from the FrameOS project.',
};

export default function BlogIndex() {
  const posts = getSortedBlogPosts();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold">Blog</h1>
      <p className="mb-10 text-fd-muted-foreground">
        News and build logs from the FrameOS project.
      </p>
      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <Link key={post.url} href={post.url} className="group block">
            <article>
              <time className="text-sm text-fd-muted-foreground">
                {new Date(post.data.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <h2 className="mt-1 text-xl font-semibold group-hover:underline">
                {post.data.title}
              </h2>
              {post.data.description ? (
                <p className="mt-1 text-fd-muted-foreground">{post.data.description}</p>
              ) : null}
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
