import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ROUTES, VEHICLES } from '@/data/fixtures';
import { shipmentsForRoute } from '@/lib/fixtures';
import { optimizeBatch } from '@/lib/optimizer';
import { MapPlaceholder } from '@/components/map-placeholder';
import { Badge } from '@/components/ui/badge';

export default async function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const route = ROUTES.find((r) => r.id === id);
  if (!route) notFound();
  const shipments = shipmentsForRoute(route.id);
  const optimized = optimizeBatch(shipments, VEHICLES);
  const first = optimized.assignments[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/dashboard" className="font-mono text-xs text-cyan hover:underline">← fleet</Link>
      <h1 className="mt-3 text-3xl font-bold text-ink">{route.code} · {route.name}</h1>
      <p className="mt-1 text-sm text-muted">
        {route.origin} origin · {route.vehicles} vehicles · {shipments.length} shipments on this route · status: <span className="text-cyan">{route.status}</span>
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-cyan">Optimized stop sequence {route.stops.length}</h2>
          <ol className="space-y-2">
            {route.stops.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${s.done ? 'bg-cyan text-bg' : 'bg-white/10 text-muted'}`}>{i + 1}</span>
                <span className="flex-1 text-sm text-ink">{s.city}</span>
                <span className="font-mono text-xs text-dim">ETA ~{s.etaMin} min</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <MapPlaceholder label={route.code} zones={route.stops.map((s) => s.city)} className="h-48" />
          {first && (
            <div className="glass mt-4 rounded-2xl p-4">
              <div className="mb-2 font-mono text-xs uppercase tracking-widest text-purple">Driver assignment</div>
              <div className="text-sm text-ink">{first.vehicleName}</div>
              <div className="mt-1 text-xs text-muted">
                {first.shipments.length} shipments · {first.loadKg}kg · nearest-neighbour mock {optimized.note}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {first.sequence.slice(0, 6).map((seq, i) => <Badge key={i} tone="cyan">{seq}</Badge>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
