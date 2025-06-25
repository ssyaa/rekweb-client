'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext'; // ⬅️ pastikan path-nya sesuai

type FormDataType = {
  nim: string;
  thesis_title: string;
  file_url: File | null;
  name: string;
};

export const SubmissionForm = () => {
  const router = useRouter();
  const { user, loading, checkAuth } = useUser();

  const [localSubmissionStatus, setLocalSubmissionStatus] = useState('');
  const [formData, setFormData] = useState<FormDataType>({
    nim: '',
    thesis_title: '',
    file_url: null,
    name: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const fetchSubmissionStatus = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:3002/submission/status?id=${user.student?.id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      setLocalSubmissionStatus(data.status || '');
    } catch (err) {
      setLocalSubmissionStatus('');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      if (user.role !== 'MAHASISWA') {
        router.push('/unauthorized');
      } else {
        setFormData((prev) => ({ ...prev, name: user.name || '' }));
        fetchSubmissionStatus();
      }
    }
  }, [loading, user]);

  useEffect(() => {
    const { nim, thesis_title, name } = formData;
    localStorage.setItem('formData', JSON.stringify({ nim, thesis_title, name }));
  }, [formData.nim, formData.thesis_title, formData.name]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files?.[0];
      if (file && file.size > 2 * 1024 * 1024) {
        Swal.fire('File terlalu besar!', 'Ukuran maksimal 2MB.', 'error');
        e.target.value = '';
        return;
      }

      setUploadedFileName(file?.name || null);
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formDataUpload,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Upload gagal');
    return data.secure_url;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { nim, thesis_title, name, file_url } = formData;

    if (localSubmissionStatus === 'MENUNGGU' || localSubmissionStatus === 'DISETUJUI') {
      Swal.fire('Tidak dapat mengajukan!', 'Pengajuan Anda sedang diproses atau telah disetujui.', 'error');
      return;
    }

    if (!nim || !thesis_title || !name || !file_url) {
      Swal.fire('Validasi gagal!', 'Semua data wajib diisi!', 'error');
      return;
    }

    if (nim.length !== 10) {
      Swal.fire('NIM tidak valid!', 'Harus 10 karakter.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadedUrl = await uploadToCloudinary(file_url);

      const response = await fetch('http://localhost:3002/submission/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          thesis_title,
          file_url: uploadedUrl,
          user_id: user.id,
          nim,
          name,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal mengirim pengajuan.');
      }

      Swal.fire('Pengajuan Berhasil!', 'Pengajuan berhasil dikirim.', 'success');

      await fetchSubmissionStatus();
      localStorage.removeItem('formData');
      setUploadedFileName(null);
      setFormData({
        nim: '',
        thesis_title: '',
        file_url: null,
        name: user.name || '',
      });
    } catch (err: any) {
      Swal.fire('Terjadi kesalahan!', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColor = {
    DISETUJUI: 'text-green-600',
    MENUNGGU: 'text-yellow-500',
    DITOLAK: 'text-red-600',
  }[localSubmissionStatus || ''] || 'text-gray-700';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading data user...</p>
      </div>
    );
  }

  return (
    <div className="items-top justify-top bg-gray flex min-h-screen">
      <div className="w-full rounded">
        <h2 className="mt-12 text-center text-xl font-bold text-black">Pengajuan Sidang</h2>
        <p className="text-md mb-8 mt-4 text-center text-gray-900">
          Lengkapi data berikut untuk mengajukan jadwal sidang skripsi Anda
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mx-32">
            <div className="mb-8">
              <label className="mb-2 block font-bold text-black">Nama Mahasiswa</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
              />
            </div>

            <div className="mb-8">
              <label className="mb-2 font-bold block text-black">NIM</label>
              <input
                type="text"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                placeholder="NIM"
                className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
              />
            </div>

            <div className="mb-8">
              <label className="mb-2 font-bold block text-black">Judul Skripsi</label>
              <input
                type="text"
                name="thesis_title"
                value={formData.thesis_title}
                onChange={handleChange}
                placeholder="Judul Skripsi"
                className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
              />
            </div>

            <div className="mb-8">
              <label className="mb-2 font-bold block text-black">Upload Berkas Sidang</label>
              <input
                type="file"
                name="file_url"
                accept="application/pdf,image/*"
                onChange={handleChange}
                className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
              />
              {uploadedFileName && (
                <p className="mt-2 text-sm text-gray-700">📎 File: {uploadedFileName}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || localSubmissionStatus === 'DISETUJUI'}
              className={`w-full rounded bg-gray-900 px-6 py-2 font-semibold text-white shadow-md hover:bg-gray-600 ${
                isSubmitting || localSubmissionStatus === 'DISETUJUI'
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
            >
              {isSubmitting ? 'Mengirim...' : 'Ajukan'}
            </button>
          </div>
        </form>

        {user && (
          <p className="text-md mt-8 text-center font-bold">
            Status Pengajuan:{' '}
            <span className={`${statusColor}`}>
              {localSubmissionStatus !== '' ? localSubmissionStatus : 'Belum ada pengajuan'}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
