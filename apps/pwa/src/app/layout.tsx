import type { Metadata, Viewport } from 'next';
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
    default: 'ChaufHER - Safe Rides for Women',
    template: '%s | ChaufHER',
  },
  description: 'Safe, reliable transportation for women, by women. Schedule your ride today.',
  keywords: ['ride-hailing', 'women safety', 'transportation', 'South Africa'],
  authors: [{ name: 'ChaufHER' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ChaufHER',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://chaufher.co.za',
    title: 'ChaufHER - Safe Rides for Women',
    description: 'Safe, reliable transportation for women, by women.',
    siteName: 'ChaufHER',
  },
};

export const viewport: Viewport = {
  themeColor: '#E91E8C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
