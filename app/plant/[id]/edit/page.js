"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { compressImage } from "@/lib/compressImage";

const categories = ["Tanaman Pangan", "Tanaman Hias", "Tanaman Obat", "Tanaman Perkebunan", "Tanaman Buah", "Lainnya"];

export default function EditPlantPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => { fetch(`/api/plants/${id}`).then((response) => response.json()).then((plant) => setForm({ ...plant, ciri: plant.ciri || "", manfaat: (plant.manfaat || []).join("\n"), pemeliharaanId: (plant.pemeliharaan?.id || []).join("\n"), pemeliharaanEn: (plant.pemeliharaan?.en || []).join("\n") })); }, [id]);
  if (!form) return <main className="mx-auto max-w-3xl px-6 py-14">Memuat data...</main>;
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  async function submit(event) { event.preventDefault(); setError(""); setNotice(""); const data = new FormData(); ["kategori", "namaLokal", "namaIlmiah", "ciri", "manfaat", "pemeliharaanId", "pemeliharaanEn"].forEach((key) => data.append(key, form[key] || "")); try { if (image) data.append("image", await compressImage(image)); const response = await fetch(`/api/plants/${id}`, { method: "PUT", body: data }); const result = await response.json(); if (!response.ok) return setError(result.error || "Usulan edit gagal dikirim."); if (result.pending) { setNotice(result.message); return; } router.push("/?updated=1"); router.refresh(); } catch { setError("Tidak dapat terhubung ke server. Coba lagi."); } }
  return <main className="mx-auto max-w-3xl px-6 py-14"><span className="tag-chip">Usulan perubahan</span><h1 className="mt-4 font-display text-4xl text-canopy">Usulkan edit tanaman</h1><p className="mt-2 text-bark/60">Perubahan akan diperiksa admin sebelum tampil di website.</p><form onSubmit={submit} className="mt-10 space-y-6"><div><label className="form-label">Ganti foto</label><input type="file" accept="image/*" className="form-input" onChange={(e) => setImage(e.target.files?.[0] || null)} /></div><div className="grid gap-5 sm:grid-cols-2"><div><label className="form-label">Jenis tanaman</label><select className="form-input" value={form.kategori} onChange={update("kategori")}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div><div><label className="form-label">Nama tanaman</label><input className="form-input" value={form.namaLokal} onChange={update("namaLokal")} /></div></div><div><label className="form-label">Nama ilmiah</label><input className="form-input" value={form.namaIlmiah} onChange={update("namaIlmiah")} /></div><div><label className="form-label">Ciri-ciri tanaman</label><textarea rows={5} className="form-input" value={form.ciri} onChange={update("ciri")} /></div><div><label className="form-label">Manfaat</label><textarea rows={5} className="form-input" value={form.manfaat} onChange={update("manfaat")} /></div><div className="grid gap-5 sm:grid-cols-2"><div><label className="form-label">Cara perawatan (Bahasa Indonesia)</label><textarea required rows={7} className="form-input" value={form.pemeliharaanId} onChange={update("pemeliharaanId")} /></div><div><label className="form-label">Care instructions (English)</label><textarea required rows={7} className="form-input" value={form.pemeliharaanEn} onChange={update("pemeliharaanEn")} /></div></div>{error && <p className="error-box">{error}</p>}{notice && <p className="success-box">{notice}</p>}<button className="primary-button w-full">Kirim usulan edit</button></form></main>;
}
