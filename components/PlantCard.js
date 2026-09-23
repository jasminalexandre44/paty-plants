import Link from "next/link";
import Image from "next/image";

export default function PlantCard({ plant }) {
  return (
    <Link
      href={`/plant/${plant.id}`}
      className="specimen-card block overflow-hidden rounded-soft"
    >
      <div className="relative aspect-[4/3] w-full bg-mist">
        {plant.imageUrl ? (
          <Image
            src={plant.imageUrl}
            alt={plant.namaLokal}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sage">
            Tidak ada foto
          </div>
        )}
      </div>
      <div className="space-y-1 p-5">
        <h3 className="font-display text-xl text-canopy">
          {plant.namaLokal}
        </h3>
        <p className="font-display italic text-sm text-bark/60">
          {plant.namaIlmiah}
        </p>
      </div>
    </Link>
  );
}
