import { getBlogPostBySlug, getAllBlogSlugs } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/lib/mdx-components';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    description: post.description,
    title: post.title,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[800px] px-8">
      {/* Back button */}
      <div className="mb-12">
        <Link 
          className="flex items-center gap-1 text-secondary hover:text-primary transition-colors duration-150"
          href="/thoughts" 
        >
          <svg 
            className="h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
            />
          </svg>
          Back to thoughts
        </Link>
      </div>

      {/* Title and date */}
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <time className="text-quaternary whitespace-nowrap">{formatDate(post.date)}</time>
        </header>
        
        {/* Blog content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote components={mdxComponents} source={post.content} />
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
} 
