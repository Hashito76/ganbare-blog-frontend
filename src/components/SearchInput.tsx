'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
}

export default function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) { // Only search if more than 2 characters
        setLoading(true);
        const res = await fetch(`/api/search?query=${searchTerm}`);
        const data = await res.json();
        setSearchResults(data);
        setLoading(false);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBlur = () => {
    // Delay hiding results to allow click on link
    setTimeout(() => setShowResults(false), 200);
  };

  const handleFocus = () => {
    if (searchResults.length > 0 || searchTerm.length > 2) {
      setShowResults(true);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search posts..."
        className="p-2 rounded-md text-gray-800"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showResults && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {loading && <div className="p-2 text-gray-600">Searching...</div>}
          {!loading && searchResults.length === 0 && searchTerm.length > 2 && (
            <div className="p-2 text-gray-600">No results found.</div>
          )}
          {!loading && searchResults.length > 0 && (
            <ul>
              {searchResults.map((post) => (
                <li key={post._id} className="border-b border-gray-200 last:border-b-0">
                  <Link href={`/post/${post.slug.current}`} className="block p-2 hover:bg-gray-100 text-gray-800">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}