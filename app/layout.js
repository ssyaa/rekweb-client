'use client';

import { UserProvider } from '@/contexts/UserContext';
import { usePathname } from 'next/navigation';
import localFont from 'next/font/local';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

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

// export const metadata = {
//   title: 'Sistem Penjadwalan Skripsi',
//   description: 'Sistem untuk pengajuan jadwal sidang skripsi online',
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const noLayoutPaths = ['/login'];

  return (
    <UserProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {!noLayoutPaths.includes(pathname) && <Navbar />}
          <main>{children}</main>
          {!noLayoutPaths.includes(pathname) && <Footer />}
        </body>
      </html>
    </UserProvider>
  );
}
