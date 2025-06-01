### **Sistem Informasi Jadwal Sidang Skripsi**

**Deskripsi Singkat**: Sistem ini dirancang untuk membantu mahasiswa dalam mengajukan jadwal sidang skripsi secara online dan memudahkan admin atau panitia sidang untuk mengelola jadwal, termasuk menugaskan dosen penguji. Mahasiswa dapat melihat jadwal sidang mereka setelah disetujui, sementara admin bertugas meninjau pengajuan dan mengatur jadwal sidang.

---

### **Tugas untuk Kelompok 11 (Front-end / Tampilan untuk Mahasiswa)**

#### **1. Halaman Utama**

- Menampilkan informasi umum tentang sistem pengajuan jadwal sidang, seperti:
  - Panduan pengajuan sidang.
  - Persyaratan berkas yang harus dilengkapi.
  - Batas waktu pendaftaran.
- Tombol navigasi ke:
  - Halaman pengajuan jadwal sidang.
  - Halaman jadwal sidang saya (setelah disetujui oleh admin).

---

#### **2. Halaman Form Pengajuan Sidang**

- Form untuk mengajukan jadwal sidang skripsi dengan field berikut:
  - Nama mahasiswa (opsional, auto-fill jika login).
  - NIM.
  - Judul skripsi.
  - Tanggal sidang yang diajukan.
  - Waktu sidang yang diajukan.
  - Upload berkas pendukung (contoh: file PDF skripsi, lembar persetujuan).
- Validasi form:
  - Semua field wajib diisi kecuali catatan tambahan.
  - Pastikan ukuran berkas yang diunggah tidak lebih dari 2 MB.
- Simpan data ke Firebase Firestore di koleksi **pengajuan_sidang**.
- Tampilkan notifikasi "Pengajuan berhasil dikirim, harap menunggu konfirmasi."

---

#### **3. Halaman Jadwal Sidang Saya**

- Tampilkan jadwal sidang yang telah disetujui oleh admin.
- Informasi yang ditampilkan:
  - Nama mahasiswa.
  - NIM.
  - Judul skripsi.
  - Tanggal dan waktu sidang.
  - Nama dosen penguji 1 dan 2.
- Tambahkan pesan "Pengajuan masih dalam proses" jika jadwal belum disetujui.

---

#### **4. Firebase Integration**

- Simpan data pengajuan sidang ke koleksi **pengajuan_sidang**.
- Ambil data jadwal sidang yang telah disetujui dari koleksi **jadwal_sidang**.

---

#### **5. Fitur Tambahan (Opsional)**

- Tambahkan fitur pengingat melalui email atau kalender (Google Calendar API) setelah jadwal sidang disetujui.
- Tambahkan filter untuk menampilkan jadwal berdasarkan status (disetujui/ditolak/dalam proses).

---

#### **Fitur Utama yang Harus Selesai**

1. Form pengajuan sidang yang terintegrasi dengan Firebase.
2. Menyimpan data pengajuan ke Firestore.
3. Menampilkan jadwal sidang setelah disetujui admin.

---

### **Struktur Firebase Firestore untuk Data Sidang**

**Koleksi**: `pengajuan_sidang`  
**Dokumen (contoh)**:

```json
{
  "id": "001",
  "nama": "Muhammad Aryandi",
  "nim": "123456789",
  "judul_skripsi": "Pengembangan Sistem Informasi Berbasis Web",
  "tanggal_pengajuan": "2024-11-20",
  "tanggal_sidang": "",
  "waktu_sidang": "",
  "status": "menunggu persetujuan",
  "berkas": "url_to_file"
}
```

**Koleksi**: `jadwal_sidang`  
**Dokumen (contoh)**:

```json
{
  "id": "sidang_001",
  "nama": "Muhammad Aryandi",
  "nim": "123456789",
  "judul_skripsi": "Pengembangan Sistem Informasi Berbasis Web",
  "tanggal_sidang": "2024-12-01",
  "waktu_sidang": "09:00",
  "penguji_1": "Dr. Andi Baso",
  "penguji_2": "Dr. Budi Santoso"
}
```

---

### **Integrasi Antar Kelompok**

1. **Standar Data**:
   - Kelompok admin bertugas memastikan data pengajuan dan jadwal sidang disimpan dengan format yang sesuai di Firestore.
   - Kelompok front-end bertugas menampilkan data ini kepada mahasiswa.
2. **API Firebase**:
   - Gunakan koleksi **pengajuan_sidang** untuk pengajuan mahasiswa.
   - Gunakan koleksi **jadwal_sidang** untuk jadwal sidang yang telah disetujui.
3. **Koordinasi**:
   - Pastikan kedua kelompok sepakat pada struktur data dan mekanisme alur kerja.

---

### **Estimasi Timeline (6 Minggu)**

#### **Kelompok 11: Front-end**

- **Minggu 1**: Setup repositori, install dependency, setup Firebase.
- **Minggu 2**: Membuat halaman form pengajuan sidang dan menyimpan data ke Firestore.
- **Minggu 3**: Menambahkan validasi form dan notifikasi pengajuan.
- **Minggu 4**: Membuat halaman jadwal sidang mahasiswa.
- **Minggu 5**: Testing fitur utama dan debugging.
- **Minggu 6**: Dokumentasi proyek front-end.

---

Jika ada tambahan atau revisi yang diperlukan, silakan beri tahu saya! 😊
# rekweb-client
