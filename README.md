# Mantri Duit

> Your Personal Financial Reality Checker.
> Aplikasi pencatat keuangan berbasis Chat & OCR dengan fitur "Reality Check" untuk menjaga kesehatan finansial Anda.

![Project Banner](docs/banner_placeholder.png)

## About The Project

Mantri Duit bukan sekadar aplikasi pencatat keuangan biasa (CRUD). Masalah utama generasi muda bukan pada cara mencatat, melainkan disiplin dan kesadaran.

Mantri Duit hadir dengan pendekatan "Chat-First" yang terasa interaktif, dilengkapi OCR untuk kemudahan input, dan fitur unggulan "Reality Check" yang memberikan feedback finansial berdasarkan kebiasaan belanja user.

### Key Features
* Chat-Based Entry: Catat pengeluaran semudah mengirim pesan (HTMX driven).
* Smart OCR: Scan struk belanja, otomatis terkonversi menjadi data transaksi.
* Reality Check: Analisis AI yang memberikan peringatan jika pengeluaran tidak wajar.
* Forest-Themed UI: Desain yang menenangkan namun modern.

---

## Tech Stack

Project ini dibangun dengan arsitektur Monolith yang modular dan scalable:

* Backend: Django (Python)
* Frontend Interactivity: HTMX
* Styling: Tailwind CSS + DaisyUI
* Database: SQLite (Dev) / PostgreSQL (Prod ready)
* OCR Engine: [Tesseract / Google Vision API]

---

## Getting Started

Ikuti langkah ini untuk menjalankan project di komputer lokal Anda.

### Prerequisites
Pastikan Anda sudah menginstall:
* Python 3.10 atau lebih baru
* Git

### 1. Clone Repository
```bash
git clone [https://github.com/username-anda/mantri-duit.git](https://github.com/username-anda/mantri-duit.git)
cd mantri-duit
2. Setup Virtual Environment
Disarankan menggunakan virtual environment agar dependencies tidak bentrok.

Windows:

Bash

python -m venv env
env\Scripts\activate
Mac / Linux:

Bash

python3 -m venv env
source env/bin/activate
3. Install Dependencies
Bash

pip install -r src/requirements.txt
4. Environment Configuration
Duplikasi file contoh .env untuk konfigurasi lokal.

Bash

cp .env.example .env
5. Database Setup
Masuk ke folder source dan jalankan migrasi.

Bash

cd src
python manage.py migrate
6. Run the Application
Bash

python manage.py runserver
Buka browser dan akses: https://www.google.com/search?q=http://127.0.0.1:8000/

Demo Video
Lihat demonstrasi fitur Mantri Duit dalam 30 detik:

[Link Video Demo]

Team
Dibuat oleh [Nama Tim/Nama Anda].
