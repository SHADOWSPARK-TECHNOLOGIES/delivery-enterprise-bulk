// Downloadable bulk-send template (CSV).
import { NextResponse } from 'next/server';

export function GET() {
  const csv = [
    'client_id,item_type,weight_kg,from_city,to_city,cold_chain,stops',
    'cl-01,Pharma (cold),120,Lagos,Abuja,true,3',
    'cl-02,Groceries,900,Lagos,Owerri,false,4',
    'cl-03,Food (chilled),600,Owerri,Port Harcourt,true,2',
    'cl-05,Auto parts,1400,Ibadan,Lagos,false,3',
  ].join('\n');
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="shadowspark-bulk-template.csv"',
    },
  });
}
