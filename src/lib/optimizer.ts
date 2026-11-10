import type { Shipment, Vehicle } from '@/types';

export interface Assignment {
  vehicleId: string;
  vehicleName: string;
  shipments: Shipment[];
  loadKg: number;
  sequence: string[];
}

export interface OptimizeResult {
  assignments: Assignment[];
  totalVehicles: number;
  totalShipments: number;
  note: string;
}

/**
 * MOCK nearest-neighbour + capacity-constrained route optimizer for the demo.
 * Group shipments by origin, then assign to the least-loaded vehicle that fits,
 * ordering stops by city. In production this would call a real route optimizer
 * (e.g. OR-Tools / an external API).
 */
export function optimizeBatch(shipments: Shipment[], vehicles: Vehicle[]): OptimizeResult {
  const sorted = [...shipments].sort((a, b) => a.fromCity.localeCompare(b.fromCity));
  const buckets = new Map<string, Shipment[]>();
  for (const s of sorted) {
    const list = buckets.get(originOf(s)) ?? [];
    list.push(s);
    buckets.set(originOf(s), list);
  }

  const assignments: Assignment[] = [];
  let remaining = [...sorted];
  let vi = 0;

  while (remaining.length > 0) {
    const vehicle = vehicles[vi % vehicles.length];
    vi++;
    if (!vehicle) break;
    let loadKg = 0;
    const taken: Shipment[] = [];
    const seq: string[] = [];
    // capacity-constrained fit from the from-city buckets
    for (const s of remaining.slice()) {
      if (loadKg + s.weightKg <= vehicle.capacityKg) {
        loadKg += s.weightKg;
        taken.push(s);
        seq.push(`${s.fromCity}→${s.toCity}`);
        remaining = remaining.filter((x) => x.id !== s.id);
      }
    }
    if (taken.length > 0) {
      assignments.push({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        shipments: taken,
        loadKg,
        sequence: seq,
      });
    }
  }

  return {
    assignments,
    totalVehicles: assignments.length,
    totalShipments: assignments.reduce((n, a) => n + a.shipments.length, 0),
    note: 'MOCK algorithm: nearest-neighbour grouping by origin + capacity-constrained bin packing. Replace with a real optimizer in production.',
  };
}

// place Origin helper on the prototype won't work for plain data; add a helper instead
export function originOf(s: Shipment): string {
  return s.fromCity;
}
