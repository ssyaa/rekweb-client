'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import localFont from 'next/font/local';
import { UserProvider } from '../contexts/UserContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';
import React from 'react';

const geistSans = localFont({
  src: './fonts/Roboto.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/Roboto.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const noLayoutPaths = ['/login'];

  const isLayoutVisible = !noLayoutPaths.includes(pathname);

  return (
    <UserProvider>
      <html lang="id">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {isLayoutVisible && <Navbar />}
          <main>{children}</main>
          {isLayoutVisible && <Footer />}
        </body>
      </html>
    </UserProvider>
  );
}
