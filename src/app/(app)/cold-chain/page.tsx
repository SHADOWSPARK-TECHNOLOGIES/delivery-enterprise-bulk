import { ALERTS, SHIPMENTS, VEHICLES } from '@/data/fixtures';
import { MapPlaceholder } from '@/components/map-placeholder';
import { Badge } from '@/components/ui/badge';

export default function ColdChainPage() {
  const reefers = VEHICLES.filter((v) => v.kind === 'refrigerated');
  const coldAlerts = ALERTS.filter((a) => a.kind === 'cold_chain' || a.severity === 'critical');
  const coldShipments = SHIPMENTS.filter((s) => s.coldChain);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Cold chain monitoring</h1>
      <p className="mt-1 text-sm text-muted">Temperature-alert telemetry for pharma and food lanes.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-cyan">Refrigerated fleet</h2>
          {reefers.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-xl border border-line/50 p-3 text-sm">
              <div>
                <div className="text-ink">{v.name}</div>
                <div className="text-xs text-muted">{v.zone} · {v.plate}</div>
              </div>
              <span className="flex items-center gap-2">
                <Badge tone={v.status === 'cold_chain' ? 'cyan' : 'dim'}>{v.status}</Badge>
                <span className="font-mono text-xs text-emerald-300">4.2°C</span>
              </span>
            </div>
          ))}
        </div>

        <div>
          <MapPlaceholder label="Cold-chain lanes" zones={[...new Set(coldShipments.map((s) => s.toCity))]} className="h-44" />
          <div className="glass mt-4 rounded-2xl p-5">
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-magenta">Alerts</h2>
            {coldAlerts.length === 0 && <p className="text-sm text-muted">No active temperature alerts.</p>}
            {coldAlerts.map((a) => (
              <div key={a.id} className="flex items-start justify-between border-t border-line/40 py-2 text-sm first:border-0">
                <span className="text-ink">{a.message}{a.shipmentId ? ` (${a.shipmentId})` : ''}</span>
                <span className={`font-mono text-[10px] ${a.severity === 'critical' ? 'text-magenta' : 'text-amber'}`}>{a.severity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
