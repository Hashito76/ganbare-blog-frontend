import { client, previewClient } from '@/lib/sanity.client'; // Import client and previewClient
import { draftMode } from 'next/headers'; // Import draftMode
import PostClientPage from '@/components/PostClientPage'; // Import PostClientPage
import type { Image as SanityImage, Slug as SanitySlug, PortableTextBlock } from 'sanity';

// Define the Post interface
interface Post {
  _id: string;
  title: string;
  slug: SanitySlug;
  publishedAt: string;
  mainImage?: SanityImage;
  author: {
    name: string;
    image?: SanityImage;
  };
  categories?: { title: string }[];
  body?: PortableTextBlock[];
  tableOfContentsIntro?: string;
}

interface Slug {
  slug: string;
}

// Function to generate static params for all posts
export async function generateStaticParams() {
  const query = `*[_type == "post"]{
    "slug": slug.current
  }`;
  const slugs: Slug[] = await client.fetch(query);
  return slugs.map((slug) => ({ slug: slug.slug }));
}

// Function to get a single post by slug
async function getPost(slug: string): Promise<Post> {
  const isDraftMode = draftMode().isEnabled;
  const currentClient = isDraftMode ? previewClient : client;

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
    body,
    tableOfContentsIntro
  }`;
  const post: Post = await currentClient.fetch(query, { slug }, { cache: 'no-store' });
  return post;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  const isDraftMode = draftMode().isEnabled;

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <PostClientPage post={post} isDraftMode={isDraftMode} />
  );
}