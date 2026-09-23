"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["Tanaman Pangan", "Tanaman Hias", "Tanaman Obat", "Tanaman Perkebunan", "Tanaman Buah", "Lainnya"];
const input = "form-input";

export default function AddPlantPage() {
  const router = useRouter();
  const [form, setForm] = useState({ kategori: categories[0], namaLokal: "", namaIlmiah: "", ciri: "", manfaat: "", pemeliharaanId: "", pemeliharaanEn: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    if (!form.namaLokal.trim()) return setError("Nama tanaman wajib diisi.");
    setSaving(true); setError("");
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);
    try {
      const response = await fetch("/api/plants", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Tanaman gagal disimpan."); setSaving(false); return; }
      router.push(`/plant/${result.plant.id}`); router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
      setSaving(false);
    }
  }

  return <main className="mx-auto max-w-3xl px-6 py-14"><span className="tag-chip">Data tanaman</span><h1 className="mt-4 font-display text-4xl text-canopy">Tambah tanaman</h1><p className="mt-2 text-bark/60">Isi informasi yang akan tampil pada halaman QR tanaman.</p><form onSubmit={submit} className="mt-10 space-y-8"><section><label className="form-label">Foto tanaman</label><input type="file" accept="image/*" className={input} onChange={(e) => setImage(e.target.files?.[0] || null)} /></section><section className="grid gap-5 sm:grid-cols-2"><div><label className="form-label">Jenis tanaman</label><select className={input} value={form.kategori} onChange={update("kategori")}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div><div><label className="form-label">Nama tanaman</label><input required className={input} value={form.namaLokal} onChange={update("namaLokal")} placeholder="Contoh: Padi" /></div><div className="sm:col-span-2"><label className="form-label">Nama ilmiah</label><input className={input} value={form.namaIlmiah} onChange={update("namaIlmiah")} placeholder="Contoh: Oryza sativa" /></div></section><section><label className="form-label">Ciri-ciri tanaman</label><textarea rows={5} className={input} value={form.ciri} onChange={update("ciri")} placeholder="Jelaskan ciri daun, batang, bunga, akar, atau ciri khas lainnya." /></section><section><label className="form-label">Manfaat</label><textarea rows={5} className={input} value={form.manfaat} onChange={update("manfaat")} placeholder="Satu manfaat per baris." /></section><section className="grid gap-5 sm:grid-cols-2"><div><label className="form-label">Cara perawatan (Bahasa Indonesia)</label><textarea required rows={7} className={input} value={form.pemeliharaanId} onChange={update("pemeliharaanId")} placeholder="Satu langkah per baris." /></div><div><label className="form-label">Care instructions (English)</label><textarea required rows={7} className={input} value={form.pemeliharaanEn} onChange={update("pemeliharaanEn")} placeholder="One step per line." /></div></section>{error && <p className="error-box">{error}</p>}<button disabled={saving} className="primary-button w-full">{saving ? "Menyimpan..." : "Simpan tanaman"}</button></form></main>;
}
