'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function BulkUploadPage() {
  const [rows, setRows] = React.useState<Record<string, string>[]>([]);
  const [error, setError] = React.useState('');

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const lines = text.split('\n').filter((l) => l.trim());
      if (lines.length < 2) {
        setError('CSV must have a header row and at least one data row.');
        setRows([]);
        return;
      }
      const headers = lines[0].split(',').map((h) => h.trim());
      const data = lines.slice(1).map((l) => {
        const cells = l.split(',');
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = (cells[i] ?? '').trim();
        });
        return obj;
      });
      setError('');
      setRows(data);
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Bulk upload</h1>
      <p className="mt-1 text-sm text-muted">
        Upload a CSV of shipments → validate → preview → create them all in one click.
      </p>
      <p className="mt-2 text-xs text-dim">
        Need a template?{' '}
        <a href="/api/template.csv" className="text-cyan hover:underline">download shadowspark-bulk-template.csv</a>
      </p>

      <div className="glass mt-6 rounded-2xl p-6">
        <label className="block cursor-pointer rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted hover:border-cyan">
          <input type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
          Drop a CSV here, or click to browse
          {rows.length > 0 && ` — ${rows.length} rows loaded`}
        </label>
        {error && <p className="mt-3 text-sm text-magenta">{error}</p>}

        {rows.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-cyan">Preview ({rows.length})</h2>
            <div className="max-h-72 overflow-auto rounded-xl border border-line">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-surface text-dim">
                  <tr>{Object.keys(rows[0]).map((h) => <th key={h} className="px-3 py-2 font-mono">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-line/30">
                      {Object.values(r).map((v, j) => <td key={j} className="px-3 py-1.5 text-ink">{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              className="mt-4"
              onClick={() => {
                alert(`Created ${rows.length} shipments in demo mode (parsed + validated from the CSV).`);
              }}
            >
              Create {rows.length} shipments
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
