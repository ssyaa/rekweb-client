'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useUser } from '../contexts/UserContext'; // pastikan path sesuai lokasi UserContext-mu
import { useRouter } from 'next/navigation'; // Next.js 13 app router redirect

export const PengajuanForm = () => {
  const { currentUser } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    nim: '',
    judulSkripsi: '',
    berkasUrl: null,
    nama: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusPengajuan, setStatusPengajuan] = useState('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Protect page, cek user login
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
      setFormData((prev) => ({ ...prev, nama: currentUser.nama || '' }));

      fetch(`http://localhost:3001/pengajuan/status?userId=${currentUser.id}`)
        .then((res) => res.json())
        .then((data) => setStatusPengajuan(data.status || ''))
        .catch(() => setStatusPengajuan(''));
    }
    setIsLoadingUser(false);
  }, [currentUser, router]);

  useEffect(() => {
    const { nim, judulSkripsi, nama } = formData;
    localStorage.setItem('formData', JSON.stringify({ nim, judulSkripsi, nama }));
  }, [formData.nim, formData.judulSkripsi, formData.nama]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file && file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: 'File terlalu besar!',
          text: 'Ukuran file tidak boleh lebih dari 2MB.',
          icon: 'error',
          customClass: {
            confirmButton:
              'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
          },
        });
        e.target.value = '';
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: formDataUpload,
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Upload gagal');
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) return;

    if (statusPengajuan === 'disetujui') {
      Swal.fire({
        title: 'Tidak dapat mengajukan!',
        text: 'Pengajuan Anda telah disetujui.',
        icon: 'error',
        customClass: {
          confirmButton:
            'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
        },
      });
      return;
    }

    
  if (isLoadingUser) {
    return <p className="text-center mt-20 text-gray-700">Memuat data pengguna...</p>;
  }

    const { nim, judulSkripsi, nama, berkasUrl } = formData;

    if (!nim || !judulSkripsi || !nama || !berkasUrl) {
      Swal.fire({
        title: 'Validasi gagal!',
        text: 'Semua data wajib diisi!',
        icon: 'error',
        customClass: {
          confirmButton:
            'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
        },
      });
      return;
    }

    if (nim.length !== 10) {
      Swal.fire({
        title: 'NIM tidak valid!',
        text: 'NIM harus terdiri dari 10 karakter.',
        icon: 'error',
        customClass: {
          confirmButton:
            'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadedUrl = await uploadToCloudinary(berkasUrl);

      const response = await fetch('http://localhost:3001/pengajuan/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          nama,
          nim,
          judulSkripsi,
          berkasUrl: uploadedUrl,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal mengirim pengajuan');
      }

      Swal.fire({
        title: 'Pengajuan Berhasil!',
        icon: 'success',
        text: 'Pengajuan berhasil dikirim.',
        customClass: {
          confirmButton:
            'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
        },
      });

      localStorage.removeItem('formData');
      setFormData({ nim: '', judulSkripsi: '', berkasUrl: null, nama: currentUser.nama });
      setStatusPengajuan('menunggu persetujuan');
    } catch (err) {
      Swal.fire({
        title: 'Terjadi kesalahan!',
        text: err.message,
        icon: 'error',
        customClass: {
          confirmButton:
            'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return <p className="text-center mt-20 text-gray-700">Memuat data pengguna...</p>;
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
                name="nama"
                value={formData.nama || ''}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
              />
            </div>

            <div className="mb-8">
              <label className="mb-2 font-bold block text-black">NIM</label>
              <input
                type="text"
                name="nim"
                value={formData.nim || ''}
                onChange={handleChange}
                placeholder="NIM"
                className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
              />
            </div>

            <div className="mb-8">
              <label className="mb-2 font-bold block text-black">Judul Skripsi</label>
              <input
                type="text"
                name="judulSkripsi"
                value={formData.judulSkripsi || ''}
                onChange={handleChange}
                placeholder="Judul Skripsi"
                className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
              />
            </div>

            <div className="mb-8">
              <label className="mb-2 font-bold block text-black">Upload Berkas Sidang</label>
              <input
                type="file"
                name="berkasUrl"
                accept="application/pdf,image/*"
                onChange={handleChange}
                className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded bg-gray-900 px-6 py-2 font-semibold text-white shadow-md hover:bg-gray-500 ${
                isSubmitting ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {isSubmitting ? 'Mengirim...' : 'Ajukan'}
            </button>
          </div>
        </form>

        <p className="text-md mt-8 text-center font-bold">
          Status Pengajuan:{' '}
          <span className="text-green-600">{statusPengajuan || 'Belum ada pengajuan'}</span>
        </p>
      </div>
    </div>
  );
};
