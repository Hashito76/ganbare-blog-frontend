import imageUrlBuilder from '@sanity/image-url';
import { SanityClient } from 'next-sanity';

export function urlFor(source: any, client: SanityClient) {
  const builder = imageUrlBuilder(client);
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
