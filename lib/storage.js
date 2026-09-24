import { del, head, put } from "@vercel/blob";
import fs from "fs";
import path from "path";

const INDEX_PATH = "data/index.json";
const DATA_DIR = "data/plants";
const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "plants.local.json");
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const cache = { plants: null, expiresAt: 0 };
const plantCache = new Map();

function seedData() {
  return [{
    id: "tulip", namaLokal: "Bunga Tulip", namaIlmiah: "Tulipa gesneriana", kategori: "Tanaman Hias", ownerId: "demo-admin", imageUrl: "",
    morfologi: { daun: "Panjang, agak lebar, berwarna hijau.", batang: "Tegak dan tidak bercabang.", bunga: "Berbentuk seperti cangkir, dengan berbagai warna.", akar: "Serabut." },
    klasifikasi: { kingdom: "Plantae", divisi: "Magnoliophyta", kelas: "Liliopsida", ordo: "Liliales", famili: "Liliaceae", genus: "Tulipa", spesies: "Tulipa gesneriana" },
    manfaat: ["Sebagai tanaman hias.", "Mempercantik lingkungan sekolah."], pemeliharaan: { id: ["Berikan sinar matahari yang cukup."], en: ["Provide enough sunlight."] }, createdAt: new Date().toISOString(), pendingEdit: null,
  }];
}

function normalizePlant(plant) {
  if (!plant) return null;
  return { ...plant, kategori: plant.kategori || "Lainnya", ownerId: plant.ownerId || "public", manfaat: Array.isArray(plant.manfaat) ? plant.manfaat : [], pemeliharaan: Array.isArray(plant.pemeliharaan) ? { id: plant.pemeliharaan, en: [] } : { id: plant.pemeliharaan?.id || [], en: plant.pemeliharaan?.en || [] }, pendingEdit: plant.pendingEdit || null };
}

function clone(value) {
  return value ? JSON.parse(JSON.stringify(value)) : value;
}

function plantPath(id) {
  return `${DATA_DIR}/${id}.json`;
}

function blobPathFromUrl(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith("http")) return null;
  try {
    return new URL(imageUrl).pathname.replace(/^\//, "");
  } catch {
    return null;
  }
}

export async function removeImage(imageUrl) {
  if (!imageUrl) return;
  if (useBlob) {
    const pathname = blobPathFromUrl(imageUrl);
    if (pathname) await del(pathname);
    return;
  }
  if (imageUrl.startsWith("/uploads/")) {
    await fs.promises.unlink(path.join(process.cwd(), "public", imageUrl)).catch(() => undefined);
  }
}

async function readBlobJson(pathname, fallback) {
  try {
    const blob = await head(pathname);
    const response = await fetch(`${blob.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return fallback;
    return await response.json();
  } catch {
    return fallback;
  }
}

async function writeBlobJson(pathname, value) {
  await put(pathname, JSON.stringify(value, null, 2), { access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true });
}

async function getLocalPlants() {
  try {
    const raw = await fs.promises.readFile(LOCAL_DATA_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return seedData();
  }
}

export async function getPlants() {
  if (!useBlob) return (await getLocalPlants()).map(normalizePlant);
  if (cache.plants && cache.expiresAt > Date.now()) return clone(cache.plants);
  const plants = (await readBlobJson(INDEX_PATH, seedData())).map(normalizePlant);
  cache.plants = plants;
  cache.expiresAt = Date.now() + 5000;
  return clone(plants);
}

export async function getPlant(id) {
  if (!useBlob) return (await getPlants()).find((plant) => plant.id === id) || null;
  if (plantCache.has(id)) return clone(plantCache.get(id));
  const plant = normalizePlant(await readBlobJson(plantPath(id), null));
  if (!plant) return clone((await getPlants()).find((item) => item.id === id) || null);
  if (plant) plantCache.set(id, plant);
  return clone(plant);
}

async function saveIndex(plants) {
  const normalized = plants.map(normalizePlant);
  if (useBlob) await writeBlobJson(INDEX_PATH, normalized);
  else {
    await fs.promises.mkdir(path.dirname(LOCAL_DATA_PATH), { recursive: true });
    const temporaryPath = `${LOCAL_DATA_PATH}.${process.pid}.${Date.now()}.tmp`;
    await fs.promises.writeFile(temporaryPath, JSON.stringify(normalized, null, 2), "utf8");
    await fs.promises.rename(temporaryPath, LOCAL_DATA_PATH);
  }
  cache.plants = normalized;
  cache.expiresAt = Date.now() + 5000;
}

function clearCache(id, plant) {
  if (plant) plantCache.set(id, normalizePlant(plant));
  else plantCache.delete(id);
  cache.expiresAt = 0;
}

export async function createPlantId(name) {
  const plants = await getPlants();
  const base = name.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tanaman";
  const ids = new Set(plants.map((plant) => plant.id));
  if (!ids.has(base)) return base;
  let counter = 2;
  while (ids.has(`${base}-${counter}`)) counter += 1;
  return `${base}-${counter}`;
}

export async function createPlant(plant) {
  const plants = await getPlants();
  const ids = new Set(plants.map((item) => item.id));
  let id = plant.id;
  let counter = 2;
  while (ids.has(id)) id = `${plant.id}-${counter++}`;
  const saved = normalizePlant({ ...plant, id });
  if (useBlob) await writeBlobJson(plantPath(id), saved);
  else {
    await fs.promises.mkdir(path.dirname(LOCAL_DATA_PATH), { recursive: true });
  }
  await saveIndex([...plants, saved]);
  clearCache(id, saved);
  return saved;
}

export async function updatePlant(id, update) {
  const current = await getPlant(id);
  if (!current) return null;
  const updated = normalizePlant({ ...current, ...update });
  const plants = (await getPlants()).map((plant) => plant.id === id ? updated : plant);
  await Promise.all([
    useBlob ? writeBlobJson(plantPath(id), updated) : Promise.resolve(),
    saveIndex(plants),
  ]);
  if (current.imageUrl && current.imageUrl !== updated.imageUrl) await removeImage(current.imageUrl);
  clearCache(id, updated);
  return updated;
}

export async function deletePlant(id) {
  const current = await getPlant(id);
  if (!current) return false;
  const plants = (await getPlants()).filter((plant) => plant.id !== id);
  await Promise.all([
    useBlob ? del(plantPath(id)) : Promise.resolve(),
    saveIndex(plants),
    removeImage(current.imageUrl),
    removeImage(current.pendingEdit?.imageUrl),
  ]);
  clearCache(id);
  return true;
}

export async function uploadImage(file) {
  if (file.size > 8 * 1024 * 1024) throw new Error("Ukuran foto maksimal 8 MB.");
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  if (useBlob) {
    const blob = await put(`images/${filename}`, buffer, { access: "public", addRandomSuffix: false, contentType: file.type || "image/jpeg" });
    return blob.url;
  }
  await fs.promises.mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
  await fs.promises.writeFile(path.join(LOCAL_UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}
