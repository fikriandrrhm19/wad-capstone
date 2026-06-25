# WAD Task Management Platform - Milestone Project

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square\&logo=express\&logoColor=white)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma_ORM-2D3748?style=flat-square\&logo=prisma\&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square\&logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger_OpenAPI-85EA2D?style=flat-square\&logo=swagger\&logoColor=black)](https://swagger.io/)
![Status](https://img.shields.io/badge/Status-UTS%20Verified-success?style=flat-square)

RESTful API berbasis Node.js dan Express untuk manajemen tugas yang dilengkapi dengan autentikasi JWT, input validation Joi, dan dukungan untuk pengelolaan milestone perencanaan dan tracking progress task.

Proyek ini merupakan pengembangan lanjutan dari aplikasi **WAD Capstone** dan dikerjakan sebagai bagian dari **Ujian Tengah Semester (UTS)** mata kuliah **Web Advanced Development 2 (WADV2)** pada Program Studi S1 Sistem Informasi dan Teknologi, Fakultas Ilmu Komputer, Universitas Cakrawala.

## Features

Proyek ini mengimplementasikan fitur-fitur yang dibangun selama praktikum dan menambahkan modul Milestone sebagai kebutuhan khusus untuk UTS.

* **Project Structure & Environment Configuration (Week 1)**: Membangun struktur proyek Node.js dan Express, `.env` untuk konfigurasi environment, `.gitignore` untuk mengabaikan file yang tidak perlu di-track Git, dan `nodemon` untuk mendukung proses development.

* **Input Validation & Standardized Error Response (Week 2)**: Menggunakan **Joi** untuk memvalidasi data input sebelum diproses lebih lanjut. Pesan validasi menggunakan Bahasa Indonesia dan seluruh informasi error mengikuti format `{ error: { code, message, details } }`.

* **Database Relations & Data Integrity (Week 3)**: Menggunakan PostgreSQL dan Prisma ORM untuk mengelola relasi antar-entitas. Implementasi *foreign key* dan *referential actions* membantu menjaga konsistensi data saat terjadi perubahan/penghapusan record yang saling berhubungan.

* **Authentication & Session Management (Week 6)**: Menggunakan **Argon2id** untuk hashing password dan **JSON Web Token (JWT)** untuk autentikasi. Mendukung *access token*, *refresh token*, *token rotation*, dan *reuse detection* sesuai kebutuhan praktikum.

* **Security Hardening & Role-Based Authorization (Week 7)**: Mengamankan ekosistem API dengan **Helmet**, **CORS**, anti-XSS *input sanitization*, multi-tiered **Rate Limiting**, serta **RBAC** (*Role-Based Access Control*) dan *Resource Ownership Check*.

* **Milestone Module (UTS)**: Menambahkan entitas `Milestone` sebagai target pencapaian dalam proyek. Setiap milestone dapat memiliki beberapa task yang terhubung melalui relasi database.

## Backend Architecture

Aplikasi ini menggunakan *layered architecture* guna memisahkan responsibility setiap komponen sehingga kode lebih terstruktur dan mudah di-maintenance.

### Tech Stack

| Category          | Technology         | Tujuan                               |
| ----------------- | ------------------ | ------------------------------------ |
| Runtime           | Node.js (v20+)     | Running aplikasi backend             |
| Framework         | Express.js         | Routing, middleware, dan HTTP server |
| ORM               | Prisma ORM         | Akses dan pengelolaan database       |
| Database          | PostgreSQL         | Penyimpanan data relasional          |
| Authentication    | Argon2id, JWT      | Hashing password dan autentikasi     |
| Validation        | Joi                | Validasi request                     |
| API Documentation | Swagger UI Express | Dokumentasi API yang interaktif      |
| Security Hardening| Helmet, CORS       | Mengamankan HTTP headers & Cross-Origin requests |
| Rate Limiter      | express-rate-limit | Mencegah serangan Brute-Force & DoS              |
| Sanitization      | xss                | Membersihkan request body dari injeksi script XSS |

### Project Structure

```text
wad-capstone
├─ media/                                       # Dokumentasi dan screenshot pendukung UTS
│  ├─ erd/                                      # Diagram ERD database
│  ├─ prisma/                                   # Screenshot data Prisma Studio
│  └─ swagger/                                  # Screenshot Swagger UI
├─ postman_collections/
│  ├─ WAD-Capstone-Lab1-6.postman_collection.json  # Collection praktikum Week 1-6
│  ├─ WAD-Capstone-Lab7.postman_collection.json    # Collection praktikum Week 7
│  └─ WAD-Capstone-UTS.postman_collection.json     # Collection pengujian Milestone
├─ prisma/
│  ├─ migrations/                               # Riwayat migrasi database
│  ├─ schema.prisma                             # Definisi model dan relasi database
│  └─ seed.js                                   # Data awal (seed)
└─ src/
   ├─ config/                                   # Konfigurasi aplikasi dan Prisma
   ├─ controllers/                              # Handler request dan response
   ├─ docs/                                     # Konfigurasi Swagger
   ├─ middleware/                               # Authentication dan validation middleware
   ├─ repositories/                             # Database access layer
   ├─ routes/                                   # Definisi endpoint API
   └─ validators/                               # Schema validation Joi
```

## Entity Relationship Diagram (ERD)

<p align="center">
  <img src="media/erd/erd-database-specification.png" alt="ERD Database">
</p>

Diagram di atas menunjukkan struktur database dan relasi antar-entitas yang digunakan dalam aplikasi.

## Database Preview

Berikut tampilan data awal yang dihasilkan dari proses seeding database menggunakan Prisma Studio.

<p align="center">
  <img src="media/prisma/01-prisma-seed-initial.png" alt="Prisma Seed Data">
</p>

## Getting Started

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di environment lokal.

### Prerequisites

Pastikan perangkat Anda telah memenuhi kebutuhan berikut:

* Node.js v20 atau lebih baru
* PostgreSQL (lokal atau melalui Docker)
* npm sebagai package manager

### Installation

Clone repository dan install seluruh dependency yang diperlukan:

```bash
git clone https://github.com/fikriandrrhm19/wad-capstone.git
cd wad-capstone
npm install
```

### Environment Variables

Buat file `.env` pada root project dan sesuaikan value-nya dengan environment yang digunakan:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:postgres_password@localhost:5432/wad_capstone_db?schema=public"

JWT_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

### Database Setup

Jalankan migrasi database dan seed data awal:

```bash
npx prisma migrate dev
npx prisma db seed
```

Data seed mencakup user, category, milestone, dan task untuk kebutuhan pengujian.

### Run the Application

Jalankan server dalam mode development:

```bash
npm run dev
```

Secara default aplikasi akan running pada:

```text
http://localhost:3000
```

## API Documentation

Dokumentasi API tersedia melalui Swagger UI dan mencakup seluruh endpoint autentikasi, task, category, dan milestone.

```text
http://localhost:3000/api/docs
```

<p align="center">
  <img src="media/swagger/01-swagger-milestones-overview.png" alt="Swagger Overview">
</p>

## Testing

Tabel berikut merangkum skenario pengujian yang ada pada collection **WAD-Capstone-UTS.postman_collection.json**.

| No | Test Case                | Method   | Endpoint               | Expected Status    | Description                                                                                                  |
| -- | ------------------------ | -------- | ---------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------ |
| 1  | Authenticate User        | `POST`   | `/auth/login`          | `200 OK`           | Login menggunakan akun yang tersedia pada data seed dan memperoleh JWT access token.                         |
| 2  | Block Guest Request      | `GET`    | `/api/v1/milestones`   | `401 Unauthorized` | Memastikan endpoint milestone tidak dapat diakses tanpa autentikasi.                                         |
| 3  | List All User Milestones | `GET`    | `/api/v1/milestones`   | `200 OK`           | Mengambil seluruh milestone milik pengguna yang sedang login beserta relasi task terkait.                    |
| 4  | Validate Missing Title   | `POST`   | `/api/v1/milestones`   | `400 Bad Request`  | Memastikan validasi Joi menolak request tanpa field `title`.                                                 |
| 5  | Validate Corrupted Date  | `POST`   | `/api/v1/milestones`   | `400 Bad Request`  | Memastikan validasi Joi menolak format tanggal yang tidak valid.                                             |
| 6  | Create Milestone         | `POST`   | `/api/v1/milestones`   | `201 Created`      | Membuat data milestone baru.                                                                                 |
| 6b | Link Task to Milestone   | `PATCH`  | `/api/v1/tasks/18`      | `200 OK`           | Menghubungkan task ke milestone melalui field `milestoneId`.                                                 |
| 7  | Data Isolation Security  | `GET`    | `/api/v1/milestones/4` | `404 Not Found`    | Memastikan pengguna tidak dapat mengakses milestone milik pengguna lain.                                     |
| 8  | Partial Update Status    | `PATCH`  | `/api/v1/milestones/11` | `200 OK`           | Memperbarui status milestone menjadi `ACHIEVED`.                                                             |
| 8b | Reject Empty PATCH       | `PATCH`  | `/api/v1/milestones/11` | `400 Bad Request`  | Memastikan request update dengan body kosong akan ditolak oleh validator.                                         |
| 9  | Delete Milestone Data    | `DELETE` | `/api/v1/milestones/11` | `200 OK`           | Menghapus data milestone dari database.                                                                      |
| 10 | Verify SetNull Behavior  | `GET`    | `/api/v1/tasks/18`      | `200 OK`           | Memastikan penghapusan milestone tidak menghapus task yang terkait dan `milestoneId` berubah menjadi `null`. |

## License

This project is licensed under the MIT License.
See the LICENSE file for details.