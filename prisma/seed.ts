// ShadowSpark Fleet — enterprise & bulk logistics database seed.
//
//   pnpm db:seed
//
// Requires a reachable DATABASE_URL. The Next.js build never runs this.
// Self-contained (no '@/' alias, no imports beyond @prisma/client) so tsx can
// execute it directly. Data mirrors the typed fixtures used by the UI + agent.

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ---- Clients ------------------------------------------------------------
  const clients = [
    ['cli-dangote', 'Dangote FMCG', 'Consumer goods', 'Lagos', 'DG'],
    ['cli-globacom', 'Glo SIM Distribution', 'Telecom retail', 'Lagos', 'GL'],
    ['cli-flour', 'Flour Mills of Nigeria', 'Food & agri', 'Lagos', 'FM'],
    ['cli-pharma', 'Northbridge Pharma', 'Pharmaceuticals', 'Abuja', 'NP'],
    ['cli-guinness', 'Guinness NG', 'Beverages', 'Lagos', 'GN'],
    ['cli-konga', 'Konga Express', 'E-commerce', 'Lagos', 'KG'],
  ];
  for (const [id, name, industry, city, monogram] of clients) {
    await prisma.client.upsert({ where: { id }, update: {}, create: { id, name, industry, city, monogram } });
  }

  // ---- Warehouses ---------------------------------------------------------
  const warehouses = [
    { id: 'wh-ikeja', name: 'Lagos Ikeja Hub', city: 'Lagos', address: '14b Awolowo Way, Ikeja', capacityPallets: 1800 },
    { id: 'wh-abuja', name: 'Abuja Kubwa Depot', city: 'Abuja', address: 'Plot 7, Kubwa Expressway', capacityPallets: 960 },
  ];
  for (const w of warehouses) {
    await prisma.warehouse.upsert({ where: { id: w.id }, update: {}, create: w });
  }

  // ---- Vehicles -----------------------------------------------------------
  const vehicles = [
    ['veh-001', 'Toyota', 'Hino 700 Box Truck', 'truck', 'LAG-5521-KJA', 12000, 18, false],
    ['veh-002', 'Mercedes', 'Atego 1526 Truck', 'truck', 'LAG-3380-XYZ', 15000, 22, false],
    ['veh-003', 'Isuzu', 'NPR Box Van', 'van', 'ABJ-1144-RNW', 4500, 8, false],
    ['veh-004', 'Mitsubishi', 'FUSO Canter Van', 'van', 'PHC-2233-MNO', 3800, 6, false],
    ['veh-005', 'Ford', 'Cargo Refrigerated', 'refrigerated', 'IKE-9901-BLT', 6000, 10, true],
    ['veh-006', 'MAN', 'TGS Refrigerated Trailer', 'refrigerated', 'LAG-7712-CCL', 16000, 26, true],
    ['veh-007', 'Toyota', 'Hiace Refrigerated', 'refrigerated', 'ABJ-8807-DLX', 1400, 3, true],
    ['veh-008', 'DAF', 'CF 85 Rigid', 'truck', 'IBD-3345-QWE', 14000, 20, false],
    ['veh-009', 'Isuzu', 'NPR Refrigerated', 'refrigerated', 'KAN-5519-JKL', 4000, 7, true],
    ['veh-010', 'Hino', '500 Series Van', 'van', 'OWR-6610-HIJ', 3500, 5, false],
    ['veh-011', 'Mercedes', 'Actros 2645', 'truck', 'LAG-8801-AUD', 24000, 32, false],
    ['veh-012', 'Ford', 'Transit Cargo Van', 'van', 'LAG-1203-VAN', 1200, 2, false],
  ];
  const vehStatus: Array<'active' | 'en_route' | 'maintenance' | 'offline'> = [
    'en_route', 'active', 'en_route', 'active', 'en_route', 'maintenance',
    'en_route', 'active', 'en_route', 'en_route', 'active', 'offline',
  ];
  const vehCity = ['Lagos', 'Lagos', 'Abuja', 'Port Harcourt', 'Lagos', 'Lagos', 'Abuja', 'Ibadan', 'Kano', 'Owerri', 'Lagos', 'Lagos'];
  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    await prisma.vehicle.upsert({
      where: { id: v[0] as string },
      update: {},
      create: {
        id: v[0] as string, make: v[1] as string, model: v[2] as string,
        type: v[3] as 'truck' | 'van' | 'refrigerated', plate: v[4] as string,
        capacityKg: v[5] as number, pallets: v[6] as number,
        refrigerated: v[7] === true, status: vehStatus[i], city: vehCity[i],
      },
    });
  }

  // ---- Drivers ------------------------------------------------------------
  const drivers = [
    ['drv-001', 'Ahmed Yusuf', '+234 803 000 0101', 'LG-77892', 4.9, 1280, 'Lagos'],
    ['drv-002', 'Nkechi Aneke', '+234 805 111 0202', 'AB-55112', 4.8, 940, 'Abuja'],
    ['drv-003', 'Suleiman Bello', '+234 806 222 0303', 'KN-33201', 4.7, 1580, 'Kano'],
    ['drv-004', 'Chisom Okafor', '+234 807 333 0404', 'PH-11884', 4.6, 512, 'Port Harcourt'],
    ['drv-005', 'Tunde Adelaja', '+234 808 444 0505', 'IB-90445', 4.9, 703, 'Ibadan'],
    ['drv-006', 'Ifeoma Obi', '+234 809 555 0606', 'OW-66021', 4.8, 611, 'Owerri'],
    ['drv-007', 'Hassan Kwame', '+234 803 666 0707', 'LG-22990', 4.5, 890, 'Lagos'],
    ['drv-008', 'Blessing Etim', '+234 805 777 0808', 'AB-77413', 4.7, 410, 'Abuja'],
  ];
  const drvStatus: Array<'available' | 'on_trip' | 'off_duty'> = [
    'on_trip', 'on_trip', 'available', 'on_trip', 'available', 'on_trip', 'on_trip', 'available',
  ];
  const drvVehicle = ['veh-001', 'veh-003', 'veh-009', 'veh-004', 'veh-008', 'veh-010', 'veh-005', 'veh-007'];
  for (let i = 0; i < drivers.length; i++) {
    const d = drivers[i];
    await prisma.driver.upsert({
      where: { id: d[0] as string },
      update: {},
      create: {
        id: d[0] as string, name: d[1] as string, phone: d[2] as string,
        license: d[3] as string, rating: d[4] as number, trips: d[5] as number,
        status: drvStatus[i], city: d[6] as string,
      },
    });
    await prisma.vehicle.update({ where: { id: drvVehicle[i] as string }, data: { driverId: d[0] as string } });
  }

  // ---- Shipments (5 sample per corridor family) ----------------------------
  const shipments = [
    ['shp-4501', 'BLK-4501', 'cli-dangote', 'tx', 'Lagos', 'Ibadan', 'Ikeja Cargo City', 'Bodija Market', 1800, 14, 4800000, 78500],
    ['shp-4502', 'BLK-4502', 'cli-dangote', 'tx', 'Lagos', 'Ibadan', 'Ikeja Cargo City', 'Challenge', 2200, 18, 5600000, 94200],
    ['shp-4503', 'BLK-4503', 'cli-dangote', 'tx', 'Lagos', 'Ibadan', 'Ikeja Cargo City', 'Apata GRA', 1500, 12, 3900000, 68800],
    ['shp-4504', 'BLK-4504', 'cli-flour', 'adj', 'Lagos', 'Owerri', 'Ikeja Cargo City', 'New Owerri', 3400, 26, 8000000, 168500],
    ['shp-4511', 'BLK-4511', 'cli-globacom', 'tx', 'Lagos', 'Ibadan', 'Ikeja Cargo City', 'Monatan', 800, 6, 2100000, 41200],
    ['shp-4514', 'BLK-4514', 'cli-pharma', 'cl', 'Lagos', 'Abuja', 'Ikeja Cargo City', 'Kubwa Pharma', 700, 5, 9990000, 78000],
    ['shp-4520', 'BLK-4520', 'cli-globacom', 'adj', 'Lagos', 'Kano', 'Ikeja Cargo City', 'Kano Metro', 1200, 10, 3000000, 214000],
    ['shp-4521', 'BLK-4521', 'cli-pharma', 'fail', 'Lagos', 'Abuja', 'Ikeja Cargo City', 'Garki LGA', 540, 4, 8200000, 0],
    ['shp-4522', 'BLK-4522', 'cli-konga', 'tx', 'Lagos', 'Ibadan', 'Ikeja Cargo City', 'Bodija Hub', 900, 7, 1800000, 43600],
    ['shp-4523', 'BLK-4523', 'cli-guinness', 'tx', 'Lagos', 'Ibadan', 'Ikeja Cargo City', 'Ojoo Depot', 2600, 20, 12000000, 86200],
  ] as const;

  let n = 0;
  for (const s of shipments) {
    const [id, ref, clientId, kind, originCity, destCity, origin, destination, weightKg, pallets, valueNgn, costNgn] = s;
    const coldChain = kind === 'cl';
    const status = kind === 'fail' ? 'failed' : coldChain ? 'in_transit' : 'delivered';
    const failureReason = kind === 'fail' ? 'Vehicle breakdown at Ore junction — reefer lost temperature' : null;
    await prisma.shipment.upsert({
      where: { ref },
      update: {},
      create: {
        id, ref, clientId, originCity, destCity, origin, destination,
        weightKg, pallets, valueNgn, costNgn, status, failureReason,
        coldChain, tempC: coldChain ? 3.1 : null,
        etaMinutes: 90 + n * 7, warehouseId: originCity === 'Lagos' ? 'wh-ikeja' : 'wh-abuja',
        driverId: n % 2 === 0 ? 'drv-001' : 'drv-005',
      },
    });
    n++;
  }

  // ---- Routes -------------------------------------------------------------
  const routes = [
    ['rte-401', 'Ikeja → Bodija Corridor', 'Lagos–Ibadan', '2026-11-10', 'dispatched', 'veh-001', 'drv-001', 'cli-dangote'],
    ['rte-402', 'Northbound Pharma Express', 'Lagos–Abuja', '2026-11-10', 'optimized', 'veh-006', 'drv-002', 'cli-pharma'],
    ['rte-403', 'South-East Crossflow', 'Lagos–Owerri', '2026-11-11', 'planned', 'veh-004', 'drv-004', 'cli-flour'],
  ] as const;
  for (const r of routes) {
    const [id, name, corridor, date, status, vehicleId, driverId, clientId] = r;
    await prisma.route.upsert({
      where: { id },
      update: {},
      create: { id, name, corridor, date, status: status as 'planned' | 'optimized' | 'dispatched', vehicleId, driverId, clientId },
    });
  }

  // ---- Stops --------------------------------------------------------------
  const stops = [
    ['stp-401-0', 'rte-401', 0, 'BLK-4501', 'Ibadan', 'Bodija Market', 7.4236, 3.9137, '08:00', '12:00'],
    ['stp-401-1', 'rte-401', 1, 'BLK-4511', 'Ibadan', 'Monatan', 7.4110, 3.9280, '12:30', '15:30'],
    ['stp-401-2', 'rte-401', 2, 'BLK-4503', 'Ibadan', 'Apata GRA', 7.3961, 3.8549, '16:00', '18:30'],
    ['stp-402-0', 'rte-402', 0, 'BLK-4514', 'Abuja', 'Kubwa Pharma', 9.1095, 7.5129, '09:00', '11:00'],
    ['stp-402-1', 'rte-402', 1, 'BLK-4521', 'Abuja', 'Garki LGA', 9.0117, 7.4891, '11:30', '13:30'],
    ['stp-403-0', 'rte-403', 0, 'BLK-4504', 'Owerri', 'New Owerri', 5.4836, 7.0331, '10:00', '14:00'],
  ] as const;
  for (const st of stops) {
    const [id, routeId, sequence, shipmentRef, city, address, lat, lng, windowStart, windowEnd] = st;
    await prisma.stop.upsert({
      where: { id },
      update: {},
      create: { id, routeId, sequence, shipmentRef: shipmentRef as string, city, address, lat, lng, windowStart, windowEnd },
    });
  }

  // ---- Alerts / Reports ---------------------------------------------------
  const alerts = [
    ['alt-1', 'critical', 'Reefer temp breach', 'BLK-4521 cold chain breached 12.4°C at Ore junction.', '2026-11-10T06:40:00Z', 'BLK-4521'],
    ['alt-2', 'warning', 'Delay on Northbound', 'ETA slip of ~3h detected on rte-402 due to trailer service.', '2026-11-10T07:05:00Z', 'rte-402'],
    ['alt-3', 'warning', 'Cost spike — Kano lane', 'Unit cost/mg up 18% vs 4-week baseline on Lagos→Kano.', '2026-11-10T07:20:00Z', 'BLK-4520'],
    ['alt-4', 'info', 'Capacity headroom', 'Ikeja hub at 64% pallet utilisation this week.', '2026-11-10T08:00:00Z', 'wh-ikeja'],
  ] as const;
  for (const a of alerts) {
    const [id, level, title, message, time, entityRef] = a;
    await prisma.alert.upsert({
      where: { id },
      update: {},
      create: { id, level: level as 'info' | 'warning' | 'critical', title, message, time, entityRef },
    });
  }

  const report = { id: 'rep-week44', title: 'Weekly Fleet Ops', period: 'W44 2026', summary: '94.1% success, 91.6% on-time, ₦8,120 avg cost/order.' };
  await prisma.report.upsert({ where: { id: report.id }, update: {}, create: { ...report } });

  console.log('[seed] ShadowSpark Fleet seeded:');
  console.log(`  clients: ${clients.length} · warehouses: ${warehouses.length} · vehicles: ${vehicles.length} · drivers: ${drivers.length}`);
  console.log(`  shipments: ${shipments.length} · routes: ${routes.length} · stops: ${stops.length} · alerts: ${alerts.length}`);
  console.log('[seed] Done.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('[seed] Failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
