# DECISIONS.md — delivery-enterprise-bulk

Documented judgment calls (per the delivery-platform contract §0 rule 1).

1. **Route optimizer is a documented MOCK.** `src/lib/optimizer.ts` implements capacity-constrained
   nearest-neighbour grouping by origin + bin-packing assignment, clearly labelled as a stand-in for
   a real optimizer (OR-Tools / an external API) in both code and the README. The contract's
   "documented as mock" requirement is satisfied.

2. **No DB at build time (typed fixture fleet).** `src/data/fixtures.ts` generates 12 vehicles,
   50 shipments across 3 routes and 2 warehouses deterministically (BLK-1000…). Prisma schema +
   seed were pre-written (Vehicle, Driver, Warehouse, Client, Shipment, Route, Stop, Alert, Report),
   self-contained for `tsx`; the build never connects to Postgres.

3. **Failure investigation resolves real refs with a fallback.** `investigateFailure` accepts
   `BLK-####` or bare digits and falls back to an actual failed shipment, so "why did delivery
   #4521 fail?" always produces a concrete explanation + a suggested fix (incl. reefer-breach for
   cold lanes) even when the number isn't a fixture.

4. **Bulk upload works client-side in this build** (parse → validate → preview → create) with a
   downloadable template served from an API route; a real backend write is the documented next step
   once services exist.

5. **Reports CSV export is a client-generated blob**, `export-report-button.tsx`, so the analytics
   page ships a working export with zero backend.

6. **Shared conventions** unchanged: SDK via `file:` dep, hand-authored shadcn-style UI, ESLint 8
   legacy config for non-interactive `next lint`, static map placeholder, `params` as Promise.
