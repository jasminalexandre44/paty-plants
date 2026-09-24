import { NextResponse } from "next/server";
import { getPlant, removeImage, updatePlant } from "@/lib/storage";
import { readSession } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const session = readSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Hanya admin yang dapat meninjau usulan." }, { status: 403 });

    const { action } = await request.json();
    if (!["approve", "reject"].includes(action)) return NextResponse.json({ error: "Aksi review tidak valid." }, { status: 400 });
    const current = await getPlant(params.id);
    if (!current) return NextResponse.json({ error: "Tanaman tidak ditemukan." }, { status: 404 });
    if (!current.pendingEdit) return NextResponse.json({ error: "Tidak ada usulan edit." }, { status: 409 });

    const update = action === "approve" ? { ...current.pendingEdit, pendingEdit: null } : { pendingEdit: null };
    if (action === "reject" && current.pendingEdit.imageUrl && current.pendingEdit.imageUrl !== current.imageUrl) {
      await removeImage(current.pendingEdit.imageUrl);
    }
    const plant = await updatePlant(params.id, update);
    return NextResponse.json({ plant });
  } catch (error) {
    console.error("Gagal memproses review:", error);
    return NextResponse.json({ error: "Gagal memproses usulan." }, { status: 500 });
  }
}
