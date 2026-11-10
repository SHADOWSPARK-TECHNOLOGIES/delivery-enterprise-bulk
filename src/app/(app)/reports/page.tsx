import { ALERTS, SHIPMENTS, VEHICLES } from '@/data/fixtures';
import { formatNgn } from '@/lib/format';
import { ExportReportButton } from '@/components/export-report-button';

export default function ReportsPage() {
  const zones = [...new Set(SHIPMENTS.map((s) => s.fromCity))];
  const avgCost = Math.round(VEHICLES.reduce((s, v) => s + v.costPerOrderNgn, 0) / VEHICLES.length);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Analytics</h1>
          <p className="mt-1 text-sm text-muted">Delivery success by zone, time analysis and cost breakdown.</p>
        </div>
        <ExportReportButton />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-cyan">Delivery success by zone</h2>
          <div className="space-y-3">
            {zones.map((z) => {
              const inZone = SHIPMENTS.filter((s) => s.fromCity === z);
              const delivered = inZone.filter((s) => s.status === 'delivered').length;
              const failed = inZone.filter((s) => s.status === 'failed').length;
              const pct = Math.round((delivered / Math.max(1, inZone.length)) * 100);
              return (
                <div key={z}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-ink">{z}</span>
                    <span className="text-muted">{delivered} delivered · {failed} failed · {pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-cyan" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-purple">Cost breakdown (avg / order)</h2>
            <div className="font-mono text-3xl font-bold text-purple">{formatNgn(avgCost)}</div>
            <p className="mt-1 text-xs text-muted">Kano corridor trending +18% week-over-week.</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-amber">Time analysis</h2>
            <p className="text-sm text-ink">Peak transit window: 07:00–11:00</p>
            <p className="mt-1 text-xs text-muted">90% of on-time deliveries leave the hub before 09:00.</p>
          </div>
        </div>
      </div>

      {ALERTS.length > 0 && (
        <div className="glass mt-6 rounded-2xl p-5">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-magenta">Open alerts</h2>
          {ALERTS.map((a) => (
            <div key={a.id} className="flex items-center justify-between border-t border-line/40 py-2 text-sm first:border-0">
              <span className="text-ink">{a.message}</span>
              <span className={`font-mono text-[10px] ${a.severity === 'critical' ? 'text-magenta' : a.severity === 'high' ? 'text-amber' : 'text-dim'}`}>{a.severity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
