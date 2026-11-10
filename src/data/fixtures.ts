import type { Alert, Client, Route, Shipment, ShipmentStatus, Vehicle, Warehouse } from '@/types';

export const WAREHOUSES: Warehouse[] = [
  { id: 'wh-lag', name: 'Lagos Hub — Ikeja', city: 'Lagos', address: '10 Odani, Ikeja' },
  { id: 'wh-abj', name: 'Abuja Hub — Gwagwalada', city: 'Abuja', address: 'Plot 4, Industrial Ave' },
];

export const CLIENTS: Client[] = [
  { id: 'cl-01', name: 'Zuma Pharma', industry: 'Pharma', city: 'Abuja' },
  { id: 'cl-02', name: 'Naija Mart Group', industry: 'Retail', city: 'Lagos' },
  { id: 'cl-03', name: 'Greenfield Cold Chain', industry: 'Food', city: 'Owerri' },
  { id: 'cl-04', name: 'Urban Clothiers', industry: 'Fashion', city: 'Lagos' },
  { id: 'cl-05', name: 'BrightParts Auto', industry: 'Auto parts', city: 'Ibadan' },
  { id: 'cl-06', name: 'MedPlus Group', industry: 'Pharma', city: 'Kano' },
];

export const VEHICLES: Vehicle[] = [
  { id: 'v-01', name: 'Toyota HiAce · LG-01', kind: 'van', plate: 'BCK-101-XA', capacityKg: 900, status: 'en_route', driverId: 'dv-01', zone: 'Lagos', onTimePct: 96, costPerOrderNgn: 480 },
  { id: 'v-02', name: 'Hino 300 · LG-02', kind: 'truck', plate: 'BCK-102-XB', capacityKg: 5000, status: 'idle', driverId: 'dv-02', zone: 'Lagos', onTimePct: 98, costPerOrderNgn: 720 },
  { id: 'v-03', name: 'Transit Reefer · AB-01', kind: 'refrigerated', plate: 'ABJ-201-YA', capacityKg: 1400, status: 'cold_chain', driverId: 'dv-03', zone: 'Abuja', onTimePct: 99, costPerOrderNgn: 880 },
  { id: 'v-04', name: 'Ford Transit · AB-02', kind: 'van', plate: 'ABJ-202-YB', capacityKg: 1100, status: 'loading', driverId: 'dv-04', zone: 'Abuja', onTimePct: 93, costPerOrderNgn: 520 },
  { id: 'v-05', name: 'Dina Truck · PH-01', kind: 'truck', plate: 'PHC-301-ZC', capacityKg: 6000, status: 'en_route', driverId: 'dv-05', zone: 'Port Harcourt', onTimePct: 95, costPerOrderNgn: 700 },
  { id: 'v-06', name: 'Isuzu NPR · OW-01', kind: 'truck', plate: 'OWR-401-WA', capacityKg: 4500, status: 'idle', driverId: 'dv-06', zone: 'Owerri', onTimePct: 97, costPerOrderNgn: 680 },
  { id: 'v-07', name: 'Iveco Reefer · KN-01', kind: 'refrigerated', plate: 'KAN-501-WB', capacityKg: 1600, status: 'cold_chain', driverId: 'dv-07', zone: 'Kano', onTimePct: 94, costPerOrderNgn: 900 },
  { id: 'v-08', name: 'Hyundai Staria · IB-01', kind: 'van', plate: 'IBD-601-XX', capacityKg: 1000, status: 'offline', driverId: 'dv-08', zone: 'Ibadan', onTimePct: 90, costPerOrderNgn: 500 },
  { id: 'v-09', name: 'Mitsubishi Fuso · AB-03', kind: 'truck', plate: 'ABJ-203-YC', capacityKg: 5500, status: 'en_route', driverId: 'dv-09', zone: 'Abuja', onTimePct: 98, costPerOrderNgn: 740 },
  { id: 'v-10', name: 'VW Crafter · LG-03', kind: 'van', plate: 'BCK-103-XC', capacityKg: 1200, status: 'loading', driverId: 'dv-10', zone: 'Lagos', onTimePct: 89, costPerOrderNgn: 510 },
  { id: 'v-11', name: 'Scania Reefer · PH-02', kind: 'refrigerated', plate: 'PHC-302-ZD', capacityKg: 1800, status: 'cold_chain', driverId: 'dv-11', zone: 'Port Harcourt', onTimePct: 96, costPerOrderNgn: 920 },
  { id: 'v-12', name: 'Nissan Atlas · OW-02', kind: 'van', plate: 'OWR-402-WB', capacityKg: 1300, status: 'en_route', driverId: 'dv-12', zone: 'Owerri', onTimePct: 91, costPerOrderNgn: 540 },
];

