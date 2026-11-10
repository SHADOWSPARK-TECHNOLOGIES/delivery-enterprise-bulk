import { SHIPMENTS, VEHICLES } from '@/data/fixtures';
import type { Shipment, Vehicle } from '@/types';

export const findShipmentByRef = (ref: string): Shipment | undefined =>
  SHIPMENTS.find((s) => s.ref.toLowerCase() === ref.trim().toLowerCase());

export const findVehicle = (id: string | undefined): Vehicle | undefined =>
  VEHICLES.find((v) => v.id === id);

export const shipmentsForRoute = (routeId: string): Shipment[] =>
  SHIPMENTS.filter((s) => s.routeId === routeId);

export const clientById = (id: string) => {
  // avoid circular import: local map from fixture client ids
  const names: Record<string, string> = {
    'cl-01': 'Zuma Pharma', 'cl-02': 'Naija Mart Group', 'cl-03': 'Greenfield Cold Chain',
    'cl-04': 'Urban Clothiers', 'cl-05': 'BrightParts Auto', 'cl-06': 'MedPlus Group',
  };
  return { id, name: names[id] ?? id };
};
