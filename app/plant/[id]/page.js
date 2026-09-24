import { getPlant } from "@/lib/storage";
import Image from "next/image";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import QrCode from "@/components/QrCode";
import Link from "next/link";

export const dynamic = "force-dynamic";

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = headers();
  const host = h.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export default async function PlantDetailPage({ params }) {
  const plant = await getPlant(params.id);

  if (!plant) notFound();

  const url = `${getSiteUrl()}/plant/${plant.id}`;

  const morfologiRows = [
    ["Daun", plant.morfologi?.daun],
    ["Batang", plant.morfologi?.batang],
    ["Bunga", plant.morfologi?.bunga],
    ["Akar", plant.morfologi?.akar],
  ].filter(([, value]) => value);

  const klasifikasiRows = [
    ["Kingdom", plant.klasifikasi?.kingdom],
    ["Divisi", plant.klasifikasi?.divisi],
    ["Kelas", plant.klasifikasi?.kelas],
    ["Ordo", plant.klasifikasi?.ordo],
    ["Famili", plant.klasifikasi?.famili],
    ["Genus", plant.klasifikasi?.genus],
    ["Spesies", plant.klasifikasi?.spesies],
  ].filter(([, value]) => value);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-soft bg-mist">
            {plant.imageUrl ? (
              <Image
                src={plant.imageUrl}
                alt={plant.namaLokal}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sage">
                Tidak ada foto
              </div>
            )}
          </div>

          <h1 className="mt-6 font-display text-4xl text-canopy">
            {plant.namaLokal}
          </h1>
          <p className="mt-1 font-display text-lg italic text-bark/60">
            {plant.namaIlmiah}
          </p>
          <span className="tag-chip mt-4">{plant.kategori || "Lainnya"}</span>
          <Link href={`/plant/${plant.id}/edit`} className="ml-3 inline-flex rounded-full border border-canopy/20 px-4 py-2 text-sm text-canopy hover:bg-mist">Usulkan edit</Link>

          {plant.ciri && <section className="field-divider mt-8 pt-8"><h2 className="font-display text-2xl text-canopy">Ciri-ciri tanaman</h2><p className="mt-4 whitespace-pre-line text-bark/80">{plant.ciri}</p></section>}

          {morfologiRows.length > 0 && (
            <section className="field-divider mt-8 pt-8">
              <h2 className="font-display text-2xl text-canopy">
                Ciri-ciri morfologi
              </h2>
              <dl className="mt-4 space-y-3">
                {morfologiRows.map(([label, value]) => (
                  <div key={label} className="flex gap-4">
                    <dt className="w-24 shrink-0 text-sm font-medium text-moss">
                      {label}
                    </dt>
                    <dd className="text-bark/80">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {klasifikasiRows.length > 0 && (
            <section className="field-divider mt-8 pt-8">
              <h2 className="font-display text-2xl text-canopy">
                Klasifikasi
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {klasifikasiRows.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs uppercase tracking-wide text-bark/40">
                      {label}
                    </dt>
                    <dd className="font-display italic text-bark/85">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {plant.manfaat?.length > 0 && (
            <section className="field-divider mt-8 pt-8">
              <h2 className="font-display text-2xl text-canopy">Manfaat</h2>
              <ul className="mt-4 space-y-2">
                {plant.manfaat.map((item, i) => (
                  <li key={i} className="flex gap-3 text-bark/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {plant.pemeliharaan?.length > 0 && (
            <section className="field-divider mt-8 pt-8">
              <h2 className="font-display text-2xl text-canopy">
                Cara pemeliharaan
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wider text-moss">Bahasa Indonesia</p><ul className="mt-3 space-y-2">{(plant.pemeliharaan?.id || []).map((item, i) => (
                  <li key={i} className="flex gap-3 text-bark/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                    {item}
                  </li>
                ))}</ul></div><div><p className="text-xs font-semibold uppercase tracking-wider text-moss">English</p><ul className="mt-3 space-y-2">{(plant.pemeliharaan?.en || []).map((item, i) => <li key={i} className="flex gap-3 text-bark/80"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />{item}</li>)}</ul></div></div>
            </section>
          )}
        </div>

        <div className="lg:sticky lg:top-8 lg:h-fit">
          <QrCode url={url} name={plant.id} />
        </div>
      </div>
    </div>
  );
}
