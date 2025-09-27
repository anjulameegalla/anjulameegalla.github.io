import Image from 'next/image';
import { MDXRemoteProps } from 'next-mdx-remote/rsc';
import React from 'react';

interface BlogImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

export function BlogImage({ src, alt, width, height, caption }: BlogImageProps) {
  const [isError, setIsError] = React.useState(false);

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800" style={{ minHeight: '200px' }}>
        {isError ? (
          <div className="flex items-center justify-center h-full w-full p-4 text-center text-gray-500" style={{ minHeight: '300px' }}>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>{alt || 'Image could not be loaded'}</p>
            </div>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width || 1200}
            height={height || 630}
            className="w-full h-auto"
            quality={90}
            unoptimized={true}
            onError={() => setIsError(true)}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-quaternary">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface VideoEmbedProps {
  src: string;
  title?: string;
  type?: 'youtube' | 'vimeo' | 'mp4';
  caption?: string;
}

export function VideoEmbed({ src, title, type = 'youtube', caption }: VideoEmbedProps) {
  let embedSrc = src;
  
  // Process YouTube URLs to embed format
  if (type === 'youtube') {
    // Handle different YouTube URL formats
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = src.match(youtubeRegex);
    
    if (match && match[1]) {
      embedSrc = `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  
  // Process Vimeo URLs to embed format
  if (type === 'vimeo') {
    // Handle Vimeo URL formats
    const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|)(\d+)(?:$|\/|\?))/;
    const match = src.match(vimeoRegex);
    
    if (match && match[1]) {
      embedSrc = `https://player.vimeo.com/video/${match[1]}`;
    }
  }
  
  // Determine if this is an MP4 file based on extension or explicit type
  const isMP4 = type === 'mp4' || src.toLowerCase().endsWith('.mp4');
  
  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg aspect-video">
        {isMP4 ? (
          <video 
            controls 
            className="w-full h-auto" 
            preload="metadata"
            playsInline
            controlsList="nodownload"
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={embedSrc}
            title={title || "Embedded video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-0"
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-quaternary">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface FlowDiagramProps {
  steps: Array<{
    title: string;
    description: string;
    color: 'blue' | 'purple' | 'green' | 'yellow' | 'red';
  }>;
  caption?: string;
}

export function FlowDiagram({ steps, caption }: FlowDiagramProps) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-800 dark:text-blue-200',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-800 dark:text-purple-200',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-800 dark:text-green-200',
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      text: 'text-yellow-800 dark:text-yellow-200',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-800 dark:text-red-200',
    },
  };

  return (
    <div className="my-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className={`${colorMap[step.color].bg} p-4 rounded-lg w-full md:flex-1`}>
              <div className={`${colorMap[step.color].text} font-bold mb-2`}>{step.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{step.description}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="text-gray-500 hidden md:block">→</div>
            )}
            {index < steps.length - 1 && (
              <div className="text-gray-500 block md:hidden rotate-90 my-2">↓</div>
            )}
          </React.Fragment>
        ))}
      </div>
      {caption && (
        <div className="text-center mt-4 text-sm text-gray-500">
          {caption}
        </div>
      )}
    </div>
  );
}

// Define custom components for MDX
export const mdxComponents: MDXRemoteProps['components'] = {
  BlogImage,
  VideoEmbed,
  FlowDiagram,
  // You can add more custom components here
}; 
