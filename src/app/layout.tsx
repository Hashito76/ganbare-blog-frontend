import type { Metadata } from "next";
import { Inter, Luckiest_Guy } from "next/font/google"; // Import Inter and Luckiest_Guy font
import "./globals.css";
import Link from "next/link";
import SearchInput from '@/components/SearchInput'; // Added import
import { ThemeProvider } from '@/components/ThemeProvider'; // Added import
import ThemeSwitcher from '@/components/ThemeSwitcher'; // Added import

const inter = Inter({ subsets: ["latin"] }); // Initialize Inter font
const luckiestGuy = Luckiest_Guy({
  weight: "400", // Luckiest Guy only has 400 weight
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Logarithmic Life",
  description: "Next.jsとSanityで構築されたブログ",
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
              <Link href="/" className={`text-2xl font-bold ${luckiestGuy.className} text-pop-shadow text-white`}>
                Logarithmic Life
              </Link>
              <nav className="flex items-center space-x-4">
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/" className="hover:underline">
                      ホーム
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="hover:underline">
                      カテゴリー
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
              &copy; {new Date().getFullYear()} Logarithmic Life. 無断転載を禁じます。
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
