import Link from 'next/link';
import { client } from '@/lib/sanity.client';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';

// Image builder for Sanity images
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

const POSTS_PER_PAGE = 6; // Number of posts to display per page

async function getPosts(page: number = 1, limit: number = POSTS_PER_PAGE) {
  const start = (page - 1) * limit;
  const end = page * limit;

  const query = `*[_type == "post"] | order(publishedAt desc, _createdAt desc) [${start}...${end}]{
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
    }
  }`;
  const posts = await client.fetch(query);

  const totalPostsQuery = `count(*[_type == "post"])`;
  const totalPosts = await client.fetch(totalPostsQuery);

  return { posts, totalPosts };
}

export default async function HomePage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const { posts, totalPosts } = await getPosts(currentPage);
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: any) => (
          <div key={post._id} className="border p-4 rounded-lg shadow-md">
            {post.mainImage && (
              <img
                src={urlFor(post.mainImage).url()}
                alt={post.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
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
            <Link href={`/post/${post.slug.current}`} className="text-blue-500 hover:underline">
              Read More
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-4">
          {currentPage > 1 && (
            <Link href={`/?page=${currentPage - 1}`} className="px-4 py-2 border rounded-md hover:bg-gray-200">
              Previous
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/?page=${page}`}
              className={`px-4 py-2 border rounded-md ${
                page === currentPage ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              {page}
            </Link>
          ))}
          {currentPage < totalPages && (
            <Link href={`/?page=${currentPage + 1}`} className="px-4 py-2 border rounded-md hover:bg-gray-200">
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
