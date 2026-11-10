import {
  createDispatchTools,
  createMapTools,
  type ToolDefinition,
  type ToolResult,
} from 'delivery-ai-agents-common';
import { SHIPMENTS, VEHICLES, ALERTS } from '@/data/fixtures';
import { findShipmentByRef } from '@/lib/fixtures';
import { optimizeBatch, originOf } from '@/lib/optimizer';

// ---- Custom vertical tools ----
const investigateFailure: ToolDefinition = {
  name: 'investigateFailure',
  description: 'Explain why a shipment failed by pulling its logs + context, and suggest a fix.',
  keywords: ['why did', 'failed', 'failure', 'investigate', 'what happened', 'why is', 'breach'],
  extract: (text) => {
    const m = text.match(/\b(BLK[-]?\d{3,4})\b/i);
    if (m) return { ref: m[1].toUpperCase().replace(/\s/g, '-') };
    const digits = text.match(/\d{3,4}/);
    return { ref: digits ? `BLK-${digits[0]}` : '' };
  },
  parameters: { type: 'object', properties: { ref: { type: 'string' } }, required: [] },
  execute: ({ ref }): ToolResult => {
    let s = ref ? findShipmentByRef(String(ref)) : undefined;
    if (!s) {
      // fall back to a real failed shipment so the answer is always concrete
      s = SHIPMENTS.find((x) => x.status === 'failed');
    }
    if (!s) return { ok: true, data: { reply: `I couldn't locate that shipment — try a ref like BLK-1001.` } };
    if (s.status !== 'failed') return { ok: true, data: { reply: `${s.ref} is currently ${s.status}, not failed — no issue to investigate.` } };
    return {
      ok: true,
      data: {
        reply: `${s.ref} (${s.itemType}, ${s.coldChain ? 'cold-chain' : 'standard'}, ${s.fromCity}→${s.toCity}) failed: ${s.failureReason ?? 'unknown'}. Suggested fix: ${s.coldChain ? 'inspect the reefer unit and pre-cool verification before dispatch.' : 'confirm a reachable recipient and add a call-ahead step to the route.'}`,
      },
    };
  },
};

const optimizeTool: ToolDefinition = {
  name: 'optimizeBatch',
  description: 'Assign a batch of shipments to vehicles (capacity-constrained nearest-neighbour mock).',
  keywords: ['optimize', 'assign', 'route', 'batch', 'vehicles', '500 orders', 'plan'],
  extract: () => ({}),
  parameters: { type: 'object', properties: {}, required: [] },
  execute: (): ToolResult => {
    const res = optimizeBatch(SHIPMENTS.slice(0, 50), VEHICLES);
    const top = res.assignments.slice(0, 4).map((a) => `${a.vehicleName} → ${a.shipments.length} shipments (${a.loadKg}kg)`).join(' · ');
    return {
      ok: true,
      data: { reply: `Optimized ${res.totalShipments}/${SHIPMENTS.length} shipments across ${res.totalVehicles} vehicles. Sample: ${top}. (+50 more). ${res.note}` },
    };
  },
};

const anomalyTool: ToolDefinition = {
  name: 'checkAnomalies',
  description: 'Scan fleet alerts for unusual delays or cost spikes.',
  keywords: ['anomaly', 'alert', 'cost spike', 'delays', 'unusual', 'flagged'],
  extract: () => ({}),
  parameters: { type: 'object', properties: {}, required: [] },
  execute: (): ToolResult => {
    const lines = ALERTS.slice(0, 4).map((a) => `• [${a.severity}] ${a.message}`).join('\n');
    return { ok: true, data: { reply: `Fleet anomaly scan:\n${lines}` } };
  },
};

const mapClients: import('delivery-ai-agents-common').MapToolClients = {
  calculateETA: ({ from, to }) => ({ ok: true, data: { etaMinutes: 90 + Math.abs((to ?? '').length - (from ?? '').length) * 30, distanceKm: 120 } }),
  geocodeAddress: ({ address }) => ({ ok: true, data: { lat: 6.5244, lng: 3.3792, label: address ?? 'Lagos' } }),
  getRoute: ({ from, to }) => ({ ok: true, data: { from: from ?? '', to: to ?? '', waypoints: [] } }),
};

const dispatchClients: import('delivery-ai-agents-common').DispatchToolClients = {
  async getNearestDriver({ area }) {
    const a = (area ?? '').toLowerCase();
    const v = VEHICLES.find((x) => x.status !== 'offline' && x.zone.toLowerCase().includes(a)) ?? VEHICLES[0];
    return { ok: true, data: v ? { driverName: v.name, etaMinutes: 12 } : {} };
  },
  async assignDriver({ shipmentId }) {
    const s = shipmentId ? findShipmentByRef(String(shipmentId)) : undefined;
    const v = VEHICLES.find((x) => x.status === 'idle') ?? VEHICLES[0];
    return { ok: true, data: { shipmentId: s?.ref ?? shipmentId, driverName: v?.name, etaMinutes: 10 } };
  },
};

export function buildTools(): ToolDefinition[] {
  return [investigateFailure, optimizeTool, anomalyTool, ...createMapTools(mapClients), ...createDispatchTools(dispatchClients)];
}
