import { NextResponse } from "next/server";
import { createPlant, createPlantId, getPlants, uploadImage } from "@/lib/storage";
import { readSession } from "@/lib/auth";

function splitLines(value) {
  return (value || "").toString().split("\n").map((line) => line.trim()).filter(Boolean);
}

export async function GET() {
  try {
    return NextResponse.json(await getPlants());
  } catch (error) {
    console.error("Gagal membaca tanaman:", error);
    return NextResponse.json({ error: "Database belum terhubung." }, { status: 503 });
  }
}

export async function POST(request) {
  try {
    const session = readSession();
    const formData = await request.formData();
    const namaLokal = (formData.get("namaLokal") || "").toString().trim();
    if (!namaLokal) return NextResponse.json({ error: "Nama lokal wajib diisi." }, { status: 400 });

    const imageFile = formData.get("image");
    let imageUrl = "";
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) imageUrl = await uploadImage(imageFile);

    const plant = {
      id: await createPlantId(namaLokal),
      namaLokal,
      namaIlmiah: (formData.get("namaIlmiah") || "").toString().trim(),
      kategori: (formData.get("kategori") || "Lainnya").toString().trim(),
      ownerId: session?.id || "public",
      imageUrl,
      ciri: (formData.get("ciri") || "").toString().trim(),
      morfologi: { daun: "", batang: "", bunga: "", akar: "" },
      klasifikasi: { kingdom: "", divisi: "", kelas: "", ordo: "", famili: "", genus: "", spesies: "" },
      manfaat: splitLines(formData.get("manfaat")),
      pemeliharaan: { id: splitLines(formData.get("pemeliharaanId")), en: splitLines(formData.get("pemeliharaanEn")) },
      createdAt: new Date().toISOString(),
      pendingEdit: null,
    };

    const savedPlant = await createPlant(plant);
    return NextResponse.json({ plant: savedPlant }, { status: 201 });
  } catch (error) {
    console.error("Gagal menambahkan tanaman:", error);
    return NextResponse.json({ error: "Gagal menyimpan tanaman ke penyimpanan lokal." }, { status: 500 });
  }
}
