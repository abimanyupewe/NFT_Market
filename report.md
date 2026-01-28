# Panduan & Skrip Video Tugas Akhir: NFT Marketplace

Dokumen ini berisi panduan langkah demi langkah dan skrip narasi untuk video presentasi tugas akhir Anda. Struktur disesuaikan dengan persyaratan: **Project Explanation, Demo, dan Code Walkthrough**.

## Persiapan
- **Durasi Maksimal**: 15 Menit.
- **Arsitektur**: Decoupled (Backend: Django REST Framework, Frontend: React/Vite).
- **Goal**: Menunjukkan pemahaman tentang pemisahan frontend-backend dan alur kerja aplikasi.

---

## Bagian 1: Penjelasan Singkat Project (Durasi: ~2-3 Menit)
**Visual**: Tampilkan slide presentasi sederhana atau halaman depan aplikasi (Landing Page).

**Poin Bicara (Skrip):**
"Halo, nama saya [Nama Anda]. Pada kesempatan ini saya akan mempresentasikan tugas akhir saya berupa aplikasi **NFT Marketplace**.

**1. Tujuan Aplikasi:**
Aplikasi ini bertujuan untuk menyediakan platform jual-beli aset digital (NFT) yang menghubungkan **Kreator** (Author) dan **Kolektor** (Customer). Kreator dapat meminting karya seni mereka menjadi NFT, dan Kolektor dapat membelinya menggunakan simulasi mata uang crypto.

**2. Fitur Utama:**
- **Multi-Role User**: Sistem membedakan antara 'Author' (Penjual) dan 'Customer' (Pembeli).
- **NFT Management**: Fitur untuk Minting (Upload), Listing, dan Buying NFT.
- **Wallet Simulation**: Tracking saldo dan total transaksi user.
- **API Documentation**: Dokumentasi lengkap menggunakan Swagger/Redoc.

**3. Alasan Arsitektur Decoupled:**
Saya memilih arsitektur **Decoupled** dimana Backend dan Frontend berdiri secara terpisah:
- **Backend**: Menggunakan Django dengan Django REST Framework (DRF) sebagai penyedia API yang kuat dan aman.
- **Frontend**: Menggunakan React (Vite) untuk antarmuka yang responsif dan interaktif.
- **Alasannya**: Pemisahan ini memungkinkan pengembangan yang independen (Separation of Concerns). Backend fokus pada logika bisnis dan data, sementara Frontend fokus pada UX. Selain itu, arsitektur ini memudahkan skalabilitas; jika di masa depan kita ingin membuat aplikasi Mobile (Flutter/Android), kita cukup mengonsumsi API yang sama tanpa mengubah backend."

---

## Bagian 2: Demo Project (Durasi: ~5-7 Menit)
**Visual**: Share Screen Browser (Aplikasi React berjalan).

**Skenario Demo:**

1.  **Registrasi & Login (Role: Author)**
    *   *Aksi*: Buka halaman Register. Buat akun baru sebagai 'Author'. Login.
    *   *Narasi*: "Pertama, kita demonstrasikan pendaftaran akun sebagai Creator. Setelah login, kita masuk ke Dashboard Author."

2.  **Minting / Create NFT**
    *   *Aksi*: Klik tombol 'Create NFT' atau sejenisnya. Upload gambar, isi Judul, Deskripsi, Harga. Klik Submit.
    *   *Narasi*: "Di sini Creator bisa mengunggah karya mereka. Data ini dikirim ke backend via API dan disimpan di database."

3.  **Viewing NFT (Role: Customer)**
    *   *Aksi*: Logout (atau buka Incognito window). Login sebagai 'Customer' (atau user lain). Browse Homepage. Klik salah satu NFT yang baru dibuat.
    *   *Narasi*: "Sekarang saya login sebagai Customer. Di Homepage, kita bisa melihat semua NFT yang *listed*. Kita pilih NFT yang baru saja dibuat tadi."

