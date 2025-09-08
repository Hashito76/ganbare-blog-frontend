import imageUrlBuilder from '@sanity/image-url';
import { SanityClient } from 'next-sanity';
import type { Image as SanityImage } from 'sanity';

export function urlFor(source: SanityImage, client: SanityClient) {
  return imageUrlBuilder(client).image(source);
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
