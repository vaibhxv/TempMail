import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TempGen - Temporary Email, Phone & Address Generator | Free Privacy Tools',
  description: 'Generate temporary email addresses, phone numbers, and addresses for privacy protection. Free temporary services with real-time inbox and SMS capabilities.',
  keywords: 'temporary email, temp mail, disposable email, temporary phone number, fake address generator, privacy tools, anonymous email',
  authors: [{ name: 'TempGen Team' }],
  creator: 'TempGen',
  publisher: 'TempGen',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tempgen.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TempGen - Temporary Email, Phone & Address Generator',
    description: 'Generate temporary email addresses, phone numbers, and addresses for privacy protection.',
    url: 'https://tempgen.app',
    siteName: 'TempGen',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TempGen - Privacy Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TempGen - Temporary Email, Phone & Address Generator',
    description: 'Free privacy tools for generating temporary contact information.',
    creator: '@tempgen',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TempGen",
              "description": "Generate temporary email addresses, phone numbers, and addresses for privacy protection.",
              "url": "https://tempgen.app",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "TempGen Team"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'>
        <Header />
        {children}
        <Toaster />
        <Footer />
        </div>
      </body>
    </html>
  );
}