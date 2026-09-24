"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { compressImage } from "@/lib/compressImage";

const categories = ["Tanaman Pangan", "Tanaman Hias", "Tanaman Obat", "Tanaman Perkebunan", "Tanaman Buah", "Lainnya"];
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function EditPlantPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/plants/${id}`)
      .then((response) => response.json())
      .then((plant) => setForm({ ...plant, ciri: plant.ciri || "", manfaat: (plant.manfaat || []).join("\n"), pemeliharaanId: (plant.pemeliharaan?.id || []).join("\n"), pemeliharaanEn: (plant.pemeliharaan?.en || []).join("\n") }))
      .catch(() => setError("Data tanaman tidak dapat dimuat."));
  }, [id]);

  if (!form) return <main className="mx-auto max-w-3xl px-6 py-14">Memuat data...</main>;
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  function chooseImage(event) {
    const selected = event.target.files?.[0] || null;
    if (selected && (!allowedTypes.includes(selected.type) || selected.size > 8 * 1024 * 1024)) {
      setImage(null);
      setError("Foto harus JPG, PNG, WEBP, atau GIF dan maksimal 8 MB.");
      event.target.value = "";
      return;
    }
    setError("");
    setImage(selected);
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!form.namaLokal.trim()) return setError("Nama tanaman wajib diisi.");
    if (!form.pemeliharaanId.trim() || !form.pemeliharaanEn.trim()) return setError("Cara perawatan Bahasa Indonesia dan English wajib diisi.");
    setSaving(true);
    const data = new FormData();
    ["kategori", "namaLokal", "namaIlmiah", "ciri", "manfaat", "pemeliharaanId", "pemeliharaanEn"].forEach((key) => data.append(key, form[key] || ""));
    try {
      if (image) data.append("image", await compressImage(image));
      const response = await fetch(`/api/plants/${id}`, { method: "PUT", body: data });
      const result = await response.json();
      if (!response.ok) return setError(result.error || "Usulan edit gagal dikirim.");
      if (result.pending) return setNotice(result.message);
      router.push("/?updated=1");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return <main className="mx-auto max-w-3xl px-6 py-14"><span className="tag-chip">Usulan perubahan</span><h1 className="mt-4 font-display text-4xl text-canopy">Usulkan edit tanaman</h1><p className="mt-2 text-bark/60">Perubahan akan diperiksa admin sebelum tampil di website.</p><form onSubmit={submit} className="mt-10 space-y-6"><div><label className="form-label">Ganti foto</label><input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif" className="form-input" onChange={chooseImage} /></div><div className="grid gap-5 sm:grid-cols-2"><div><label className="form-label">Jenis tanaman</label><select className="form-input" value={form.kategori} onChange={update("kategori")}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div><div><label className="form-label">Nama tanaman</label><input required className="form-input" value={form.namaLokal} onChange={update("namaLokal")} /></div></div><div><label className="form-label">Nama ilmiah</label><input className="form-input" value={form.namaIlmiah} onChange={update("namaIlmiah")} /></div><div><label className="form-label">Ciri-ciri tanaman</label><textarea rows={5} className="form-input" value={form.ciri} onChange={update("ciri")} /></div><div><label className="form-label">Manfaat</label><textarea rows={5} className="form-input" value={form.manfaat} onChange={update("manfaat")} /></div><div className="grid gap-5 sm:grid-cols-2"><div><label className="form-label">Cara perawatan (Bahasa Indonesia)</label><textarea required rows={7} className="form-input" value={form.pemeliharaanId} onChange={update("pemeliharaanId")} /></div><div><label className="form-label">Care instructions (English)</label><textarea required rows={7} className="form-input" value={form.pemeliharaanEn} onChange={update("pemeliharaanEn")} /></div></div>{error && <p className="error-box">{error}</p>}{notice && <p className="success-box">{notice}</p>}<button disabled={saving} className="primary-button w-full">{saving ? "Mengirim usulan..." : "Kirim usulan edit"}</button></form></main>;
}
