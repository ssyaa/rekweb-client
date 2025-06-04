'use client';
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext'; // Sesuaikan path UserContext-mu

const Jadwal = () => {
  const { currentUser } = useUser();
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const kirimKeGoogleCalendar = ({ nama, tanggal_sidang, waktu_sidang, judul_skripsi }) => {
    const pad = (num) => String(num).padStart(2, '0');

    const parseDateTime = (tanggal, waktu) => {
      const [year, month, day] = tanggal.split('-');
      const [hour, minute] = waktu.split(':');
      return `${year}${month}${day}T${pad(hour)}${pad(minute)}00Z`;
    };

    const startDate = parseDateTime(tanggal_sidang, waktu_sidang);
    const startDateObj = new Date(`${tanggal_sidang}T${waktu_sidang}:00Z`);
    const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000);
    const endDate = `${endDateObj.getUTCFullYear()}${pad(endDateObj.getUTCMonth() + 1)}${pad(endDateObj.getUTCDate())}T${pad(endDateObj.getUTCHours())}${pad(endDateObj.getUTCMinutes())}00Z`;

    const url = `https://calendar.google.com/calendar/r/eventedit?text=Sidang Skripsi - ${encodeURIComponent(
      judul_skripsi
    )}&dates=${startDate}/${endDate}&details=Sidang Skripsi oleh ${encodeURIComponent(nama)}`;

    window.open(url, '_blank');
  };

  const fetchPengajuan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/pengajuan');
      if (!response.ok) throw new Error('Gagal mengambil data pengajuan');
      const data = await response.json();

      const mappedData = data
        .filter(item => item.mahasiswa?.nim === currentUser?.nim)
        .map(item => ({
          id: item.id,
          nama: item.mahasiswa?.nama || 'Tidak diketahui',
          nim: item.mahasiswa?.nim || '-',
          judulSkripsi: item.judulSkripsi || 'Belum tersedia',
          status: (item.status || '').toLowerCase(),
          alasanPenolakan: item.alasanPenolakan || null,
          berkasUrl: item.berkasUrl || null,
          tanggal: item.jadwalSidang?.tanggal
            ? new Date(item.jadwalSidang.tanggal).toISOString().split('T')[0]
            : 'Belum dijadwalkan',
          waktu: item.jadwalSidang?.waktu || 'Belum dijadwalkan',
          dosenPenguji1Id: item.jadwalSidang?.dosenPenguji1?.nama || 'Belum ditentukan',
          dosenPenguji2Id: item.jadwalSidang?.dosenPenguji2?.nama || 'Belum ditentukan',
        }));

      setPengajuan(mappedData);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
      setPengajuan([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setPengajuan([]);
      setLoading(false);
      return;
    }
    fetchPengajuan();
  }, [currentUser]);


  if (loading) {
    return (
      <div className="bg-gray flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-gray-500"></div>
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-red-100 p-6">
        <p className="text-red-600 text-lg font-semibold">Error: {error}</p>
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
                <span className="font-semibold">Judul Skripsi:</span> {item.judulSkripsi}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Tanggal Sidang:</span> {item.tanggal}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Waktu Sidang:</span> {item.waktu}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Dosen Penguji 1:</span> {item.dosenPenguji1Id}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Dosen Penguji 2:</span> {item.dosenPenguji2Id}
              </div>

              <div className="mt-4 flex items-center">
                {item.berkasUrl && (
                  <a
                    href={item.berkasUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-4 rounded text-blue-500 underline hover:text-blue-700"
                  >
                    Unduh Berkas
                  </a>
                )}

                {item.status === 'disetujui' &&
                  item.tanggal !== 'Belum dijadwalkan' &&
                  item.waktu !== 'Belum dijadwalkan' && (
                    <button
                      onClick={() =>
                        kirimKeGoogleCalendar({
                          nama: item.nama,
                          tanggal_sidang: item.tanggal,
                          waktu_sidang: item.waktu,
                          judul_skripsi: item.judulSkripsi,
                        })
                      }
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      Tambah ke Google Calendar
                    </button>
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

                {item.status === 'ditolak' && item.alasanPenolakan && (
                  <p className="text-md mt-4 text-red-500">
                    <b>Alasan Penolakan:</b> {item.alasanPenolakan}
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
