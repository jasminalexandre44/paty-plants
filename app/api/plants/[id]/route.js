import { NextResponse } from "next/server";
import { getData } from "@/lib/blob";

export async function GET(_request, { params }) {
  const data = await getData();
  const plant = data.find((p) => p.id === params.id);

  if (!plant) {
    return NextResponse.json({ error: "Tanaman tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(plant);
}
