# ShadowSpark Fleet — Enterprise / Bulk Logistics (Nigeria)

Fleet dashboard, CSV bulk upload, route optimization and cold-chain monitoring for enterprise
delivery teams moving dozens to thousands of shipments a day — Lagos to Kano and everywhere between.

Part of the ShadowSpark delivery-platform suite (see `../delivery-ai-agents-common`).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 3 · ESLint 8 · Prisma 5 · pnpm.

## Features & pages

- `/` — Enterprise landing: fleet stats, client list, "Request demo" CTA.
- `/dashboard` — Fleet overview: live map (placeholder), success rate / on-time % / avg cost, vehicle
  + shipment boards.
- `/bulk-upload` — CSV upload → parse → validate → preview → create N shipments. Downloadable
  template at `/api/template.csv`.
- `/scheduled` — weekly route plan + upcoming scheduled shipments with time windows.
- `/routes/[id]` — optimized stop sequence (mock nearest-neighbour + capacity), map, driver assignment.
- `/reports` — analytics (delivery success by zone, time analysis, cost breakdown) + CSV export.
- `/cold-chain` — temperature-alert monitoring for pharma/food lanes.
- Floating AI assistant on every page: **batch optimization**, **failure investigation**
  ("Why did shipment fail?"), **anomaly scan**, human handoff.

## Quick start

```bash
pnpm install
cp .env.example .env          # fill in what you need
pnpm dev                      # http://localhost:3000
```

## AI assistant

`src/app/api/chat/route.ts` + `src/lib/agent.ts` run the shared SDK agent with map + dispatch tool
domains and custom vertical tools (`investigateFailure`, `optimizeBatch`, `checkAnomalies`) wired to
the typed fixtures and `src/lib/optimizer.ts` (a documented mock nearest-neighbour route optimizer).
Falls back to the rule-based `MockLLM` with no API key; `OPENAI_API_KEY` swaps in a real LLM.

## Database

`prisma/schema.prisma` (Vehicle, Driver, Warehouse, Client, Shipment, Route, Stop, Alert, Report)
validates with `pnpm db:validate`. The build never queries a database — pages render from
`src/data/fixtures.ts` (12 vehicles, 50 shipments, 3 routes, 2 warehouses). Real backend:
`pnpm db:generate && pnpm db:seed`.

## Env vars (see `.env.example`)

`DATABASE_URL` · `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `OPENAI_MODEL` · `NEXT_PUBLIC_MAPBOX_TOKEN`

## Gates

```bash
pnpm tsc --noEmit && pnpm lint && pnpm build
```

## License
MIT — ShadowSpark Technologies, Owerri, Nigeria.
