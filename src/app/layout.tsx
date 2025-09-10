import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/ThemeProvider';
import SiteHeader from "@/components/SiteHeader"; // Import the new header

const inter = Inter({ subsets: ["latin"] });

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
          <SiteHeader /> {/* Use the new header component */}
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
