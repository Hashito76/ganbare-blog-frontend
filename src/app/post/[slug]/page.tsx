import { client } from '@/lib/sanity.client'; // Import client
import imageUrlBuilder from '@sanity/image-url';
import PostClientPage from '@/components/PostClientPage'; // Import PostClientPage
import { urlFor, slugify } from '@/lib/clientUtils'; // Import from clientUtils

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

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <PostClientPage post={post} />
  );
}