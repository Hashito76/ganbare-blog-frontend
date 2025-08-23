import { client } from '@/lib/sanity.client';
import imageUrlBuilder from '@sanity/image-url';

// Image builder for Sanity images
const builder = imageUrlBuilder(client);
export function urlFor(source: any) {
  return builder.image(source).url();
}

// Slugify function for generating IDs
export const slugify = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};
