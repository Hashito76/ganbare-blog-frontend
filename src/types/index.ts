import type { Image as SanityImage, Slug, PortableTextBlock } from 'sanity';

export interface Post {
  _id: string;
  title: string;
  slug: Slug;
  publishedAt: string;
  mainImage?: SanityImage;
  author: {
    name: string;
    image?: SanityImage;
  };
  categories?: { title: string }[];
  body?: PortableTextBlock[];
  tableOfContentsIntro?: PortableTextBlock[];
}