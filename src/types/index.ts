import type { Image as SanityImage, Slug, PortableTextBlock, Block } from 'sanity';

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
  body?: Block[]; // Made optional to match potential undefined value
  tableOfContentsIntro?: PortableTextBlock[];
}
