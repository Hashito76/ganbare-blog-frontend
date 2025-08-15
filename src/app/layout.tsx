import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import Inter font
import "./globals.css";
import Link from "next/link";
import SearchInput from '@/components/SearchInput'; // Added import
import { ThemeProvider } from '@/components/ThemeProvider'; // Added import
import ThemeSwitcher from '@/components/ThemeSwitcher'; // Added import

const inter = Inter({ subsets: ["latin"] }); // Initialize Inter font

export const metadata: Metadata = {
  title: "My Awesome Blog",
  description: "A blog built with Next.js and Sanity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                My Awesome Blog
              </Link>
              <nav className="flex items-center space-x-4">
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/" className="hover:underline">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="hover:underline">
                      Categories
                    </Link>
                  </li>
                </ul>
                <SearchInput />
                <ThemeSwitcher /> {/* Added ThemeSwitcher */}
              </nav>
            </div>
          </header>
          <main className="flex-grow container mx-auto p-4">
            {children}
          </main>
          <footer className="bg-gray-800 text-white p-4 text-center">
            <div className="container mx-auto">
              &copy; {new Date().getFullYear()} My Awesome Blog. All rights reserved.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
