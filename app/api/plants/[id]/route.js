import { NextResponse } from "next/server";
import { deletePlant, getPlant, updatePlant, uploadImage } from "@/lib/storage";
import { readSession } from "@/lib/auth";
import { rateLimit, requestKey } from "@/lib/rateLimit";

export async function GET(_request, { params }) {
  try {
    const plant = await getPlant(params.id);
    if (!plant) return NextResponse.json({ error: "Tanaman tidak ditemukan." }, { status: 404 });
    return NextResponse.json(plant);
  } catch (error) {
    console.error("Gagal membaca tanaman:", error);
    return NextResponse.json({ error: "Database belum terhubung." }, { status: 503 });
  }
}

function splitLines(value) {
  return (value || "").toString().split("\n").map((item) => item.trim()).filter(Boolean);
}

export async function PUT(request, { params }) {
  try {
    const session = readSession();
    if (!session) {
      const limit = rateLimit(requestKey(request, "edit-plant"), 10);
      if (!limit.ok) return NextResponse.json({ error: `Terlalu banyak usulan. Coba lagi dalam ${limit.retryAfter} detik.` }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
    }
    const current = await getPlant(params.id);
    if (!current) return NextResponse.json({ error: "Tanaman tidak ditemukan." }, { status: 404 });

    const formData = await request.formData();
    const imageFile = formData.get("image");
    let imageUrl = current.imageUrl || "";
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) imageUrl = await uploadImage(imageFile);

    const changes = {
      namaLokal: (formData.get("namaLokal") || current.namaLokal).toString().trim(),
      namaIlmiah: (formData.get("namaIlmiah") || "").toString().trim(),
      kategori: (formData.get("kategori") || "Lainnya").toString().trim(),
      imageUrl,
      ciri: (formData.get("ciri") || "").toString().trim(),
      manfaat: splitLines(formData.get("manfaat")),
      pemeliharaan: { id: splitLines(formData.get("pemeliharaanId")), en: splitLines(formData.get("pemeliharaanEn")) },
    };
    if (!changes.pemeliharaan.id.length || !changes.pemeliharaan.en.length) return NextResponse.json({ error: "Cara perawatan Bahasa Indonesia dan English wajib diisi." }, { status: 400 });

    if (!session || session.role !== "admin") {
      await updatePlant(params.id, { pendingEdit: { ...changes, id: params.id, submittedAt: new Date().toISOString() } });
      return NextResponse.json({ pending: true, message: "Usulan edit dikirim dan menunggu persetujuan admin." });
    }

    const plant = await updatePlant(params.id, { ...changes, pendingEdit: null });
    return NextResponse.json({ plant });
  } catch (error) {
    console.error("Gagal mengubah tanaman:", error);
    return NextResponse.json({ error: "Gagal menyimpan perubahan." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = readSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Hanya admin yang dapat menghapus tanaman." }, { status: 403 });
    const deleted = await deletePlant(params.id);
    if (!deleted) return NextResponse.json({ error: "Tanaman tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Gagal menghapus tanaman:", error);
    return NextResponse.json({ error: "Gagal menghapus tanaman." }, { status: 500 });
  }
}
