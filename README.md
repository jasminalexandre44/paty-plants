# Paty Plants 🌿

Katalog tanaman digital. Setiap tanaman punya halaman detail (nama lokal,
nama ilmiah, morfologi, klasifikasi taksonomi, manfaat, cara pemeliharaan)
dan QR code yang mengarah langsung ke halaman itu — cocok dicetak dan
ditempel di pot/tanaman aslinya.

Developer: **Raditia Erlangga Saputra** · Credit: © Respaty Dev

## Tentang penyimpanan data

Aplikasi memakai **Vercel Blob** sebagai penyimpanan permanen:

- `data/index.json` menyimpan index katalog agar beranda cepat.
- `data/plants/<id>.json` menyimpan detail setiap tanaman.
- `images/<nama-file>` menyimpan foto tanaman.

Tambah, edit, approval, dan hapus langsung mengubah Blob tanpa commit GitHub atau
redeploy Vercel. Saat development tanpa token, aplikasi tetap memakai file lokal.

## Menjalankan di lokal

```bash
npm install
npm run dev
```

Isi `.env.local` untuk mode permanen:

```env
BLOB_READ_WRITE_TOKEN=token-dari-vercel-blob
```

Buka [http://localhost:3000](http://localhost:3000). Untuk memindahkan data lokal
yang sudah ada ke Blob, jalankan satu kali:

```bash
npm run migrate:blob
```

## Deploy ke Vercel (lewat GitHub)

**1. Push project ke GitHub**

```bash
git init
git add .
git commit -m "Initial commit - Paty Plants"
git branch -M main
git remote add origin https://github.com/USERNAME/paty-plants.git
git push -u origin main
```

**2. Import ke Vercel**

- Buka [vercel.com](https://vercel.com) → **Add New → Project**
- Pilih repo `paty-plants` dari GitHub → **Import**
- Framework otomatis terdeteksi sebagai **Next.js**, langsung klik **Deploy**

**3. Aktifkan Vercel Blob**

- Buka Vercel → project → **Storage** → buat **Blob**.
- Hubungkan Blob ke project dan pastikan `BLOB_READ_WRITE_TOKEN` tersedia untuk Production.
- Redeploy satu kali setelah menambahkan token.
- Setelah itu, tambah/edit/hapus tanaman tidak membutuhkan redeploy lagi.

**5. (Opsional) Custom domain**

Tab **Settings → Domains** di dashboard Vercel.

## Struktur data tanaman

```json
{
  "id": "tulip",
  "namaLokal": "Bunga Tulip",
  "namaIlmiah": "Tulipa gesneriana",
  "kategori": "Tanaman Hias",
  "ownerId": "public",
  "imageUrl": "https://...",
  "morfologi": {
    "daun": "...",
    "batang": "...",
    "bunga": "...",
    "akar": "..."
  },
  "klasifikasi": {
    "kingdom": "Plantae",
    "divisi": "Magnoliophyta",
    "kelas": "Liliopsida",
    "ordo": "Liliales",
    "famili": "Liliaceae",
    "genus": "Tulipa",
    "spesies": "Tulipa gesneriana"
  },
  "manfaat": ["Sebagai tanaman hias.", "..."],
  "pemeliharaan": {
    "id": ["Berikan sinar matahari yang cukup."],
    "en": ["Provide enough sunlight."]
  }
}
```

## Struktur project

```
app/
  page.js              → beranda (daftar tanaman)
  plant/[id]/page.js    → halaman detail + QR code
  add/page.js           → form tambah tanaman
  api/plants/route.js   → GET semua tanaman, POST tanaman baru
  api/plants/[id]/route.js → GET satu tanaman
components/              → Navbar, Footer, PlantCard, QrCode
lib/storage.js              → adapter Vercel Blob dengan fallback lokal
scripts/migrate-local-to-blob.mjs → migrasi data lokal satu kali
```
