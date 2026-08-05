# Personal Finance Tracker

Finance Tracker adalah aplikasi manajemen keuangan personal yang dirancang untuk membantu pengguna mencatat transaksi, mengelola anggaran, memantau target tabungan, dan melihat performa keuangan secara visual. Aplikasi ini dibangun dengan Next.js dan dirancang agar sederhana, cepat, dan mudah digunakan.

## Fitur Utama

- Pencatatan transaksi harian
- Pengelompokan transaksi berdasarkan kategori
- Ringkasan pengeluaran dan pemasukan
- Grafik bulanan untuk memantau tren keuangan
- Target tabungan yang dapat dipantau progresnya
- Export data ke format CSV/PDF
- Antarmuka yang responsif untuk desktop dan mobile

## Teknologi yang Digunakan

- Next.js
- React
- Prisma
- Tailwind CSS
- PostgreSQL

## Struktur Proyek

- src/app: halaman aplikasi dan routing
- src/components: komponen UI reusable
- src/features: modul bisnis seperti transaksi, dashboard, dan autentikasi
- src/lib: konfigurasi dan utilitas
- src/prisma: skema database

## Cara Menjalankan

1. Clone repository:
   ```bash
   git clone <repository-url>
   ```
2. Masuk ke direktori proyek:
   ```bash
   cd 01-finance-tracker
   ```
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Jalankan aplikasi dalam mode development:
   ```bash
   npm run dev
   ```
5. Buka aplikasi di browser:
   ```bash
   http://localhost:3000
   ```

## Kontribusi

Kontribusi sangat terbuka untuk pengembangan fitur, perbaikan bug, maupun peningkatan kualitas aplikasi. Silakan buat branch baru sebelum mengirim pull request.

## Lisensi

Proyek ini tersedia untuk keperluan pengembangan dan pembelajaran.
