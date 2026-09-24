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
    router.push("/admin");
    router.refresh();
  }

  return <main className="mx-auto max-w-md px-6 py-16"><span className="tag-chip">Area admin</span><h1 className="mt-4 font-display text-4xl text-canopy">Login administrator</h1><p className="mt-2 text-bark/60">Pengunjung tidak perlu login untuk menambah atau mengusulkan perubahan tanaman.</p><form onSubmit={submit} className="mt-8 space-y-4"><input required type="email" placeholder="Email admin" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><input required type="password" placeholder="Password admin" className="form-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />{error && <p className="error-box">{error}</p>}<button className="primary-button w-full">Masuk sebagai admin</button></form></main>;
}