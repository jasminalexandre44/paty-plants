import fs from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) throw new Error("BLOB_READ_WRITE_TOKEN belum diatur.");

const dataPath = path.join(process.cwd(), "data", "plants.local.json");
const plants = JSON.parse(await fs.readFile(dataPath, "utf8"));
const normalized = plants.map((plant) => ({
  ...plant,
  kategori: plant.kategori || "Lainnya",
  ownerId: plant.ownerId || "public",
  manfaat: Array.isArray(plant.manfaat) ? plant.manfaat : [],
  pemeliharaan: Array.isArray(plant.pemeliharaan) ? { id: plant.pemeliharaan, en: [] } : { id: plant.pemeliharaan?.id || [], en: plant.pemeliharaan?.en || [] },
  pendingEdit: plant.pendingEdit || null,
}));

for (const plant of normalized) {
  await put(`data/plants/${plant.id}.json`, JSON.stringify(plant, null, 2), { token, access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true });
}
await put("data/index.json", JSON.stringify(normalized, null, 2), { token, access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true });
console.log(`Migrated ${normalized.length} plants to Vercel Blob.`);
