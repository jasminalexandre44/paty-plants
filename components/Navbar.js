"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/Icon";

function Brand() {
  return <span className="brand-mark"><span className="brand-icon"><Icon name="leaf" size={23} /></span><span><strong>Paty</strong><em>Plants</em></span></span>;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  function closeMenu() { setOpen(false); }
  return <header className="site-header"><div className="nav-shell"><Link href="/" aria-label="Paty Plants beranda" onClick={closeMenu}><Brand /></Link><button type="button" className="menu-toggle" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} size={22} /></button><nav className={`site-nav ${open ? "is-open" : ""}`}><Link href="/" onClick={closeMenu}><Icon name="collection" size={17} />Koleksi</Link><Link href="/admin" onClick={closeMenu}><Icon name="shield" size={17} />Login admin</Link><Link href="/add" className="nav-primary" onClick={closeMenu}><Icon name="plus" size={17} />Tambah tanaman</Link></nav></div></header>;
}
