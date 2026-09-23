import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-canopy/10 bg-parchment/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl italic text-canopy">
            Paty
          </span>
          <span className="font-display text-2xl text-canopy">Plants</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-bark/70 transition hover:text-canopy"
          >
            Koleksi
          </Link>
          <Link
            href="/add"
            className="rounded-full bg-canopy px-4 py-2 text-parchment transition hover:bg-moss"
          >
            Tambah tanaman
          </Link>
        </nav>
      </div>
    </header>
  );
}
