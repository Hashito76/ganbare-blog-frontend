import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity.client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ message: 'Query parameter is missing' }, { status: 400 });
  }

  const sanityQuery = `*[_type == "post" && (title match "${query}*" || body[].children[].text match "${query}*")]{ 
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

  try {
    const posts = await client.fetch(sanityQuery);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({ message: 'Error fetching search results' }, { status: 500 });
  }
}