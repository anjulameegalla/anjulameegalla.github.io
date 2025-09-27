import { getAllBlogPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'Thoughts on design, development, and creative processes.',
  title: 'Thoughts',
};

export default function ThoughtsPage() {
  const posts = getAllBlogPosts();
  
  return (
    <div className="mx-auto w-full max-w-[800px] space-y-8 px-8">
      <div className="mb-8 flex justify-between items-center">
        <Link 
          className="flex items-center gap-1 text-secondary hover:text-primary transition-colors duration-150"
          href="/" 
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
          Back to home
        </Link>
      </div>
      
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Thoughts</h1>
        <p className="text-secondary">
          Thoughts on design, development, and creative processes.
        </p>
      </div>
      
      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <Link 
            className="group flex flex-col gap-2 transition-opacity duration-150 hover:opacity-70"
            href={`/thoughts/${post.slug}`}
            key={post.slug} 
          >
            <div className="flex flex-row items-start justify-between">
              <h2 className="max-w-[75%] text-xl font-medium text-secondary group-hover:text-primary transition-colors duration-150">
                {post.title}
              </h2>
              <span className="text-quaternary text-sm whitespace-nowrap">
                {formatDate(post.date)}
              </span>
            </div>
            <p className="text-tertiary">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

