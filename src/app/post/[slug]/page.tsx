import { client } from '@/lib/sanity.client';
import { PortableText } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image'; // Import Image component

// Function to generate static params for all posts
export async function generateStaticParams() {
  const query = `*[_type == "post"]{
    "slug": slug.current
  }`;
  const slugs = await client.fetch(query);
  return slugs.map((slug: any) => ({ slug: slug.slug }));
}

// Function to get a single post by slug
async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    author->{
      name,
      image
    },
    categories[]->{
      title
    },
    body
  }`;
  const post = await client.fetch(query, { slug });
  return post;
}

// Image builder for Sanity images
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center text-gray-600 text-sm mb-2">
        {post.author.image && (
          <img
            src={urlFor(post.author.image).width(30).height(30).url()}
            alt={post.author.name}
            className="rounded-full mr-2"
          />
        )}
        <span>By {post.author.name} on {new Date(post.publishedAt).toLocaleDateString()}</span>
      </div>
      <div className="mb-4">
        {post.categories && post.categories.map((category: any) => (
          <span key={category.title} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
            {category.title}
          </span>
        ))}
      </div>
      {post.mainImage && (
        <img
          src={urlFor(post.mainImage).url()}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      <div className="prose lg:prose-xl">
        <PortableText value={post.body} />
      </div>
      
    </div>
  );
}