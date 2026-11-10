'use client';

import { SHIPMENTS, VEHICLES } from '@/data/fixtures';

export function ExportReportButton() {
  const download = () => {
    const header = 'city,shipments,delivered,failed,avg_eta_min\n';
    const zones = [...new Set(SHIPMENTS.map((s) => s.fromCity))];
    const rows = zones.map((z) => {
      const inZone = SHIPMENTS.filter((s) => s.fromCity === z);
      const delivered = inZone.filter((s) => s.status === 'delivered').length;
      const failed = inZone.filter((s) => s.status === 'failed').length;
      return `${z},${inZone.length},${delivered},${failed},${inZone.length ? Math.round(inZone.reduce((a, s) => a + s.stops * 90, 0) / inZone.length) : 0}`;
    });
    const blob = new Blob([header + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shadowspark-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={download} className="rounded-lg border border-line px-4 py-2 text-sm text-cyan hover:border-cyan">
      Export CSV
    </button>
  );
}
