"use client";

import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import TableOfContents from '@/components/TableOfContents';
import { useState } from 'react';
import { urlFor, slugify } from '@/lib/clientUtils'; // Import from clientUtils

interface PostClientPageProps {
  post: any;
}

const PostClientPage: React.FC<PostClientPageProps> = ({ post }) => {
  // Extract headings for Table of Contents
  const headings = post.body
    .filter((block: any) => ['h2', 'h3', 'h4'].includes(block.style))
    .map((block: any) => ({
      level: parseInt(block.style.replace('h', ''), 10),
      text: block.children[0]?.text || '',
      id: slugify(block.children[0]?.text || ''),
    }));

  // Extract lead text (first block)
  const leadText = post.body.length > 0 ? post.body[0] : undefined;
  const remainingBody = post.body.slice(1); // All blocks from the second one onwards

  // State for TOC visibility
  const [showToc, setShowToc] = useState(true);

  // PortableText components for custom rendering
  const components = {
    types: {
      image: ({ value }: any) => (
        <Image
          src={urlFor(value).url()}
          alt={value.alt || 'Image'}
          width={800}
          height={450}
          className="w-full h-auto rounded-lg my-4"
        />
      ),
    },
    block: {
      h2: ({ children }: any) => {
        const id = slugify(children[0]?.text || '');
        return <h2 id={id} className="text-3xl font-bold mb-3 mt-6">{children}</h2>;
      },
      h3: ({ children }: any) => {
        const id = slugify(children[0]?.text || '');
        return <h3 id={id} className="text-2xl font-bold mb-2 mt-4">{children}</h3>;
      },
      h4: ({ children }: any) => {
        const id = slugify(children[0]?.text || '');
        return <h4 id={id} className="text-xl font-bold mb-2 mt-3">{children}</h4>;
      },
      normal: ({ children }: any) => <p className="mb-4 leading-loose">{children}</p>,
    },
    marks: {
      link: ({ children, value }: any) => {
        const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
        return (
          <a href={value.href} rel={rel} className="text-orange-600 hover:underline">
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-8">
      {/* Main Content Area */}
      <div className="lg:w-3/4">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          {post.author.image && (
            <Image
              src={urlFor(post.author.image).width(30).height(30).url()}
              alt={post.author.name}
              width={30}
              height={30}
              className="rounded-full mr-2"
            />
          )}
          <span>{post.author.name}が{new Date(post.publishedAt).toLocaleDateString()}に投稿</span>
        </div>
        <div className="mb-4">
          {post.categories && post.categories.map((category: any) => (
            <span key={category.title} className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-2">
              {category.title}
            </span>
          ))}
        </div>
        {post.mainImage && (
          <Image
            src={urlFor(post.mainImage)}
            alt={post.title}
            width={800} // Provide a reasonable width
            height={450} // Provide a reasonable height
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        {leadText && (
          <div className="prose lg:prose-xl mb-8">
            <PortableText value={[leadText]} components={components} />
          </div>
        )}
        <div className="prose lg:prose-xl">
          <PortableText value={remainingBody} components={components} />
        </div>
      </div>

      {/* Sidebar Area */}
      <div className="lg:w-1/4 mt-8 lg:mt-0 p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 sticky top-20">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">サイドバー</h2>
        <div className="mb-4">
          <button
            onClick={() => setShowToc(!showToc)}
            className="mb-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors w-full"
          >
            {showToc ? '目次を隠す' : '目次を表示'}
          </button>
          {showToc && <TableOfContents headings={headings} />}
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm">ここにサイドバーのコンテンツが入ります。</p>
        <p className="text-gray-700 dark:text-gray-300 text-sm">関連情報や広告などを表示できます。</p>
      </div>
    </div>
  );
};

export default PostClientPage;
