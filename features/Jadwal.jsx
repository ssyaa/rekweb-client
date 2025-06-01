'use client';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Jadwal = () => {
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPengajuan = async (user) => {
    try {
      // Ganti URL sesuai alamat API NestJS mu
      const response = await fetch(`/api/pengajuan?nama=${encodeURIComponent(user.displayName)}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();

      // Map data supaya sesuai struktur frontend
      const mappedData = data.map(item => ({
        id: item.id,
        nama: item.nama,
        nim: item.nim,
        judul_skripsi: item.judul_skripsi || 'Belum tersedia',
        status: item.status,
        alasan: item.alasan,
        berkas: item.berkas,
        tanggal_sidang: item.jadwal?.tanggal_sidang
          ? new Date(item.jadwal.tanggal_sidang).toISOString().split('T')[0]
          : 'Belum dijadwalkan',
        waktu_sidang: item.jadwal?.waktu_sidang || 'Belum dijadwalkan',
        dosen_1: item.jadwal?.dosen_1 || 'Belum ditentukan',
        dosen_2: item.jadwal?.dosen_2 || 'Belum ditentukan',
      }));

      setPengajuan(mappedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi kirim ke Google Calendar sama seperti sebelumnya

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPengajuan(user);
      } else {
        setPengajuan([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-gray-500"></div>
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50">
      <h1 className="pb-8 pt-16 text-center text-xl font-semibold text-black">
        Jadwal Sidang Saya
      </h1>

      <div className="flex w-full max-w-4xl flex-col items-center px-4">
        {pengajuan.length > 0 ? (
          pengajuan.map((item) => (
            <div
              key={item.id}
              className="mb-6 w-full rounded-md border-2 border-gray-100 bg-white p-6 shadow-md"
            >
              <div className="text-md mb-2">
                <span className="font-semibold">Nama:</span> {item.nama}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">NIM:</span> {item.nim}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Judul Skripsi:</span>{' '}
                {item.judul_skripsi || 'Belum tersedia'}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Tanggal Sidang:</span>{' '}
                {item.tanggal_sidang || 'Belum dijadwalkan'}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Waktu Sidang:</span>{' '}
                {item.waktu_sidang || 'Belum dijadwalkan'}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Dosen Penguji 1:</span>{' '}
                {item.dosen_1 || 'Belum ditentukan'}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Dosen Penguji 2:</span>{' '}
                {item.dosen_2 || 'Belum ditentukan'}
              </div>

              <div className="mt-4 flex items-center">
                {item.berkas && (
                  <a
                    href={item.berkas}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounde mr-4 text-blue-500 underline hover:text-blue-700"
                  >
                    Unduh Berkas
                  </a>
                )}

                {item.status === 'disetujui' &&
                  item.tanggal_sidang &&
                  item.waktu_sidang && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        kirimKeGoogleCalendar({
                          nama: item.nama,
                          tanggal_sidang: item.tanggal_sidang,
                          waktu_sidang: item.waktu_sidang,
                          judul_skripsi: item.judul_skripsi,
                        });
                      }}
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      Tambah ke Google Calendar
                    </a>
                  )}
              </div>

              <div className="-m-6 mt-5 bg-gray-100 p-4">
                <p
                  className={`text-md ps-2 font-medium ${
                    item.status === 'disetujui'
                      ? 'text-green-500'
                      : item.status === 'ditolak'
                        ? 'text-red-500'
                        : 'text-gray-500'
                  }`}
                >
                  <b>Status: {item.status}</b>
                </p>

                {item.status === 'ditolak' && item.alasan && (
                  <p className="text-md mt-4 text-red-500">
                    <b>Alasan Penolakan:</b> {item.alasan}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="flex w-full items-center justify-center text-center text-lg text-black">
            <i>Tidak ada data pengajuan.</i>
          </p>
        )}
      </div>
    </div>
  );
};

export default Jadwal;
