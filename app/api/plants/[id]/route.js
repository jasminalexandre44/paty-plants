import { NextResponse } from "next/server";
import { getData, saveData, uploadImage } from "@/lib/blob";
import { canManagePlant, readSession } from "@/lib/auth";

export async function GET(_request, { params }) {
  const data = await getData();
  const plant = data.find((p) => p.id === params.id);

  if (!plant) {
    return NextResponse.json({ error: "Tanaman tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(plant);
}

export async function PUT(request, { params }) {
  const session = readSession();
  const data = await getData();
  const index = data.findIndex((plant) => plant.id === params.id);
  if (index < 0) return NextResponse.json({ error: "Tanaman tidak ditemukan." }, { status: 404 });
  if (!canManagePlant(session, data[index])) return NextResponse.json({ error: "Kamu hanya dapat mengubah tanaman milikmu." }, { status: 403 });

  try {
    const formData = await request.formData();
    const current = data[index];
    const imageFile = formData.get("image");
    let imageUrl = current.imageUrl;
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) imageUrl = await uploadImage(imageFile);
    const split = (key) => (formData.get(key) || "").toString().split("\n").map((item) => item.trim()).filter(Boolean);
    const updated = {
      ...current,
      namaLokal: (formData.get("namaLokal") || current.namaLokal).toString().trim(),
      namaIlmiah: (formData.get("namaIlmiah") || "").toString().trim(),
      kategori: (formData.get("kategori") || "Lainnya").toString().trim(),
      imageUrl,
      ciri: (formData.get("ciri") || "").toString().trim(),
      manfaat: split("manfaat"),
      pemeliharaan: { id: split("pemeliharaanId"), en: split("pemeliharaanEn") },
    };
    data[index] = updated;
    await saveData(data);
    return NextResponse.json({ plant: updated });
  } catch (err) {
    console.error("Gagal mengubah tanaman:", err);
    return NextResponse.json({ error: "Gagal menyimpan perubahan." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const session = readSession();
  const data = await getData();
  const plant = data.find((item) => item.id === params.id);
  if (!plant) return NextResponse.json({ error: "Tanaman tidak ditemukan." }, { status: 404 });
  if (!canManagePlant(session, plant)) return NextResponse.json({ error: "Kamu hanya dapat menghapus tanaman milikmu." }, { status: 403 });
  await saveData(data.filter((item) => item.id !== params.id));
  return NextResponse.json({ ok: true });
}
