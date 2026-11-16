# LapakUMKM Backend

**Backend REST API untuk aplikasi LapakUMKM**, sebuah platform marketplace digital yang dirancang untuk membantu pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) memasarkan serta menjual produk secara online.

LapakUMKM menyediakan sistem pengelolaan produk, kategori, autentikasi pengguna, dan keranjang belanja dengan menggunakan Node.js, Express.js, dan PostgreSQL.

---

## Tentang Proyek

LapakUMKM merupakan aplikasi marketplace yang menghubungkan penjual dan pembeli dalam satu platform digital. Backend ini bertugas menangani proses pengolahan data, autentikasi, pengelolaan produk, serta komunikasi antara database dan aplikasi frontend.

Proyek ini dikembangkan dengan pendekatan REST API agar dapat digunakan oleh aplikasi mobile maupun desktop.

## Fitur Utama

### 1. Authentication
- Registrasi pengguna.
- Login pengguna.
- Autentikasi menggunakan JSON Web Token (JWT).
- Enkripsi password menggunakan bcrypt.
- Pengambilan profil pengguna.
- Sistem role pengguna.

### 2. User Roles

Terdapat tiga jenis pengguna dalam sistem:

| Role | Deskripsi |
|---|---|
| Admin | Mengelola dan mengawasi sistem marketplace. |
| Seller | Mengelola toko dan produk yang dijual. |
| Buyer | Melihat produk dan melakukan pembelian. |

### 3. Category Management
- Menampilkan daftar kategori.
- Menambahkan kategori.
- Mengubah kategori.
- Menghapus kategori.

### 4. Product Management
- Menampilkan daftar produk.
- Menampilkan detail produk.
- Menambahkan produk.
- Mengubah informasi produk.
- Menghapus produk.
- Mengelola stok dan harga.
- Upload gambar produk.

### 5. Shopping Cart
- Melihat isi keranjang.
- Menambahkan produk ke keranjang.
- Mengubah jumlah produk.
- Menghapus produk dari keranjang.
- Menghitung total harga belanja.

---

## Tech Stack

Teknologi yang digunakan dalam pengembangan backend LapakUMKM:

| Teknologi | Kegunaan |
|---|---|
| Node.js | Runtime JavaScript |
| Express.js | Backend framework |
| PostgreSQL | Relational database |
| node-postgres (pg) | Koneksi database |
| JWT | Autentikasi pengguna |
| bcryptjs | Enkripsi password |
| Multer | Upload gambar |
| dotenv | Pengelolaan environment variables |
| Nodemon | Development server |

---

## Project Structure

```text
backend/
│
├── config/
│   └── database.js
│
├── controllers/
│   ├── authController.js
│   ├── cartController.js
│   ├── categoryController.js
│   └── productController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   └── productRoutes.js
│
├── uploads/
│   └── .gitkeep
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

---

## Installation

Ikuti langkah berikut untuk menjalankan backend LapakUMKM secara lokal.

### 1. Clone Repository

```bash
git clone https://github.com/arsenio-19/lapakumkm-backend.git
```

### 2. Masuk ke Folder Backend

```bash
cd lapakumkm-backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Konfigurasi Environment Variables

Buat file `.env` di dalam folder backend.

Contoh konfigurasi (sesuaikan nama variabel dengan konfigurasi `config/database.js`):

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=LapakUMKM
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
```

Jangan mengunggah file `.env` ke GitHub karena berisi informasi konfigurasi dan kredensial pribadi.

### 5. Setup Database

Buat database PostgreSQL dengan nama:

```sql
CREATE DATABASE "LapakUMKM";
```

Pastikan tabel-tabel yang dibutuhkan aplikasi sudah dibuat sesuai struktur database backend.

### 6. Jalankan Development Server

```bash
npm run dev
```

Jika berhasil, server akan berjalan di:

```text
http://localhost:5000
```

---

## API Routes

Backend menyediakan beberapa kelompok endpoint REST API:

| Module | Base Endpoint | Fungsi |
|---|---|---|
| Authentication | `/api/auth` | Registrasi, login, dan profil pengguna |
| Categories | `/api/categories` | Pengelolaan kategori |
| Products | `/api/products` | Pengelolaan produk |
| Shopping Cart | `/api/cart` | Pengelolaan keranjang belanja |

Seluruh endpoint menggunakan format komunikasi HTTP dan pertukaran data JSON, kecuali endpoint yang memerlukan upload file.

---

## Development Workflow

Pengembangan proyek menggunakan Git Branching Workflow untuk memisahkan pengembangan setiap fitur.

| Branch | Deskripsi |
|---|---|
| `master` | Branch utama |
| `develop` | Branch integrasi |
| `feature/backend-setup` | Setup backend dan database |
| `feature/authentication` | Sistem autentikasi |
| `feature/category` | Pengelolaan kategori |
| `feature/product` | Pengelolaan produk dan upload gambar |
| `feature/shopping-cart` | Sistem keranjang belanja |

Setiap fitur dikembangkan melalui branch terpisah, kemudian digabungkan ke branch `develop` sebelum masuk ke branch utama.

---

## Project Status

**Development Status: In Progress**

Fitur yang sudah dikembangkan:
- [x] Backend setup
- [x] Database connection
- [x] Authentication
- [x] User roles
- [x] Category management
- [x] Product management
- [x] Image upload
- [x] Shopping cart

Pengembangan berikutnya:
- [ ] Checkout system
- [ ] Order management
- [ ] Payment integration
- [ ] Seller dashboard API
- [ ] Admin management API

---

## Repository

**GitHub:** [LapakUMKM Backend](https://github.com/arsenio-19/lapakumkm-backend)

---

## Developer

**LapakUMKM Development Team**

Developed as a marketplace application project focused on supporting digital transformation for Indonesian UMKM businesses.

---

<p align="center">
  <b>LapakUMKM — Empowering Local Businesses Through Digital Technology.</b>
</p>
