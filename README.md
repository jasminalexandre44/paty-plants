# Paty Plants 🌿

Katalog tanaman digital. Setiap tanaman punya halaman detail (nama lokal,
nama ilmiah, morfologi, klasifikasi taksonomi, manfaat, cara pemeliharaan)
dan QR code yang mengarah langsung ke halaman itu — cocok dicetak dan
ditempel di pot/tanaman aslinya.

Developer: **Raditia Erlangga Saputra** · Credit: © Respaty Dev

## Tentang penyimpanan data

Aplikasi ini pakai **penyimpanan hybrid**, otomatis menyesuaikan tempat ia jalan:

- **Di komputer kamu (development):** data disimpan sebagai file JSON biasa
  di `data/plants.local.json`, dan foto disimpan di `public/uploads/`.
  Tidak perlu setup apa pun.
- **Di Vercel (production):** data & foto disimpan lewat **Vercel Blob
  Storage**. Ini wajib, karena server Vercel bersifat *serverless* — filesystem-nya
  tidak bisa ditulis secara permanen, jadi kalau tetap pakai file `.json` biasa,
  data tambahan akan hilang setiap kali server restart/redeploy.

Kamu tidak perlu ubah kode apa pun untuk beralih antara keduanya — aplikasi
otomatis mendeteksi lewat ada/tidaknya environment variable
`BLOB_READ_WRITE_TOKEN`.

## Menjalankan di lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Coba tambah tanaman
lewat menu **Tambah tanaman** — datanya akan tersimpan di
`data/plants.local.json`.

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

**3. Aktifkan Vercel Blob Storage (wajib, sekali saja)**

- Di dashboard project → tab **Storage** → **Create Database** → pilih **Blob**
- Setelah dibuat, klik **Connect Project** dan hubungkan ke project `paty-plants`
- Vercel otomatis menambahkan environment variable `BLOB_READ_WRITE_TOKEN`
- Buka tab **Deployments** → pada deployment terakhir klik **Redeploy** agar
  environment variable baru terpakai

Setelah langkah ini, website sudah bisa diakses publik dan fitur
**Tambah tanaman** akan tersimpan permanen.

**4. (Opsional) Custom domain**

Tab **Settings → Domains** di dashboard Vercel.

## Struktur data tanaman

```json
{
  "id": "tulip",
  "namaLokal": "Bunga Tulip",
  "namaIlmiah": "Tulipa gesneriana",
  "imageUrl": "https://...",
  "morfologi": { "daun": "...", "batang": "...", "bunga": "...", "akar": "..." },
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
  "pemeliharaan": ["Berikan sinar matahari yang cukup.", "..."]
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
lib/blob.js               → layer penyimpanan (hybrid local json / vercel blob)
data/plants.local.json    → dibuat otomatis saat dev lokal
```
