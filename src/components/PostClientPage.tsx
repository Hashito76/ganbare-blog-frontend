"use client";

import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import { useState } from 'react';
import { urlFor, slugify } from '@/lib/clientUtils';
import { client, previewClient } from '@/lib/sanity.client';
import { Post } from '@/types';
import type { Block, Span, Image as SanityImage } from 'sanity';
import type { PortableTextComponents } from '@portabletext/react';
import React from 'react';

interface PostClientPageProps {
  post: Post;
  isDraftMode: boolean;
}

const extractText = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  if (children && typeof children === 'object' && 'props' in children && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
};

const PostClientPage: React.FC<PostClientPageProps> = ({ post, isDraftMode }) => {
  const currentClient = isDraftMode ? previewClient : client;

  const headings = post.body
    ? post.body
        .filter((block): block is Block & { style: 'h2' | 'h3' | 'h4' } => 
          typeof block.style === 'string' && ['h2', 'h3', 'h4'].includes(block.style)
        )
        .map((block) => ({
          level: parseInt(block.style.replace('h', ''), 10),
          text: block.children && (block.children[0] as Span).text || '',
          id: slugify(block.children ? block.children.map((child) => (child as Span).text).join('') : ''),
        }))
    : [];

  const leadText = post.body && post.body.length > 0 ? post.body[0] : undefined;
  const remainingBody = post.body ? post.body.slice(1) : [];

  const [showToc, setShowToc] = useState(true);

  const components: Partial<PortableTextComponents> = {
    types: {
      image: ({ value }: { value: SanityImage & { alt?: string } }) => (
        <Image
          src={urlFor(value, currentClient).url()}
          alt={value.alt || 'Image'}
          width={800}
          height={450}
          className="w-full h-auto rounded-lg my-4"
        />
      ),
    },
    block: {
      h2: ({ children }) => {
        const id = slugify(extractText(children));
        return <h2 id={id} className="text-3xl font-bold mb-3 mt-6">{children}</h2>;
      },
      h3: ({ children }) => {
        const id = slugify(extractText(children));
        return <h3 id={id} className="text-2xl font-bold mb-2 mt-4">{children}</h3>;
      },
      h4: ({ children }) => {
        const id = slugify(extractText(children));
        return <h4 id={id} className="text-xl font-bold mb-2 mt-3">{children}</h4>;
      },
      normal: ({ children }) => <p className="mb-4 leading-loose">{children}</p>,
    },
    marks: {
      link: ({ children, value }: { children?: React.ReactNode, value?: { href: string } }) => {
        const rel = value?.href && !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
        return (
          <a href={value?.href} rel={rel} className="text-orange-600 hover:underline">
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      {/* Main Content Area */}
      <div className="lg:col-span-4">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          {post.author.image && (
            <Image
              src={urlFor(post.author.image, currentClient).width(30).height(30).url()}
              alt={post.author.name}
              width={30}
              height={30}
              className="rounded-full mr-2"
            />
          )}
          <span>{post.author.name}が{new Date(post.publishedAt).toLocaleDateString()}に投稿</span>
        </div>
        <div className="mb-4">
          {post.categories && post.categories.map((category) => (
            <span key={category.title} className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-2">
              {category.title}
            </span>
          ))}
        </div>
        {post.mainImage && (
          <div>
            <Image
              src={urlFor(post.mainImage, currentClient).url()}
              alt={post.title}
              width={800}
              height={450}
              className="w-full h-64 object-cover rounded-lg mb-2"
            />
            <p className="text-sm text-gray-500 text-center mb-4">記事内に商品プロモーションを含む場合があります</p>
          </div>
        )}
        {leadText && (
          <div className="prose lg:prose-xl mb-8">
            <PortableText value={[leadText]} components={components} />
          </div>
        )}

        {/* Table of Contents in Main Content */}
        <div className="mb-4 w-3/4 mx-auto">
          {post.tableOfContentsIntro && (
            <div className="prose lg:prose-xl mb-2">
              <PortableText value={post.tableOfContentsIntro} components={components} />
            </div>
          )}
          <button
            onClick={() => setShowToc(!showToc)}
            className="mb-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors w-full text-sm"
          >
            {showToc ? '目次を隠す' : '目次を表示'}
          </button>
          {showToc && <TableOfContents headings={headings} />}
        </div>

        <div className="prose lg:prose-xl">
          {remainingBody && remainingBody.length > 0 && <PortableText value={remainingBody} components={components} />}
        </div>
      </div>

      {/* Sidebar Area */}
      <div className="lg:col-span-2 h-full p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
        <div className="sticky top-20">
          {isDraftMode && (
            <Link href={`/api/exit-preview?slug=${post.slug.current}`}>
              <button className="mb-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors w-full text-sm">
                プレビューモードを終了
              </button>
            </Link>
          )}
          <div className="mb-4">
            <button
              onClick={() => setShowToc(!showToc)}
              className="mb-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors w-full text-sm"
            >
              {showToc ? '目次を隠す' : '目次を表示'}
            </button>
            {showToc && <TableOfContents headings={headings} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostClientPage;