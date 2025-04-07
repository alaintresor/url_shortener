import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientReduxProvider from '@/components/ClientReduxProvider';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'URL Shortener',
  description: 'A simple URL shortener application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientReduxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ClientReduxProvider>
      </body>
    </html>
  );
}
