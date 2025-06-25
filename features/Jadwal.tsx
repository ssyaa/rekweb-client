'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import React from 'react';

interface SubmissionItem {
  id: string;
  name: string;
  nim: string;
  thesis_title: string;
  status: string;
  reason_rejected?: string | null;
  file_url?: string | null;
  date: string;
  time: string;
  examiner_1_id: string;
  examiner_2_id: string;
}

const Jadwal = () => {
    const { user } = useUser();
    const [submission, setSubmission] = useState<SubmissionItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubmission = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:3002/auth/me', {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Gagal mengambil data user');

        const result = await response.json();
        const user = result.user;

        console.log(user.student?.thesis_submission);
        const submissions = user.student?.thesis_submission || [];

        if (submissions.length === 0) {
          setSubmission([]);
          return;
        }

        const mapped: SubmissionItem[] = submissions.map((submission: any) => ({
          id: submission.id,
          name: user.student.name,
          nim: user.student.nim,
          thesis_title: submission.thesis_title,
          status: submission.status.toLowerCase(),
          reason_rejected: submission.reason_rejected,
          file_url: submission.file_url,
          date: submission.date
            ? new Date(submission.date).toISOString().split('T')[0]
            : 'Belum dijadwalkan',
          time: submission.time || 'Belum dijadwalkan',
          examiner_1_id: submission.examiner_1?.name || 'Belum ditentukan',
          examiner_2_id: submission.examiner_2?.name || 'Belum ditentukan',
        }));

        setSubmission(mapped);
      } catch (err: any) {
        console.error('Error fetching submission:', err);
        setError(err.message || 'Terjadi kesalahan');
        setSubmission([]);
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    if (!user) {
      setSubmission([]);
      setLoading(false);
      return;
    }
    fetchSubmission();
  }, [user]);

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
        {submission.length > 0 ? (
          submission.map((item) => (
            <div
              key={item.id}
              className="mb-6 w-full rounded-md border-2 border-gray-100 bg-white p-6 shadow-md"
            >
              <div className="text-md mb-2">
                <span className="font-semibold">Nama:</span> {item.name}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">NIM:</span> {item.nim}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Judul Skripsi:</span> {item.thesis_title}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Tanggal Sidang:</span> {item.date}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Waktu Sidang:</span> {item.time}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Dosen Penguji 1:</span> {item.examiner_1_id}
              </div>
              <div className="text-md mb-2">
                <span className="font-semibold">Dosen Penguji 2:</span> {item.examiner_2_id}
              </div>

              <div className="mt-4 flex items-center">
                {item.file_url && (
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-4 rounded text-blue-500 underline hover:text-blue-700"
                  >
                    Unduh Berkas
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
                  <b>Status: {item.status.toUpperCase()}</b>
                </p>

                {item.status === 'ditolak' && item.reason_rejected && (
                  <p className="text-md mt-4 text-red-500">
                    <b>Alasan Penolakan:</b> {item.reason_rejected}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="flex w-full items-center justify-center text-center text-lg text-black">
            <i>Tidak ada data submission.</i>
          </p>
        )}
      </div>
    </div>
  );
};

export default Jadwal;
