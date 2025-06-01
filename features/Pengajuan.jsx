'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const savedFormData = localStorage.getItem('formData');
        let parsedData = null;
        if (savedFormData && savedFormData !== 'undefined' && savedFormData !== 'null') {
          try {
            parsedData = JSON.parse(savedFormData);
          } catch {
            parsedData = null;
          }
        }

        try {
          const pengajuanDoc = await getDoc(doc(db, 'pengajuan_sidang', user.uid));
          if (pengajuanDoc.exists()) {
            const data = pengajuanDoc.data();
            setStatusPengajuan(data.status);
          } else {
            setStatusPengajuan('');
          }
        } catch (error) {
          console.error('Error fetching status pengajuan:', error);
          setStatusPengajuan('');
        }

        setFormData({
          nim: parsedData?.nim || '',
          title: parsedData?.title || '',
          file: null,
          name: user.displayName || '',
        });
      } else {
        setFormData({
          nim: '',
          title: '',
          file: null,
          name: '',
        });
        setStatusPengajuan('');
        localStorage.removeItem('formData');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const { nim, title, name } = formData;
    const saveData = { nim, title, name };
    localStorage.setItem('formData', JSON.stringify(saveData));
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
            confirmButton: 'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
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
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();
      if (response.ok) return data.secure_url;
      throw new Error(data.error?.message || 'Unknown error');
    } catch (error) {
      throw new Error('Upload to Cloudinary failed: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      Swal.fire({
        title: 'Harap login terlebih dahulu.',
        customClass: {
          confirmButton: 'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
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
          confirmButton: 'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
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
          confirmButton: 'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
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
          confirmButton: 'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let fileUrl = '';
      if (formData.file) {
        fileUrl = await uploadToCloudinary(formData.file);
        if (!fileUrl) {
          Swal.fire({
            title: 'Terjadi kesalahan!',
            text: 'Gagal mengupload file ke Cloudinary.',
            icon: 'error',
            customClass: {
              confirmButton: 'bg-gray-900 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-gray-500',
            },
          });
          setIsSubmitting(false);
          return;
        }
      }

      const pengajuanData = {
        id: user.uid,
        nama: formData.name,
        nim: formData.nim,
        judul_skripsi: formData.title,
        tanggal_pengajuan: new Date().toISOString(),
        tanggal_sidang: '',
        waktu_sidang: '',
        status: 'menunggu persetujuan',
        berkas: fileUrl,
      };

      await setDoc(doc(db, 'pengajuan_sidang', user.uid), pengajuanData);

      Swal.fire({
        title: 'Pengajuan berhasil!',
        text: 'Pengajuan berhasil diajukan!',
        icon: 'success',
        customClass: {
          popup: 'bg-green-100 text-black',
          title: 'text-3xl font-semibold text-green-600',
          content: 'text-lg text-gray-700',
          confirmButton: 'bg-green-500 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-green-600',
        },
      });

      localStorage.removeItem('formData');
      setFormData({
        nim: '',
        title: '',
        file: null,
        name: user.displayName || '',
      });
      setStatusPengajuan('menunggu persetujuan');
      setIsSubmitting(false);
    } catch (err) {
      Swal.fire({
        title: 'Terjadi kesalahan!',
        text: 'Terjadi kesalahan saat mengajukan.',
        icon: 'error',
        customClass: {
          popup: 'bg-red-100 text-black',
          title: 'text-3xl font-semibold text-red-600',
          content: 'text-lg text-gray-700',
          confirmButton: 'bg-red-500 text-white px-6 py-1 font-semibold rounded-md shadow-md hover:bg-red-600',
        },
      });
      console.error('Error pengajuan:', err);
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
                accept="application/pdf,image/*"
                onChange={handleChange}
                className="block w-full text-sm text-black file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-700"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded bg-gray-900 px-4 py-2 font-bold text-white shadow-md hover:bg-gray-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Mengirim...' : 'Ajukan Sidang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
