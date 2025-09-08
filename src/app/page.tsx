import Link from 'next/link';
import { client } from '@/lib/sanity.client';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import type { Image as SanityImage } from 'sanity';

// Define interfaces for our data
interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: SanityImage;
  author: {
    name: string;
    image?: SanityImage;
  };
  categories?: Category[];
}

interface Category {
  title: string;
}

// Image builder for Sanity images
const builder = imageUrlBuilder(client);
function urlFor(source: SanityImage) {
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
  const posts: Post[] = await client.fetch(query);

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
      <h1 className="text-4xl font-bold mb-8">ブログ記事</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Post) => (
          <Link
            key={post._id}
            href={`/post/${post.slug.current}`}
            className="block rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2"
          >
            {post.mainImage && (
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="mb-4">
                {post.categories && post.categories.map((category: Category) => (
                  <span key={category.title} className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2 dark:bg-orange-900 dark:text-orange-200">
                    {category.title}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl font-bold mb-3 text-blue-900 dark:text-white">{post.title}</h2>
              <div className="flex items-center text-gray-700 dark:text-gray-400 text-sm">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(30).height(30).url()}
                    alt={post.author.name}
                    width={30}
                    height={30}
                    className="rounded-full mr-2"
                  />
                )}
                <span>
                  {post.author.name}が{new Date(post.publishedAt).toLocaleDateString()}に投稿
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-4">
          {currentPage > 1 && (
            <Link href={`/?page=${currentPage - 1}`} className="px-4 py-2 border rounded-md hover:bg-gray-200">
              前へ
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/?page=${page}`}
              className={`px-4 py-2 border rounded-md ${
                page === currentPage ? 'bg-orange-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              {page}
            </Link>
          ))}
          {currentPage < totalPages && (
            <Link href={`/?page=${currentPage + 1}`} className="px-4 py-2 border rounded-md hover:bg-gray-200">
              次へ
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
