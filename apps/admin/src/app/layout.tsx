import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import '@chaufher/ui/globals.css';
import { Providers } from '@/components/providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ChaufHER Admin',
    template: '%s | ChaufHER Admin',
  },
  description: 'ChaufHER Administration Portal',
  robots: 'noindex, nofollow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-gray-50 font-inter antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
