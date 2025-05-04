import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Resume Rater Pro',
  description: 'AI-powered resume rating and improvement tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  Resume Rater Pro
                </Link>
              </div>
              <div className="space-x-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Rate Resume
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
} 