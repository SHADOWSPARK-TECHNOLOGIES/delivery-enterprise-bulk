export type VehicleKind = 'van' | 'truck' | 'refrigerated';
export type ShipmentStatus = 'planned' | 'assigned' | 'in_transit' | 'delivered' | 'failed' | 'scheduled';

export interface Vehicle {
  id: string;
  name: string;
  kind: VehicleKind;
  plate: string;
  capacityKg: number;
  status: 'idle' | 'loading' | 'en_route' | 'offline' | 'cold_chain';
  driverId: string;
  zone: string;
  onTimePct: number;
  costPerOrderNgn: number;
}

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  city: string;
}

export interface Shipment {
  id: string;
  ref: string;
  clientId: string;
  routeId: string;
  status: ShipmentStatus;
  itemType: string;
  stops: number;
  weightKg: number;
  coldChain: boolean;
  fromCity: string;
  toCity: string;
  assignedVehicle?: string;
  createdAt: string;
  deliveredAt?: string;
  failureReason?: string;
}

export interface RouteStop {
  id: string;
  shipmentId: string;
  seq: number;
  city: string;
  etaMin: number;
  done?: boolean;
}

export interface Route {
  id: string;
  code: string;
  name: string;
  origin: string;
  vehicles: number;
  stops: RouteStop[];
  status: 'active' | 'planned' | 'complete';
}

export interface Alert {
  id: string;
  kind: 'delay' | 'cost_spike' | 'cold_chain' | 'capacity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  shipmentId?: string;
  vehicleId?: string;
  message: string;
  createdAt: string;
}
