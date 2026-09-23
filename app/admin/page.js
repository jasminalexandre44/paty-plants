import { redirect } from "next/navigation";
import { getData } from "@/lib/blob";
import { readSession } from "@/lib/auth";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = readSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/");
  const plants = await getData();
  return <main className="mx-auto max-w-5xl px-6 py-14"><span className="tag-chip">Admin workspace</span><h1 className="mt-4 font-display text-4xl text-canopy">Kelola Paty Plants</h1><p className="mt-2 text-bark/60">Atur foto, kategori, dan seluruh data tanaman dari satu tempat.</p><AdminPanel plants={plants} /></main>;
}
