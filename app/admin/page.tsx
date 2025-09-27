import { getAllBlogPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'Manage your blog posts',
  title: 'Blog Admin',
};

export default function AdminPage() {
  const posts = getAllBlogPosts();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Admin</h1>
      
      <div className="alert bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mb-8">
        <p className="text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> This admin page is protected by basic authentication. 
          If you're seeing this, you've successfully logged in.
        </p>
      </div>
      
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Blog Post Template</h2>
        <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded overflow-x-auto text-sm">
          {`---
title: "Your Blog Post Title"
date: "${new Date().toISOString().split('T')[0]}"
slug: "your-blog-post-slug"
description: "A brief description of your blog post (will appear in previews and meta tags)."
featured: false
showOnHomepage: true
homepageOrder: 1
---

# Your Blog Post Title

Your content goes here...

## Subheading

More content...`}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Blog Posts</h2>
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Slug</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Homepage</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Featured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/thoughts/${post.slug}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(post.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.showOnHomepage ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.homepageOrder !== undefined ? post.homepageOrder : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.featured ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Managing Blog Posts</h2>
        <p className="mb-4">
          Blog posts are stored as MDX files in the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">content/blog</code> directory.
          Each post has frontmatter metadata at the top that controls various aspects:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>title</strong>: The title of your blog post</li>
          <li><strong>date</strong>: Publication date (YYYY-MM-DD format)</li>
          <li><strong>slug</strong>: URL-friendly identifier (used in the URL path)</li>
          <li><strong>description</strong>: Brief summary for previews and SEO</li>
          <li><strong>featured</strong>: Whether this is a featured post (boolean)</li>
          <li><strong>showOnHomepage</strong>: Whether to show on the homepage (boolean)</li>
          <li><strong>homepageOrder</strong>: Order on homepage (lower numbers appear first)</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Embedding Media in Blog Posts</h2>
        <p className="mb-4">
          You can use custom MDX components to embed images and videos in your blog posts:
        </p>
        
        <h3 className="text-lg font-medium mt-6 mb-2">Images</h3>
        <p className="mb-2">
          Use the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">BlogImage</code> component:
        </p>
        <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded overflow-x-auto text-sm mb-4">
          {`<BlogImage 
  src="/static/images/blog/your-image.jpg" 
  alt="Description of the image" 
  caption="Optional caption text" 
/>`}
        </pre>
        <p className="mb-4">
          Place your images in the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">public/static/images/blog/</code> directory.
        </p>
        
        <h3 className="text-lg font-medium mt-6 mb-2">Videos</h3>
        <p className="mb-2">
          Use the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">VideoEmbed</code> component:
        </p>
        <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded overflow-x-auto text-sm mb-4">
          {`<VideoEmbed 
  src="https://www.youtube.com/watch?v=your-video-id" 
  title="Video title" 
  type="youtube" 
  caption="Optional caption text" 
/>`}
        </pre>
        <p className="mb-4">
          The <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">type</code> prop can be "youtube", "vimeo", or "mp4".
          For MP4 videos, place them in the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">public/static/videos/</code> directory
          and use a path like <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">/static/videos/your-video.mp4</code>.
        </p>

        <h3 className="text-lg font-medium mt-6 mb-2">Flow Diagrams</h3>
        <p className="mb-2">
          Use the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">FlowDiagram</code> component to create visual process flows:
        </p>
        <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded overflow-x-auto text-sm mb-4">
          {`<FlowDiagram 
  steps={[
    {
      title: "Step 1",
      description: "Description of the first step",
      color: "blue"
    },
    {
      title: "Step 2",
      description: "Description of the second step",
      color: "purple"
    },
    {
      title: "Step 3",
      description: "Description of the third step",
      color: "green"
    }
  ]}
  caption="Optional caption for the diagram"
/>`}
        </pre>
        <p className="mb-4">
          Available colors are: blue, purple, green, yellow, and red. The diagram will automatically
          create arrows between steps and adjust layout for mobile and desktop views.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Controlling Homepage Display</h2>
        <p className="mb-4">
          Only posts with <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">showOnHomepage: true</code> will appear on the homepage.
          The <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">homepageOrder</code> property controls the order (lower numbers first).
        </p>
        <p>
          The homepage will display a maximum of 8 posts. If you have more than 8 posts with 
          <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">showOnHomepage: true</code>, only the first 8 
          (based on <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">homepageOrder</code>) will be shown.
        </p>
      </div>

      <div className="flex justify-between">
        <Link href="/thoughts" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          ← Back to thoughts
        </Link>
        <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          Back to Home →
        </Link>
      </div>
    </div>
  );
} 
