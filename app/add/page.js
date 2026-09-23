"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full rounded-lg border border-canopy/15 bg-white/70 px-4 py-2.5 text-bark placeholder:text-bark/30 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/20";
const labelClass = "mb-1.5 block text-sm font-medium text-canopy";

export default function AddPlantPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    namaLokal: "",
    namaIlmiah: "",
    daun: "",
    batang: "",
    bunga: "",
    akar: "",
    kingdom: "Plantae",
    divisi: "",
    kelas: "",
    ordo: "",
    famili: "",
    genus: "",
    spesies: "",
    manfaat: "",
    pemeliharaan: "",
  });
  const [image, setImage] = useState(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.namaLokal.trim()) {
      setError("Nama lokal wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      if (image) fd.append("image", image);

      const res = await fetch("/api/plants", {
        method: "POST",
        body: fd,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menyimpan tanaman.");

      router.push(`/plant/${result.plant.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <span className="tag-chip">Tanaman baru</span>
      <h1 className="mt-4 font-display text-3xl text-canopy">
        Tambahkan tanaman ke koleksi
      </h1>
      <p className="mt-2 text-bark/60">
        Lengkapi data di bawah ini. Setelah disimpan, halaman tanaman beserta
        QR code-nya akan langsung tersedia.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-10">
        <section className="space-y-4">
          <div>
            <label className={labelClass}>Foto tanaman</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nama lokal</label>
              <input
                className={inputClass}
                placeholder="Bunga Tulip"
                value={form.namaLokal}
                onChange={update("namaLokal")}
              />
            </div>
            <div>
              <label className={labelClass}>Nama ilmiah</label>
              <input
                className={inputClass}
                placeholder="Tulipa gesneriana"
                value={form.namaIlmiah}
                onChange={update("namaIlmiah")}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-canopy">
            Ciri-ciri morfologi
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Daun</label>
              <input className={inputClass} value={form.daun} onChange={update("daun")} />
            </div>
            <div>
              <label className={labelClass}>Batang</label>
              <input className={inputClass} value={form.batang} onChange={update("batang")} />
            </div>
            <div>
              <label className={labelClass}>Bunga</label>
              <input className={inputClass} value={form.bunga} onChange={update("bunga")} />
            </div>
            <div>
              <label className={labelClass}>Akar</label>
              <input className={inputClass} value={form.akar} onChange={update("akar")} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-canopy">Klasifikasi</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ["kingdom", "Kingdom"],
              ["divisi", "Divisi"],
              ["kelas", "Kelas"],
              ["ordo", "Ordo"],
              ["famili", "Famili"],
              ["genus", "Genus"],
              ["spesies", "Spesies"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input
                  className={inputClass}
                  value={form[key]}
                  onChange={update(key)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <label className={labelClass}>Manfaat (satu per baris)</label>
            <textarea
              rows={4}
              className={inputClass}
              placeholder={"Sebagai tanaman hias.\nMempercantik lingkungan sekolah."}
              value={form.manfaat}
              onChange={update("manfaat")}
            />
          </div>
          <div>
            <label className={labelClass}>Cara pemeliharaan (satu per baris)</label>
            <textarea
              rows={5}
              className={inputClass}
              placeholder={"Berikan sinar matahari yang cukup.\nSiram secukupnya."}
              value={form.pemeliharaan}
              onChange={update("pemeliharaan")}
            />
          </div>
        </section>

        {error && (
          <p className="rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-canopy px-6 py-3 font-medium text-parchment transition hover:bg-moss disabled:opacity-60"
        >
          {submitting ? "Menyimpan..." : "Simpan tanaman"}
        </button>
      </form>
    </div>
  );
}
