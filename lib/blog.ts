import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  title: string;
  date: string;
  slug: string;
  description: string;
  featured: boolean;
  showOnHomepage: boolean;
  homepageOrder?: number;
  content: string;
}

const BLOG_DIRECTORY = path.join(process.cwd(), 'content/blog');

/**
 * Get all blog posts with their metadata and content
 */
export function getAllBlogPosts(): BlogPost[] {
  // Get all files from the blog directory
  const filenames = fs.readdirSync(BLOG_DIRECTORY);
  
  // Get the content and metadata from each file
  const posts = filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => {
      // Read the file content
      const filePath = path.join(BLOG_DIRECTORY, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Parse the frontmatter
      const { data, content } = matter(fileContent);
      
      // Return the post data
      return {
        title: data.title,
        date: data.date,
        slug: data.slug,
        description: data.description,
        featured: data.featured || false,
        showOnHomepage: data.showOnHomepage || false,
        homepageOrder: data.homepageOrder,
        content,
      };
    });
  
  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get blog posts to display on the homepage
 */
export function getHomepagePosts(limit: number = 8): BlogPost[] {
  const allPosts = getAllBlogPosts();
  
  // Filter posts that should be shown on the homepage
  const homepagePosts = allPosts.filter(post => post.showOnHomepage);
  
  // Sort by homepage order if available, otherwise by date
  const sortedPosts = homepagePosts.sort((a, b) => {
    // If both posts have homepageOrder, sort by that
    if (a.homepageOrder !== undefined && b.homepageOrder !== undefined) {
      return a.homepageOrder - b.homepageOrder;
    }
    
    // If only one post has homepageOrder, prioritize it
    if (a.homepageOrder !== undefined) return -1;
    if (b.homepageOrder !== undefined) return 1;
    
    // Otherwise sort by date
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Return the specified number of posts
  return sortedPosts.slice(0, limit);
}

/**
 * Get a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const allPosts = getAllBlogPosts();
  return allPosts.find(post => post.slug === slug) || null;
}

/**
 * Get all blog post slugs for static path generation
 */
export function getAllBlogSlugs(): string[] {
  const posts = getAllBlogPosts();
  return posts.map(post => post.slug);
} 