4.  **Transaction / Buying**
    *   *Aksi*: Klik tombol 'Buy'. Konfirmasi pembelian.
    *   *Narasi*: "Customer melakukan pembelian. Sistem akan memverifikasi saldo (simulasi) dan memindahkan kepemilikan NFT dari Author ke Customer. Status NFT berubah menjadi 'Sold' atau kepemilikan berpindah."

5.  **Profile & History**
    *   *Aksi*: Buka halaman Profile. Tunjukkan aset yang dimiliki.
    *   *Narasi*: "Di halaman profil, kita bisa melihat NFT yang sudah dibeli tadi. Ini menunjukkan data transaksi berhasil tersimpan."

---

## Bagian 3: Penjelasan Koding (Durasi: ~5 Menit)
**Visual**: Share Screen IDE (VS Code).

**Alur Penjelasan:**

1.  **Struktur Folder (Decoupling Concept)**
    *   *Aksi*: Tunjukkan root folder yang berisi `market` (Backend) dan `frontend_nft` (Frontend).
    *   *Narasi*: "Implementasi decouple terlihat dari struktur folder ini. `market` berisi project Django, dan `frontend_nft` berisi project React. Keduanya berjalan di port berbeda dan berkomunikasi via HTTP Request."

2.  **Backend (Django)**
    *   *Aksi*: Buka [market/marketplace/models.py](cci:7://file:///home/clara/Project/NFT_Market/market/marketplace/models.py:0:0-0:0).
    *   *Narasi*: "Di sisi Backend, saya menggunakan Django. Berikut adalah **Models**-nya.
        - [UserProfile](cci:2://file:///home/clara/Project/NFT_Market/market/marketplace/models.py:6:0-48:48): Memperluas user django untuk menyimpan Role (Author/Customer).
        - [NFT](cci:2://file:///home/clara/Project/NFT_Market/market/marketplace/models.py:80:0-122:25): Menyimpan data aset digital.
        - [Transaction](cci:2://file:///home/clara/Project/NFT_Market/market/marketplace/models.py:125:0-162:60): Mencatat riwayat perpindahan kepemilikan."
    *   *Aksi*: Buka [market/marketplace/serializers.py](cci:7://file:///home/clara/Project/NFT_Market/market/marketplace/serializers.py:0:0-0:0) (jika ada) atau `views.py`.
    *   *Narasi*: "Data dari models diubah menjadi JSON menggunakan **Serializers** agar bisa dikonsumsi frontend."
    *   *Aksi*: Buka [market/nft_market/urls.py](cci:7://file:///home/clara/Project/NFT_Market/market/nft_market/urls.py:0:0-0:0) atau akses browser ke `http://localhost:8000/api/schema/swagger-ui/`.
    *   *Narasi*: "Semua endpoint terdaftar di sini. Saya juga menggunakan `drf-spectacular` untuk men-generate dokumentasi Swagger secara otomatis, yang sangat membantu frontend developer."

3.  **Frontend (React)**
    *   *Aksi*: Buka `frontend_nft/src/components` atau `services`. Tunjukkan file yang memanggil API (misalnya `api.ts` atau penggunaan `axios`).
    *   *Narasi*: "Di sisi Frontend, dibangun menggunakan React + Vite. Komunikasi ke backend dilakukan menggunakan `Axios`. Contohnya di sini, frontend mengirim GET request ke endpoint `/api/nfts/` untuk mengambil daftar produk."

**Penutup:**
"Sekian presentasi mengenai project NFT Marketplace dengan arsitektur Decouple ini. Terima kasih."

---
**Tips Tambahan:**
- Pastikan server backend (`python manage.py runserver`) dan frontend (`npm run dev`) sudah jalan sebelum merekam.
- Siapkan data dummy sebelumnya agar demo terlihat lancar (jangan kosong sama sekali).
- Gunakan Swagger UI (`/api/schema/swagger-ui/`) saat penjelasan coding untuk membuktikan API-nya "Live" dan terdokumentasi rapi.