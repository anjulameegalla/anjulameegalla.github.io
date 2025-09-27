// import ExternalLink from '@/ui/ExternalLink';
import Image from 'next/image';
import Link from 'next/link';
import { getHomepagePosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import ThemeToggle from '@/ui/ThemeToggle';
// import Link from 'next/link';

// async function getData() {
//   return {
//     props: {
//       posts: [],
//     },
//   };
// }

export default function Home() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-16 px-8">
      <Header />
      <Contact />
      <AboutMe />
      <Thoughts />
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        <div className="relative h-12 w-12">
          <Image
            alt="Logo"
            className="rounded-full"
            layout="fill"
            objectFit="contain"
            src="/static/images/logo.jpeg"
          />
          <div className="absolute -bottom-2 -right-2 rounded-full bg-white px-1 py-0.5 text-sm dark:bg-gray-900">
            👽
          </div>
        </div>
        <div className="flex flex-col">
          <h1>Rahul Chakraborty</h1>
          <p className="text-quaternary">Designer, Artist, Generalist</p>
        </div>
      </div>
      <div className="flex items-end h-12">
        <ThemeToggle />
      </div>
    </div>
  );
}

function AboutMe() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-quaternary">About me</p>
      <div className="text-secondary flex flex-col gap-4">
        <h1>I craft fun and delightful products on the internet. I have been lucky enough to design and collaborate on some of the most impactful products of our time. </h1>
        <h1>Currently, I work as a Staff Designer at <a className="underline underline-offset-2" href="https://groww.in" rel="noopener noreferrer" target="_blank">Groww</a>. I have previously worked and led key projects in Google Voice Search, Google Assistant, Android WearOS, Flipkart and Swiggy.</h1>
      </div>
    </div>
  );
}

function Thoughts() {
  // Get posts configured to show on homepage
  const posts = getHomepagePosts();
  
  return (
    <div className="flex flex-col gap-4">
      <p className="text-quaternary">Thoughts</p>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/thoughts/${post.slug}`}
            className="group flex flex-col gap-1 transition-opacity duration-150 hover:opacity-70"
          >
            <div className="flex flex-row items-start justify-between">
              <h2 className="text-secondary group-hover:text-primary transition-colors duration-150 max-w-[75%]">{post.title}</h2>
              <span className="text-quaternary text-sm whitespace-nowrap">{formatDate(post.date)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ContactLink({
  href,
  title,
  website,
  email,
}: {
  email?: string;
  href?: string;
  title: string;
  website?: string;
}) {
  return (
    <span className="block items-center gap-4">
      {website && <p className="text-quaternary">{website}</p>}
      {href && (
        <a
          className="text-secondary hover:text-primary transition-opacity duration-150"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {title}{' '}
          <svg
            className=" inline-block h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
      {email && (
        <p className="text-secondary hover:text-primary transition-opacity duration-150">
          {title}
        </p>
      )}
    </span>
  );
}

function Contact() {
  return (
    <div className="flex flex-col gap-4">
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ContactLink
          href="https://X.com/hckmstrrahul"
          title="hckmstrrahul"
          website="X"
        />
        <ContactLink
          href="https://bento.me/rcb"
          title="rcb"
          website="Bento"
        />
        <ContactLink
          href="https://www.figma.com/@hckmstrrahul"
          title="hckmstrrahul"
          website="Figma"
        />
        <ContactLink
          href="https://linkedin.com/in/hckmstrrahul"
          title="hckmstrrahul"
          website="Linkedin"
        />
        <ContactLink
          email="hi@rahulchakraborty.com"
          title="hi@rahulchakraborty.com"
          website="Email"
        />
        
      </div>
    </div>
  );
}
