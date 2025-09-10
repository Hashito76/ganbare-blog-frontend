'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Luckiest_Guy } from 'next/font/google';
import SearchInput from '@/components/SearchInput';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const luckiestGuy = Luckiest_Guy({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const SiteHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className={`text-2xl font-bold ${luckiestGuy.className} text-pop-shadow text-white`}>
          Logarithmic Life
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li><Link href="/" className="hover:underline">ホーム</Link></li>
            <li><Link href="/categories" className="hover:underline">カテゴリー</Link></li>
          </ul>
          <SearchInput />
          <ThemeSwitcher />
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="メニューを開く">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col space-y-4">
            <ul className="flex flex-col space-y-2">
              <li><Link href="/" className="hover:underline" onClick={() => setIsMenuOpen(false)}>ホーム</Link></li>
              <li><Link href="/categories" className="hover:underline" onClick={() => setIsMenuOpen(false)}>カテゴリー</Link></li>
            </ul>
            <div className="pl-0">
              <SearchInput />
            </div>
            <div className="self-start">
              <ThemeSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
