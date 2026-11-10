import Link from 'next/link';
import { ALERTS, SHIPMENTS, VEHICLES } from '@/data/fixtures';
import { formatNgn } from '@/lib/format';
import { MapPlaceholder } from '@/components/map-placeholder';

export default function FleetDashboard() {
  const delivered = SHIPMENTS.filter((s) => s.status === 'delivered').length;
  const failed = SHIPMENTS.filter((s) => s.status === 'failed').length;
  const successRate = Math.round((delivered / Math.max(1, SHIPMENTS.length)) * 100);
  const onTime = Math.round((VEHICLES.reduce((s, v) => s + v.onTimePct, 0) / VEHICLES.length) * 10) / 10;
  const avgCost = Math.round(VEHICLES.reduce((s, v) => s + v.costPerOrderNgn, 0) / VEHICLES.length);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Fleet overview</h1>
      <p className="mt-1 text-sm text-muted">{VEHICLES.length} vehicles · {SHIPMENTS.length} shipments · {ALERTS.length} open alerts</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Delivery success', `${successRate}%`, 'text-emerald-300'],
          ['On-time rate', `${onTime}%`, 'text-cyan'],
          ['Avg cost / order', formatNgn(avgCost), 'text-purple'],
          ['Failed this window', `${failed}`, failed > 0 ? 'text-magenta' : 'text-emerald-300'],
        ].map(([label, val, tone]) => (
          <div key={label} className="glass rounded-2xl p-4">
            <div className="text-xs uppercase tracking-widest text-dim">{label}</div>
            <div className={`mt-1 font-mono text-2xl font-bold ${tone}`}>{val}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-cyan">Live map</h2>
          <MapPlaceholder label="Fleet positions" zones={[...new Set(VEHICLES.map((v) => v.zone))]} className="h-72" />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {VEHICLES.map((v) => (
              <div key={v.id} className="glass flex items-center justify-between rounded-xl p-3">
                <div>
                  <div className="text-sm text-ink">{v.name}</div>
                  <div className="text-xs text-muted">{v.zone} · {v.plate}</div>
                </div>
                <span className={`font-mono text-[10px] ${v.status === 'idle' ? 'text-muted' : v.status === 'offline' ? 'text-dim' : 'text-cyan'}`}>{v.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-purple">Recent shipments</h2>
          <div className="space-y-2">
            {SHIPMENTS.slice(0, 8).map((s) => (
              <Link key={s.id} href={`/routes/${s.routeId}`} className="glass flex items-center justify-between rounded-xl p-3">
                <div>
                  <span className="font-mono text-sm text-cyan">{s.ref}</span>
                  <span className="ml-2 text-xs text-muted">{s.fromCity}→{s.toCity}</span>
                </div>
                <span className={`font-mono text-[10px] ${s.status === 'failed' ? 'text-magenta' : s.status === 'delivered' ? 'text-emerald-300' : 'text-cyan'}`}>{s.status.replace('_', ' ')}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
