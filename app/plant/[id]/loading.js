export default function Loading() {
  return <main className="mx-auto max-w-5xl px-6 py-14" aria-busy="true"><div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]"><div><div className="skeleton skeleton-photo" /><div className="skeleton skeleton-title mt-6" /><div className="skeleton skeleton-copy mt-4" /><div className="skeleton skeleton-section mt-10" /></div><div className="skeleton skeleton-qr" /></div></main>;
}
