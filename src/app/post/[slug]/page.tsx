import { client, previewClient } from '@/lib/sanity.client';
import { draftMode } from 'next/headers';
import PostClientPage from '@/components/PostClientPage';
import { Post } from '@/types';

interface SlugParams {
  slug: string;
}

export async function generateStaticParams() {
  const query = `*[_type == "post"]{
    "slug": slug.current
  }`;
  const slugs: SlugParams[] = await client.fetch(query);
  return slugs.map((slug) => ({ slug: slug.slug }));
}

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