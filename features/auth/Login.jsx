'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useUser } from '@/contexts/UserContext';

export const SignIn = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { setCurrentUser } = useUser();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal login');
      }

      const data = await res.json(); // misal { token, user }
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setCurrentUser(data.user);

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Berhasil Login!',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        timerProgressBar: true,
        background: '#ffffff',
        color: '#000000',
      });

      router.push('/');
    } catch (err) {
      Swal.fire({
        title: 'Gagal Login',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="bg-gray flex min-h-[720px] w-screen items-center justify-center gap-20">
      {/* Gambar */}
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

      {/* Konten */}
      <div className="flex w-full flex-col justify-center md:w-[40%]">
        <div className="flex flex-col px-16 py-6 text-black md:py-10">
          <h1 className="mb-2 text-center text-3xl font-bold">Selamat Datang</h1>
          <p className="mb-6 text-center">
            Silakan Masuk untuk Mengakses Akun Anda.
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label>Email</label>
              <input
                type="text"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                className="w-full rounded border p-3"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Password</label>
              <input
                type="password"
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
            >
              Masuk
            </button>
          </form>

          <p className="mt-4 text-center">
            Tidak punya akun?{' '}
            <Link
              href={'https://wa.me/+62895337483302'}
              target="_blank"
              passHref={true}
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
