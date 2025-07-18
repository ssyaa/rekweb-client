'use client';

import { useState, FormEvent } from 'react';
import { useUser } from '../../contexts/UserContext';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import React from 'react';

export const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { login, loading, error } = useUser(); // pastikan useUser return type-nya sudah diatur

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(email, password); // context akan handle redirect
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Login!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Login',
        text: err.message || 'Terjadi kesalahan.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="bg-gray flex min-h-[720px] w-screen items-center justify-center gap-20">
      <div className="hidden text-center md:block">
        <Image
          src="/mahasiswa.png"
          alt="login"
          width={460}
          height={100}
          className="mx-auto block rounded-sm"
        />
        <p className="py-6 text-lg font-bold">
          Satu Langkah Menuju Sidang, Masuk Sekarang!
        </p>
      </div>

      <div className="flex w-full flex-col justify-center md:w-[40%]">
        <div className="flex flex-col px-16 py-6 text-black md:py-10">
          <h1 className="mb-2 text-center text-3xl font-bold">Selamat Datang</h1>
          <p className="mb-6 text-center">
            Silakan Masuk untuk Mengakses Akun Anda.
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border p-3"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border p-3"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-black p-3 text-white"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Masuk'}
            </button>
          </form>

          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}

          <p className="mt-4 text-center">
            Tidak punya akun?{' '}
            <Link
              href="https://wa.me/+62895337483302"
              target="_blank"
              className="text-blue-500 hover:text-blue-900"
            >
              Hubungi Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
