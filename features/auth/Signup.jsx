'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';

export const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
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
          name,
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
    <div className="bg-gray flex min-h-screen w-screen items-center justify-center space-x-32 px-16">
      {/* Bagian Konten */}
      <div className="flex w-full flex-col px-8 md:w-[40%]">
        <div className="py-4 text-black">
          <h1 className="mb-2 text-center text-3xl font-bold">Welcome</h1>
          <p className="mb-6 text-center">
            Please fill in your details to create a new account.
          </p>

          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="flex flex-col gap-2">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border p-3"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border p-3"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border p-3"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded border p-3"
                required
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded bg-black p-2 text-white"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-4 flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            onClick={handleGoogleSignUp}
            className="mt-4 flex w-full items-center justify-center rounded border border-gray-300 p-2"
          >
            <Image
              className="px-2"
              src="/Google.png"
              alt="Google icon"
              width={38}
              height={20}
              objectFit="cover"
            />
            Sign Up with Google
          </button>

          <p className="mt-4 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Bagian Gambar */}
      <div className="hidden text-center md:block">
        <Image
          src="/sidang.png"
          alt="signup"
          width={350}
          height={100}
          className="mx-auto block rounded-sm"
        />
        <p className="text-lg font-bold">
          Daftar untuk Mengatur Jadwal Sidang Skripsi!
        </p>
      </div>
    </div>
  );
};
