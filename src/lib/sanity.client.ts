import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kr7pkbvy',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'kawaasobi-data',
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to specify API version
  useCdn: true, // set to `false` if you want to ensure fresh data
});