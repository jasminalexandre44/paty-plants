import { getData } from "@/lib/blob";
import PlantCard from "@/components/PlantCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const plants = await getData();

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="max-w-2xl">
        <span className="tag-chip">Katalog tanaman</span>
        <h1 className="mt-4 font-display text-4xl leading-tight text-canopy sm:text-5xl">
          Kenali setiap tanaman, cukup dengan satu pindaian.
        </h1>
        <p className="mt-4 text-bark/70">
          Setiap tanaman di sini punya halaman sendiri lengkap dengan
          klasifikasi, ciri morfologi, manfaat, dan cara pemeliharaan — serta
          QR code yang bisa ditempel langsung di dekat tanamannya.
        </p>
      </div>

      <div className="field-divider mt-12 pt-12">
        {plants.length === 0 ? (
          <p className="text-bark/60">
            Belum ada tanaman. Mulai dengan menambahkan tanaman pertama.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
