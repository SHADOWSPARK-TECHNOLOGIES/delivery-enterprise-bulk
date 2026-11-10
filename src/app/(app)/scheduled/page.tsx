import { SHIPMENTS, VEHICLES } from '@/data/fixtures';
import { formatNgn } from '@/lib/format';
import { Badge } from '@/components/ui/badge';

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ScheduledPage() {
  const scheduled = SHIPMENTS.filter((s) => s.status === 'scheduled');
  const weekly = ['R-LGS', 'R-ABJ', 'R-PHC', 'R-LGS', 'R-ABJ', 'R-LGS', 'R-PHC'];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Scheduled &amp; recurring deliveries</h1>
      <p className="mt-1 text-sm text-muted">Weekly routes and time-window planning for recurring clients.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-cyan">Weekly route plan</h2>
          <div className="space-y-2">
            {WEEK.map((d, i) => (
              <div key={d} className="flex items-center justify-between rounded-xl border border-line/50 p-3">
                <span className="w-10 font-mono text-sm text-cyan">{d}</span>
                <span className="text-sm text-ink">{weekly[i]} · 07:00–11:00 window</span>
                <Badge tone={i % 3 === 0 ? 'cyan' : 'dim'}>{i % 3 === 0 ? 'cold' : 'dry'}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-purple">Upcoming scheduled shipments</h2>
          <div className="space-y-2">
            {scheduled.map((s) => {
              const v = VEHICLES.find((x) => x.id === s.assignedVehicle);
              return (
                <div key={s.id} className="glass rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-cyan">{s.ref}</span>
                    <span className="text-xs text-muted">{s.weightKg}kg · {s.stops} stops</span>
                  </div>
                  <div className="mt-1 text-sm text-ink">{s.fromCity} → {s.toCity}</div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted">
                    <span>{v ? `vehicle ${v.name}` : 'not yet assigned'}</span>
                    <span>{s.coldChain ? '❄ cold chain' : 'dry'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
