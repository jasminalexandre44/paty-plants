import { NextResponse } from "next/server";
import { getData, saveData, uploadImage, slugify } from "@/lib/blob";

export async function GET() {
  const data = await getData();
  return NextResponse.json(data);
}

function splitLines(value) {
  return (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const namaLokal = (formData.get("namaLokal") || "").toString().trim();
    if (!namaLokal) {
      return NextResponse.json(
        { error: "Nama lokal wajib diisi." },
        { status: 400 }
      );
    }

    const data = await getData();

    const baseSlug = slugify(namaLokal) || "tanaman";
    let id = baseSlug;
    let counter = 2;
    while (data.some((p) => p.id === id)) {
      id = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const imageFile = formData.get("image");
    let imageUrl = "";
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    const newPlant = {
      id,
      namaLokal,
      namaIlmiah: (formData.get("namaIlmiah") || "").toString().trim(),
      imageUrl,
      morfologi: {
        daun: (formData.get("daun") || "").toString().trim(),
        batang: (formData.get("batang") || "").toString().trim(),
        bunga: (formData.get("bunga") || "").toString().trim(),
        akar: (formData.get("akar") || "").toString().trim(),
      },
      klasifikasi: {
        kingdom: (formData.get("kingdom") || "").toString().trim(),
        divisi: (formData.get("divisi") || "").toString().trim(),
        kelas: (formData.get("kelas") || "").toString().trim(),
        ordo: (formData.get("ordo") || "").toString().trim(),
        famili: (formData.get("famili") || "").toString().trim(),
        genus: (formData.get("genus") || "").toString().trim(),
        spesies: (formData.get("spesies") || "").toString().trim(),
      },
      manfaat: splitLines(formData.get("manfaat")),
      pemeliharaan: splitLines(formData.get("pemeliharaan")),
      createdAt: new Date().toISOString(),
    };

    data.push(newPlant);
    await saveData(data);

    return NextResponse.json({ plant: newPlant }, { status: 201 });
  } catch (err) {
    console.error("Gagal menambahkan tanaman:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan di server saat menyimpan tanaman." },
      { status: 500 }
    );
  }
}
