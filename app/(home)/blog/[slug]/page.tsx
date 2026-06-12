import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { blogSource } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost(props: Props) {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <Link href="/blog" className="text-sm text-fd-muted-foreground hover:underline">
        &larr; All posts
      </Link>
      <h1 className="mt-4 text-4xl font-bold">{page.data.title}</h1>
      <p className="mt-2 text-sm text-fd-muted-foreground">
        {new Date(page.data.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        {' · '}
        {page.data.author}
      </p>
      <div className="prose mt-8 max-w-none">
        <MDX components={getMDXComponents()} />
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({ slug: page.slugs[0] }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
