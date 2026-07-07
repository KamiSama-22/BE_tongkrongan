instalasi project : npm init -y
install express dan cors : npm install express cors
install typesript : npm install -D typescript @types/node @types/express @types/cors ts-node-dev
buat file tsconfig.json : npx tsc --init
npm install prisma
npm install dotenv
npm install @prisma/client
npx prisma init

npx prisma migrate dev --name nama bebas //jika ingin mengupdate atau menambahkan tabel yang sebelumnya di buat di schema.prisma

npm install @prisma/adapter-mariadb //menyambunngkan ke mariadb
rm -rf src/generated/prisma (linux,mac,dll)
npx prisma generate

npm install bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken

====================Frontend================================

npm install axios
npm install @tanstack/react-query

========================================rangkuman======================================================

# Portal Kuliner Kota Tegal
## Backend Progress

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT Authentication
- Multer (Upload Gambar)
- bcrypt (Hash Password)

---

# Database

Database sudah selesai.

Menggunakan Prisma dengan MySQL.

Schema sudah final.

Model yang digunakan:

- User
- Tenant
- Menu
- Galeri
- Kategori
- SubKategori
- TenantNilai
- Review
- Fasilitas
- Kepemilikan

---

# Revisi Database

## Fasilitas

Awalnya:

Tenant 1 - N TenantFasilitas

Direvisi menjadi:

Tenant 1 - N Kepemilikan
Fasilitas 1 - N Kepemilikan

Sehingga relasi menjadi Many-to-Many menggunakan tabel Kepemilikan.

Isi tabel Kepemilikan hanya:

- tenantId
- fasilitasId

Menggunakan Composite Primary Key / Composite Unique agar tidak ada data duplicate.

---

## Penilaian Fasilitas

Nilai fasilitas berasal dari poin pada tabel Fasilitas.

Tenant hanya memilih fasilitas yang dimiliki.

Total poin fasilitas akan dihitung kemudian dikonversi menjadi nilai SubKategori Fasilitas.

Kategori Fasilitas menggunakan SubKategori:

| Nama | Nilai | Rentang |
|------|------|----------|
| Sangat Kurang | 1 | 0-20 |
| Kurang | 2 | 21-40 |
| Cukup | 3 | 41-60 |
| Lengkap | 4 | 61-80 |
| Sangat Lengkap | 5 | 81-100 |

Yang digunakan dalam normalisasi adalah nilai 1-5.

Bukan nilai 0-100.

---

# Metode SPK

Aplikasi menyediakan tiga metode:

- SAW
- WP
- TOPSIS

Masing-masing metode dipisahkan menjadi service sendiri.

---

# Role

Ada tiga role.

- SUPER_ADMIN
- TENANT_ADMIN
- PENGGUNA

---

# Tampilan Aplikasi

Ada tiga tampilan utama.

1. Super Admin
2. Tenant Admin
3. Pengguna

---

# Struktur Backend

```
backend/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

Folder src nantinya berisi:

```
config/
controllers/
middleware/
routes/
services/
utils/
types/
uploads/
```

---

# Struktur Upload

```
uploads/
├── logo/
├── menu/
└── galeri/
```

---

# Arsitektur Backend

Frontend

↓

Routes

↓

Controller

↓

Service

↓

Prisma

↓

MySQL

↓

Response

Controller hanya menerima request.

Seluruh logika bisnis berada di Service.

---

# Endpoint

## Auth

POST /auth/login

POST /auth/register

---

## User

GET /users

POST /users

PUT /users/:id

DELETE /users/:id

---

## Tenant

GET /tenant

POST /tenant

PUT /tenant/:id

DELETE /tenant/:id

---

## Menu

GET /menu

POST /menu

PUT /menu/:id

DELETE /menu/:id

---

## Galeri

GET /galeri

POST /galeri

PUT /galeri/:id

DELETE /galeri/:id

---

## Kategori

GET /kategori

POST /kategori

PUT /kategori/:id

DELETE /kategori/:id

---

## SubKategori

GET /subKategori

POST /subKategori

PUT /subKategori/:id

DELETE /subKategori/:id

---

## Fasilitas

GET /fasilitas

POST /fasilitas

PUT /fasilitas/:id

DELETE /fasilitas/:id

---

## Kepemilikan

GET /kepemilikan

POST /kepemilikan

DELETE /kepemilikan

---

## Tenant Nilai

GET /tenantNilai

POST /tenantNilai

PUT /tenantNilai/:id

DELETE /tenantNilai/:id

---

## Review

GET /review

POST /review

PUT /review/:id/balas

DELETE /review/:id

---

## SPK

POST /spk/saw

POST /spk/wp

POST /spk/topsis

---

# Keputusan Penting

- Menggunakan TypeScript.
- Tidak menggunakan JavaScript lagi.
- Menggunakan Prisma sebagai ORM.
- Menggunakan JWT Authentication.
- Menggunakan Multer untuk upload gambar.
- Semua logika bisnis berada pada folder services.
- Setiap metode SPK dipisahkan menjadi service tersendiri.
- Database dianggap final, kecuali ada revisi dari dosen.

---

# Status Saat Ini

## Sudah Selesai

- Analisis kebutuhan
- ERD / Relasi Database
- Prisma Schema
- Struktur Backend
- tsconfig.json
- package.json
- node_modules
- Prisma Generate

## Belum Dikerjakan

- app.ts
- server.ts
- Config
- Middleware
- Authentication
- CRUD Seluruh Modul
- Upload File
- Implementasi SAW
- Implementasi WP
- Implementasi TOPSIS
- Testing API
- Dokumentasi API

---

# Urutan Pengerjaan (WAJIB)

1. app.ts
2. server.ts
3. config/prisma.ts
4. config/jwt.ts
5. config/multer.ts
6. middleware
7. Authentication
8. User
9. Kategori
10. SubKategori
11. Fasilitas
12. Kepemilikan
13. Tenant
14. Menu
15. Galeri
16. Review
17. TenantNilai
18. SAW
19. WP
20. TOPSIS
21. Testing
22. Dokumentasi