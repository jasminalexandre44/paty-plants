import Link from "next/link";
import Icon from "@/components/Icon";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Link href="/" className="footer-brand">
              <span className="footer-brand-icon"><Icon name="leaf" size={21} /></span>
              <span><strong>Paty</strong> Plants</span>
            </Link>
            <p>Katalog tanaman digital untuk mengenal, merawat, dan berbagi pengetahuan tentang tanaman di sekitar kita.</p>
          </div>
          <div className="footer-column">
            <h2>Jelajahi</h2>
            <Link href="/">Koleksi tanaman</Link>
            <Link href="/add">Tambah tanaman</Link>
          </div>
          <div className="footer-column">
            <h2>Pengelolaan</h2>
            <Link href="/login">Masuk admin</Link>
            <Link href="/admin">Dashboard admin</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Paty Plants. Semua hak dilindungi.</p>
          <p>Dibuat oleh <strong>Respaty Dev</strong></p>
        </div>
      </div>
    </footer>
  );
}
