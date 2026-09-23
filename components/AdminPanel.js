"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPanel({ plants }) {
  const router = useRouter();
  const [error, setError] = useState("");
  async function remove(id, name) {
    if (!window.confirm(`Hapus ${name}?`)) return;
    const response = await fetch(`/api/plants/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) return setError(result.error);
    router.refresh();
  }
  return <div className="mt-10"><div className="grid gap-4 sm:grid-cols-3"><div className="stat-card"><span>Total tanaman</span><strong>{plants.length}</strong></div><div className="stat-card"><span>Foto terisi</span><strong>{plants.filter((plant) => plant.imageUrl).length}</strong></div><div className="stat-card"><span>Kategori</span><strong>{new Set(plants.map((plant) => plant.kategori)).size}</strong></div></div>{error && <p className="error-box mt-6">{error}</p>}<div className="mt-10 overflow-hidden rounded-soft border border-canopy/10 bg-white/60"><div className="grid grid-cols-[1fr_auto] gap-4 border-b border-canopy/10 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-bark/50"><span>Tanaman</span><span>Aksi</span></div>{plants.map((plant) => <div key={plant.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-canopy/10 px-5 py-4 last:border-0"><div><p className="font-medium text-canopy">{plant.namaLokal}</p><p className="text-sm text-bark/55">{plant.kategori} · pemilik: {plant.ownerId || "data lama"}</p></div><div className="flex gap-2"><Link href={`/plant/${plant.id}/edit`} className="action-button">Edit</Link><button onClick={() => remove(plant.id, plant.namaLokal)} className="action-button text-clay">Hapus</button></div></div>)}</div></div>;
}
