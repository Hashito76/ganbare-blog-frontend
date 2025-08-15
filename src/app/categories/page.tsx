import Link from 'next/link';
import { client } from '@/lib/sanity.client';

async function getCategories() {
  const query = `*[_type == "category"]{
    _id,
    title,
    description
  }`;
  const categories = await client.fetch(query);
  return categories;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category: any) => (
          <div key={category._id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">{category.title}</h2>
            {category.description && <p className="text-gray-600">{category.description}</p>}
            {/* You can add a link to posts under this category later */}
          </div>
        ))}
      </div>
    </div>
  );
}