'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';

export const SignUp = () => {
  const [nama, setnama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!nama || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to register');
        return;
      }

      Swal.fire({
        title: 'Berhasil membuat akun',
        customClass: {
          confirmButton:
            'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
        },
      });

      router.push('/');
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Coba lagi',
        customClass: {
          confirmButton:
            'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
        },
      });
    }
  };

  const handleGoogleSignUp = () => {
    // Fungsi sementara untuk mencegah error saat build
    console.log('Google sign up clicked');
    Swal.fire({
      title: 'Fitur belum tersedia',
      text: 'Google Sign-Up belum diimplementasikan.',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  };

  return (
    <div classnama="bg-gray flex min-h-screen w-screen items-center justify-center space-x-32 px-16">
      {/* Bagian Konten */}
      <div classnama="flex w-full flex-col px-8 md:w-[40%]">
        <div classnama="py-4 text-black">
          <h1 classnama="mb-2 text-center text-3xl font-bold">Welcome</h1>
          <p classnama="mb-6 text-center">
            Please fill in your details to create a new account.
          </p>

          <form onSubmit={handleSignUp} classnama="space-y-3">
            <div classnama="flex flex-col gap-2">
              <label>nama</label>
              <input
                type="text"
                placeholder="Enter your nama"
                value={nama}
                onChange={(e) => setnama(e.target.value)}
                classnama="w-full rounded border p-3"
                required
              />
            </div>
            <div classnama="flex flex-col gap-2">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                classnama="w-full rounded border p-3"
                required
              />
            </div>
            <div classnama="flex flex-col gap-2">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                classnama="w-full rounded border p-3"
                required
              />
            </div>
            <div classnama="flex flex-col gap-2">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                classnama="w-full rounded border p-3"
                required
              />
            </div>

            {error && <p classnama="text-red-500">{error}</p>}
            <button
              type="submit"
              classnama="w-full rounded bg-black p-2 text-white"
            >
              Sign Up
            </button>
          </form>

          <div classnama="mt-4 flex items-center">
            <hr classnama="flex-grow border-gray-300" />
            <span classnama="px-4 text-gray-500">or</span>
            <hr classnama="flex-grow border-gray-300" />
          </div>

          <button
            onClick={handleGoogleSignUp}
            classnama="mt-4 flex w-full items-center justify-center rounded border border-gray-300 p-2"
          >
            <Image
              classnama="px-2"
              src="/Google.png"
              alt="Google icon"
              width={38}
              height={20}
              objectFit="cover"
            />
            Sign Up with Google
          </button>

          <p classnama="mt-4 text-center">
            Already have an account?{' '}
            <Link href="/login" classnama="text-blue-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Bagian Gambar */}
      <div classnama="hidden text-center md:block">
        <Image
          src="/sidang.png"
          alt="signup"
          width={350}
          height={100}
          classnama="mx-auto block rounded-sm"
        />
        <p classnama="text-lg font-bold">
          Daftar untuk Mengatur Jadwal Sidang Skripsi!
        </p>
      </div>
    </div>
  );
};
