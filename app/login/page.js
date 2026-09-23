"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const result = await response.json();
    if (!response.ok) return setError(result.error);
    router.push(result.user.role === "admin" ? "/admin" : "/add");
    router.refresh();
  }

  return <main className="mx-auto max-w-md px-6 py-16"><span className="tag-chip">Akun Paty Plants</span><h1 className="mt-4 font-display text-4xl text-canopy">Masuk ke ruang tanaman</h1><form onSubmit={submit} className="mt-8 space-y-4"><input required type="email" placeholder="Email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><input required type="password" placeholder="Password" className="form-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />{error && <p className="error-box">{error}</p>}<button className="primary-button w-full">Masuk</button></form></main>;
}