'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useUser } from '@/contexts/UserContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useUser();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Anda akan keluar dari akun Anda!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, logout!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch('http://localhost:3001/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });

          logout();

          Swal.fire('Logout', 'Anda berhasil keluar.', 'success').then(() => {
            window.location.href = '/login';
          });
        } catch (error) {
          console.error('Logout gagal:', error);
          Swal.fire('Error', 'Logout gagal. Silakan coba lagi.', 'error');
        }
      }
    });
  };

  return (
    <nav className="sticky top-0 z-100 w-full bg-white text-black shadow-md">
      <div className="flex w-full items-center justify-between px-16 py-2">
        <div className="flex items-center space-x-4">
          <Image
            src="/unhas.png"
            alt="Universitas Hasanuddin"
            width={36}
            height={36}
            className="rounded-full"
            quality={100}
          />
          <span className="text-md font-bold">Universitas Hasanuddin</span>
        </div>

        <div className="hidden items-center space-x-8 text-sm md:flex">
          <Link href="/" className="hover:text-red-700">Home</Link>


          {currentUser && (
            <>
              <Link href="/pengajuan" className="hover:text-red-700">Ajukan Sidang</Link>
              <Link href="/jadwal" className="hover:text-red-700">Jadwal Sidang Saya</Link>
            </>
          )}

          {currentUser ? (
            <button
              onClick={handleLogout}
              className="rounded-md bg-black px-6 py-1 font-semibold text-white shadow-md hover:bg-red-900"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="rounded-md bg-black px-6 py-1 font-semibold text-white shadow-md hover:bg-red-900">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="absolute right-8 top-4 md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} onTouchStart={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute right-0 z-100 w-[200px] space-y-4 bg-white px-6 py-2 shadow-md transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Link href="/" className="block font-medium text-gray-700 hover:text-red-700">Home</Link>

        {currentUser && (
          <>
            <Link href="/pengajuan" className="hover:text-red-700">Ajukan Sidang</Link>
            <Link href="/jadwal" className="hover:text-red-700">Jadwal Sidang Saya</Link>
          </>
        )}

        <div className="py-2">
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 font-bold text-white hover:bg-gray-500"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="w-full block text-center rounded-lg bg-gray-900 px-4 py-2 font-bold text-white hover:bg-gray-500"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
