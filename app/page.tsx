'use client';

import Image from 'next/image';
import React from 'react';

export default function Home() {
  return (
    <div className="bg-gray">
      {/* Hero Section */}
      <div className="relative flex h-[500] items-center justify-center bg-gray-200 bg-cover bg-center">
        <div className="px-16 py-12 text-center text-black">
          <h1 className="font- mb-4 text-4xl font-bold">
            Sistem Informasi Jadwal Sidang Skripsi
          </h1>
          <p className="text-lg">
            Kelola pengajuan dan jadwal sidang skripsi dengan lebih praktis
          </p>
        </div>
        <div className="hidden px-10 py-8 text-center md:block">
          <Image
            src="/business.png"
            alt="landing"
            width={500}
            height={100}
            className="mx-auto block rounded-sm"
          />
        </div>
      </div>

      {/* Panduan Pengajuan Sidang */}
      <div className="container px-16 pt-12">
        <h2 className="mb-6 text-lg font-bold text-black">
          Panduan Pengajuan Sidang
        </h2>
        <div className="grid grid-cols-1 gap-6 text-black md:grid-cols-4">
          {[
            'Prosedur Pengajuan',
            'Menunggu Konfirmasi',
            'Informasi Jadwal Sidang',
            'Ketentuan Penting',
          ].map((title, index) => (
            <div
              key={index}
              className="rounded-lg border bg-white p-4 shadow-md"
            >
              <h3 className="text-md mb-2 font-semibold">{title}</h3>
              <ul className="text-sm text-black">
                {title === 'Prosedur Pengajuan' ? (
                  <>
                    <li>1. Login ke Sistem</li>
                    <li>2. Isi Form Pengajuan</li>
                    <li>3. Kirim Pengajuan</li>
                  </>
                ) : title === 'Menunggu Konfirmasi' ? (
                  <li>Admin akan memeriksa berkas dalam 5 hari kerja.</li>
                ) : title === 'Informasi Jadwal Sidang' ? (
                  <li>
                    Jadwal sidang yang disetujui dapat dilihat di menu Jadwal
                    Sidang Saya.
                  </li>
                ) : (
                  <>
                    <li>1. Pastikan data yang diisi benar.</li>
                    <li>2. Jadwal tidak bisa diubah kecuali darurat.</li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Persyaratan Berkas */}
      <div className="container px-16 py-12">
        <h2 className="mb-6 text-lg font-bold text-black">
          Persyaratan Berkas
        </h2>
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          <ul className="space-y-4 text-sm text-black">
            <li>
              <strong>1. Draft Skripsi</strong> - Pastikan sudah disetujui oleh
              dosen pembimbing
            </li>
            <li>
              <strong>2. Lembar Persetujuan Sidang</strong> - Ditandatangani
              oleh dosen pembimbing
            </li>
            <li>
              <strong>3. Transkrip Akademik Terbaru</strong> - Sebagai bukti
              memenuhi syarat IPK minimal
            </li>
            <li>
              <strong>4. Formulir Pengajuan Sidang</strong> - Diisi dan
              ditandatangani
            </li>
          </ul>
        </div>
      </div>

      {/* Batas Waktu Pendaftaran */}
      <div className="px-16 pb-16">
        <div className="container mx-auto">
          <h2 className="py-3 text-lg font-semibold text-black">
            Batas Waktu Pendaftaran
          </h2>
          <p className="py-4 text-sm text-black">
            Batas waktu pendaftaran untuk pengajuan jadwal sidang
          </p>
          <div className="mt-2 w-[180] rounded-lg bg-gray-800 py-2 text-center text-white">
            <span className="text-sm font-bold">30 November 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}
