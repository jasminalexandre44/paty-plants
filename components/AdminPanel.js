"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPanel({ plants }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const pendingCount = plants.filter((plant) => plant.pendingEdit).length;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function review(id, action) {
    setBusyId(`${id}-${action}`);
    setError("");
    try {
      const response = await fetch(`/api/plants/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await response.json();
      if (!response.ok) return setError(result.error || "Review gagal diproses.");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setBusyId("");
    }
  }

  async function remove(id, name) {
    if (!window.confirm(`Hapus ${name}?`)) return;
    setBusyId(`${id}-delete`);
    setError("");
    try {
      const response = await fetch(`/api/plants/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) return setError(result.error || "Tanaman gagal dihapus.");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="mt-10">
      <div className="mb-6 flex justify-end"><button type="button" onClick={logout} className="action-button">Keluar admin</button></div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="stat-card"><span>Total tanaman</span><strong>{plants.length}</strong></div>
        <div className="stat-card"><span>Foto terisi</span><strong>{plants.filter((plant) => plant.imageUrl).length}</strong></div>
        <div className="stat-card"><span>Kategori</span><strong>{new Set(plants.map((plant) => plant.kategori)).size}</strong></div>
        <div className="stat-card"><span>Menunggu review</span><strong>{pendingCount}</strong></div>
      </div>
      {error && <p className="error-box mt-6">{error}</p>}
      <div className="mt-10 overflow-hidden rounded-soft border border-canopy/10 bg-white/60">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-canopy/10 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-bark/50"><span>Tanaman</span><span>Aksi</span></div>
        {plants.map((plant) => <div key={plant.id} className="grid gap-4 border-b border-canopy/10 px-5 py-4 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="font-medium text-canopy">{plant.namaLokal}</p><p className="text-sm text-bark/55">{plant.kategori} · pemilik: {plant.ownerId || "data lama"}</p>{plant.pendingEdit && <p className="mt-2 rounded-md bg-clay/10 px-3 py-2 text-sm text-clay">Ada usulan edit baru menunggu persetujuan.</p>}</div><div className="flex flex-wrap gap-2 sm:justify-end">{plant.pendingEdit && <><button disabled={busyId} onClick={() => review(plant.id, "approve")} className="action-button text-moss">{busyId === `${plant.id}-approve` ? "..." : "Setujui"}</button><button disabled={busyId} onClick={() => review(plant.id, "reject")} className="action-button text-clay">{busyId === `${plant.id}-reject` ? "..." : "Tolak"}</button></>}<Link href={`/plant/${plant.id}/edit`} className="action-button">Edit</Link><button disabled={busyId} onClick={() => remove(plant.id, plant.namaLokal)} className="action-button text-clay">{busyId === `${plant.id}-delete` ? "..." : "Hapus"}</button></div></div>)}
      </div>
    </div>
  );
}
