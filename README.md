# 📚 Sistem Informasi Jadwal Sidang Skripsi – Front-end Mahasiswa (Kelompok 11)

Proyek ini merupakan bagian dari sistem informasi berbasis web yang membantu mahasiswa dalam melakukan **pengajuan jadwal sidang skripsi secara online** dan melihat jadwal sidang setelah disetujui oleh admin.

---

## 🚀 Fitur Utama Mahasiswa

### ✅ Halaman Utama
- Menampilkan informasi umum:
  - Panduan pengajuan sidang
  - Persyaratan berkas
  - Batas waktu pendaftaran
- Navigasi:
  - Ajukan Sidang
  - Jadwal Sidang Saya

---

### ✅ Form Pengajuan Sidang
- Field input:
  - Nama mahasiswa (auto dari login, jika ada)
  - NIM
  - Judul skripsi
  - Tanggal dan waktu sidang
  - Upload file berkas (maks 2MB, format PDF)
- Validasi form wajib diisi.
- Kirim data ke endpoint:

- Tampilkan notifikasi:
> “Pengajuan berhasil dikirim, harap menunggu konfirmasi.”

---

### ✅ Jadwal Sidang Saya
- Menampilkan data sidang yang telah disetujui:
- Nama mahasiswa
- NIM
- Judul skripsi
- Tanggal & waktu sidang
- Dosen Penguji 1 & 2
- Jika belum disetujui:
> “Pengajuan masih dalam proses.”

- Mengambil data dari endpoint:

---

## 🧩 Integrasi Back-end (NestJS + Prisma)

### 📂 Struktur Data Prisma

#### `pengajuan_sidang`
| Kolom             | Tipe                     |
|-------------------|--------------------------|
| id                | String (UUID)            |
| nama              | String                   |
| nim               | String                   |
| judul_skripsi     | String                   |
| tanggal_pengajuan | DateTime                 |
| tanggal_sidang    | DateTime (nullable)      |
| waktu_sidang      | String (nullable)        |
| status            | Enum: `menunggu`, `disetujui`, `ditolak` |
| berkas            | String (URL/path)        |

#### `jadwal_sidang`
| Kolom             | Tipe         |
|-------------------|--------------|
| id                | String (UUID)|
| nama              | String       |
| nim               | String       |
| judul_skripsi     | String       |
| tanggal_sidang    | DateTime     |
| waktu_sidang      | String       |
| penguji_1         | String       |
| penguji_2         | String       |

> Data yang disetujui akan dipindahkan dari `pengajuan_sidang` ke `jadwal_sidang` oleh admin.

---

## 🛠️ Teknologi yang Digunakan
- Front-end: [React/Next.js/Angular/etc.]
- Back-end: NestJS
- ORM: Prisma
- Database: MySQL
- Autentikasi (opsional): JWT / Session
