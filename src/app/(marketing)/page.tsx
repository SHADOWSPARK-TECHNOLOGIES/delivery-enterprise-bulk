import Link from 'next/link';
import { CLIENTS, VEHICLES, SHIPMENTS } from '@/data/fixtures';

export default function EnterpriseLanding() {
  const onTime = `${Math.round((VEHICLES.reduce((s, v) => s + v.onTimePct, 0) / VEHICLES.length) * 10) / 10}%`;
  return (
    <div>
      <section className="cyber-grid-bg border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">ShadowSpark · Enterprise</span>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Bulk logistics, <span className="cyber-text-grad">on rails.</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Fleet dashboard, CSV bulk upload, route optimization and cold-chain monitoring — built
            for Nigerian fleets moving dozens to thousands of shipments a day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-lg bg-cyan px-6 py-3 font-semibold text-bg hover:shadow-glow">Open fleet dashboard</Link>
            <Link href="/bulk-upload" className="rounded-lg border border-line px-6 py-3 font-semibold text-ink hover:border-cyan hover:text-cyan">Bulk upload</Link>
            <a href="mailto:fleet@shadowspark.tech" className="rounded-lg border border-line px-6 py-3 font-semibold text-ink hover:border-purple hover:text-purple">Request demo</a>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
            {[['12', 'vehicles'], [onTime, 'on-time'], ['50', 'live shipments']].map(([n, l]) => (
              <div key={l} className="glass rounded-xl p-3 text-center">
                <div className="font-mono text-2xl font-bold text-cyan">{n}</div>
                <div className="text-xs text-muted">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-4 text-2xl font-bold text-ink">Trusted by teams across Nigeria</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CLIENTS.map((c) => (
            <div key={c.id} className="glass flex items-center justify-between rounded-xl p-4">
              <div>
                <div className="font-semibold text-ink">{c.name}</div>
                <div className="text-xs text-muted">{c.industry} · {c.city}</div>
              </div>
              <span className="font-mono text-xs text-cyan">● active</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