// ---- 3 routes with stops ----
const ROUTE_LAG = ['Lagos', 'Ibadan', 'Owerri', 'Port Harcourt'] as const;
const ROUTE_ABJ = ['Abuja', 'Kano', 'Owerri'] as const;
const ROUTE_PH = ['Port Harcourt', 'Owerri', 'Abuja', 'Kano'] as const;

function route(id: string, code: string, name: string, origin: string, cities: readonly string[], vehicles: number, status: Route['status']): Route {
  return {
    id, code, name, origin, vehicles, status,
    stops: cities.map((city, i) => ({ id: `${id}-s${i + 1}`, shipmentId: `${id}-${i + 1}`, seq: i + 1, city, etaMin: (i + 1) * 140, done: i === 0 })),
  };
}

export const ROUTES: Route[] = [
  route('r-lag', 'R-LGS', 'Lagos → South', 'Lagos', ROUTE_LAG, 4, 'active'),
  route('r-abj', 'R-ABJ', 'North Corridor', 'Abuja', ROUTE_ABJ, 3, 'active'),
  route('r-ph', 'R-PHC', 'Coastal + North', 'Port Harcourt', ROUTE_PH, 3, 'planned'),
];

// ---- 50 shipments across the routes (BLK-0001 … BLK-0050) ----
const driverByVehicle: Record<string, string> = {
  'v-01': 'dv-01', 'v-02': 'dv-02', 'v-03': 'dv-03', 'v-04': 'dv-04', 'v-05': 'dv-05', 'v-06': 'dv-06',
  'v-07': 'dv-07', 'v-08': 'dv-08', 'v-09': 'dv-09', 'v-10': 'dv-10', 'v-11': 'dv-11', 'v-12': 'dv-12',
};

const ITEMS = ['Pharma (cold)', 'Groceries', 'Electronics', 'Fashion', 'Auto parts', 'FMCG', 'Food (chilled)', 'Medical supplies'];
const CLIENT_IDS = CLIENTS.map((c) => c.id);

function makeShipments(): Shipment[] {
  const shipments: Shipment[] = [];
  let n = 0;
  for (const r of ROUTES) {
    const cities = r.stops.map((s) => s.city);
    const count = 18;
    for (let i = 0; i < count; i++) {
      n += 1;
      const ref = `BLK-${String(1000 + n).padStart(3, '0')}`;
      const clientId = CLIENT_IDS[n % CLIENT_IDS.length];
      const cold = n % 5 === 0;
      const status: ShipmentStatus[] = ['in_transit', 'delivered', 'planned', 'assigned', 'failed', 'scheduled'];
      const st = status[n % status.length];
      const vehicleId = VEHICLES[n % VEHICLES.length].id;
      shipments.push({
        id: `shp-${n}`,
        ref,
        clientId,
        routeId: r.id,
        status: st,
        itemType: cold ? 'Pharma (cold)' : ITEMS[n % ITEMS.length],
        stops: (i % 3) + 2,
        weightKg: Math.round((100 + n * 37) / 10) * 10,
        coldChain: cold,
        fromCity: cities[0],
        toCity: cities[cities.length - 1],
        assignedVehicle: st === 'delivered' || st === 'failed' ? vehicleId : st === 'assigned' || st === 'in_transit' ? vehicleId : undefined,
        createdAt: new Date(Date.now() - n * 3600_000).toISOString(),
        deliveredAt: st === 'delivered' ? new Date(Date.now() - n * 2000_000).toISOString() : undefined,
        failureReason: st === 'failed' ? (cold ? 'Reefer temperature breach en route' : 'Receiver unreachable after 3 attempts') : undefined,
      });
    }
  }
  return shipments.slice(0, 50);
}

export const SHIPMENTS: Shipment[] = makeShipments();

export const ALERTS: Alert[] = [
  { id: 'al-1', kind: 'cold_chain', severity: 'critical', shipmentId: SHIPMENTS.find((s) => s.failureReason?.includes('Reefer'))?.ref, vehicleId: 'v-03', message: 'Reefer temperature breach on Lagos→South cold lane', createdAt: new Date().toISOString() },
  { id: 'al-2', kind: 'delay', severity: 'medium', shipmentId: 'BLK-4521', message: 'Shipment BLK-4521 flagged as failed — investigating', createdAt: new Date().toISOString() },
  { id: 'al-3', kind: 'cost_spike', severity: 'high', message: 'Kano corridor cost per order up 18% week-over-week', createdAt: new Date().toISOString() },
  { id: 'al-4', kind: 'capacity', severity: 'low', message: 'Lagos hub at 92% capacity during peak window', createdAt: new Date().toISOString() },
];
