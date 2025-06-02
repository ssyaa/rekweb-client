'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export const PengajuanForm = () => {
  const [formData, setFormData] = useState({
    nim: '',
    title: '',
    file: null,
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusPengajuan, setStatusPengajuan] = useState('');
  const [user, setUser] = useState(null); // Gantikan dengan context user sebenarnya

  // Simulasi user login, ganti ini dengan context atau global state user
  useEffect(() => {
    // Misal user sudah login dan ada di localStorage atau context
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData((prev) => ({ ...prev, name: storedUser.name || '' }));
      // Fetch status pengajuan dari backend jika perlu
      fetch(`/api/pengajuan/status?userId=${storedUser.id}`)
        .then((res) => res.json())
        .then((data) => setStatusPengajuan(data.status || ''))
        .catch(() => setStatusPengajuan(''));
    } else {
      setUser(null);
      setFormData({ nim: '', title: '', file: null, name: '' });
      setStatusPengajuan('');
    }
  }, []);

  useEffect(() => {
    const { nim, title, name } = formData;
    localStorage.setItem('formData', JSON.stringify({ nim, title, name }));
  }, [formData.nim, formData.title, formData.name]);

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

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: 'POST',
          body: formDataUpload,
        }
      );
      const data = await response.json();
      if (response.ok) return data.secure_url;
      throw new Error(data.error?.message || 'Unknown error');
    } catch (error) {
      throw new Error('Upload to Cloudinary failed: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        title: 'Harap login terlebih dahulu.',
        customClass: {
          confirmButton:
            'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
        },
      });
      return;
    }

    if (statusPengajuan === 'disetujui') {
      Swal.fire({
        title: 'Tidak dapat mengajukan!',
        text: 'Pengajuan Anda telah disetujui, tidak dapat diperbarui.',
        icon: 'error',
        customClass: {
          confirmButton:
            'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
        },
      });
      return;
    }

    if (!formData.nim || !formData.title || !formData.name || !formData.file) {
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

    if (formData.nim.length !== 10) {
      Swal.fire({
        title: 'Validasi gagal!',
        text: 'NIM harus 10 karakter!',
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
      const fileUrl = await uploadToCloudinary(formData.file);

      // Kirim data ke backend NestJS (pastikan API endpoint benar dan menerima data JSON)
      const response = await fetch('/api/pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id, // kirim userId juga ke backend
          nim: formData.nim,
          title: formData.title,
          name: formData.name,
          berkasUrl: fileUrl,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal mengajukan');
      }

      Swal.fire({
        title: 'Pengajuan berhasil!',
        text: 'Pengajuan berhasil diajukan!',
        icon: 'success',
        customClass: {
          popup: 'bg-green-100 text-black',
          title: 'text-3xl font-semibold text-green-600',
          content: 'text-lg text-gray-700',
          confirmButton:
            'bg-green-500 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-green-600',
        },
      });

      localStorage.removeItem('formData');
      setFormData({
        nim: '',
        title: '',
        file: null,
        name: user.name || '',
      });
      setStatusPengajuan('menunggu persetujuan');
    } catch (err) {
      Swal.fire({
        title: 'Terjadi kesalahan!',
        text: err.message || 'Terjadi kesalahan saat mengajukan.',
        icon: 'error',
        customClass: {
          popup: 'bg-red-100 text-black',
          title: 'text-3xl font-semibold text-red-600',
          content: 'text-lg text-gray-700',
          confirmButton:
            'bg-red-500 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-red-600',
        },
      });
      console.error('Error pengajuan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                readOnly
                className="shadow-b w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
              />
            </div>
            <div className="mb-8">
              <label className="mb-2 font-bold block text-black">NIM</label>
              <input
                type="text"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                className="shadow-b w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
                placeholder="NIM"
              />
            </div>
            <div className="mb-8">
              <label className="mb-2 font-bold block text-black">Judul Skripsi</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="shadow-b w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
                placeholder="Judul Skripsi"
              />
            </div>
            <div className="mb-8">
              <label className="mb-2 font-bold block text-black">Upload Berkas Sidang</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                accept="application/pdf,image/*"
                className="shadow-b w-full rounded border border-gray-300 bg-gray-100 p-2 text-black shadow-sm"
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
          Status Pengajuan: <span className="text-green-600">{statusPengajuan || 'Belum ada pengajuan'}</span>
        </p>
      </div>
    </div>
  );
};
