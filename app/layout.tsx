import type { Metadata } from 'next';
import { Inter, Nunito_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const nunitoSans = Nunito_Sans({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito-sans'
});

export const metadata: Metadata = {
  title: 'Kindline - Relationship Walkie-Talkie',
  description: 'Say what you mean, kindly. Hear what they mean, clearly.',
  keywords: ['relationship', 'communication', 'therapy', 'couples', 'AI', 'kindline'],
  authors: [{ name: 'Kindline Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#be185d',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Kindline - Relationship Walkie-Talkie',
    description: 'Say what you mean, kindly. Hear what they mean, clearly.',
    type: 'website',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Kindline - Relationship Walkie-Talkie',
    description: 'Say what you mean, kindly. Hear what they mean, clearly.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#be185d" />
      </head>
      <body className={`${inter.className} ${nunitoSans.variable} bg-gray-900 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
