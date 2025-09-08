import { createClient } from 'next-sanity';

// The preview token should be stored in an environment variable for security
const previewToken = process.env.SANITY_PREVIEW_TOKEN;

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kr7pkbvy',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'kawaasobi-data',
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to specify API version
  useCdn: false, // set to `false` if you want to ensure fresh data
});

export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kr7pkbvy',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'kawaasobi-data',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: previewToken,
  perspective: 'previewDrafts',
});
