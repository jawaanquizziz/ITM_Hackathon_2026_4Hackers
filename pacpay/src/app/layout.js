import './globals.css';
import { Inter, Outfit } from 'next/font/google';
import ClientWrapper from '@/components/ClientWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-main' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const viewport = {
  themeColor: '#050505',
};

export const metadata = {
  title: 'PacPay - Premium Finance',
  description: 'Manage money and earn professional rewards.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PacPay',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.className} ${outfit.variable} min-h-screen flex flex-col bg-[var(--color-pac-bg)]`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
