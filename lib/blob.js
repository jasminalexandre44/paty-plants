import { put, head } from "@vercel/blob";
import fs from "fs";
import path from "path";

const DATA_PATHNAME = "data/plants.json";
const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "plants.local.json");
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function seedData() {
  return [
    {
      id: "tulip",
      namaLokal: "Bunga Tulip",
      namaIlmiah: "Tulipa gesneriana",
      kategori: "Tanaman Hias",
      ownerId: "demo-admin",
      imageUrl: "",
      morfologi: {
        daun: "Panjang, agak lebar, berwarna hijau.",
        batang: "Tegak dan tidak bercabang.",
        bunga: "Berbentuk seperti cangkir, dengan berbagai warna.",
        akar: "Serabut.",
      },
      klasifikasi: {
        kingdom: "Plantae",
        divisi: "Magnoliophyta",
        kelas: "Liliopsida",
        ordo: "Liliales",
        famili: "Liliaceae",
        genus: "Tulipa",
        spesies: "Tulipa gesneriana",
      },
      manfaat: [
        "Sebagai tanaman hias.",
        "Mempercantik lingkungan sekolah.",
        "Bunga potong untuk dekorasi.",
      ],
      pemeliharaan: {
        id: [
          "Berikan sinar matahari yang cukup dan siram secukupnya.",
          "Gunakan tanah dengan drainase baik dan berikan pupuk secara berkala.",
        ],
        en: [
          "Provide enough sunlight and water the plant moderately.",
          "Use well-drained soil and fertilize it regularly.",
        ],
      },
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function getData() {
  if (useBlob) {
    try {
      const blob = await head(DATA_PATHNAME);
      // The pathname is stable, so bypass any CDN response cached after an overwrite.
      const res = await fetch(`${blob.url}?v=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) return seedData();
      return normalizeData(await res.json());
    } catch (err) {
      console.error("Gagal membaca data dari Vercel Blob:", err);
      return seedData();
    }
  }

  try {
    const raw = fs.readFileSync(LOCAL_DATA_PATH, "utf-8");
    return normalizeData(JSON.parse(raw));
  } catch {
    return seedData();
  }
}

export function normalizeData(data) {
  return (Array.isArray(data) ? data : []).map((plant) => ({
    ...plant,
    kategori: plant.kategori || "Lainnya",
    ownerId: plant.ownerId || "",
    pemeliharaan: Array.isArray(plant.pemeliharaan)
      ? { id: plant.pemeliharaan, en: [] }
      : { id: plant.pemeliharaan?.id || [], en: plant.pemeliharaan?.en || [] },
  }));
}

export async function saveData(data) {
  if (useBlob) {
    await put(DATA_PATHNAME, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  fs.mkdirSync(path.dirname(LOCAL_DATA_PATH), { recursive: true });
  fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify(data, null, 2));
}

export async function uploadImage(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (useBlob) {
    const blob = await put(`images/${filename}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });
    return blob.url;
  }

  fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
  fs.writeFileSync(path.join(LOCAL_UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}

export function isUsingBlob() {
  return useBlob;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
