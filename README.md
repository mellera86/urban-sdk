# Urban SDK Maps

A Next.js application that browses a catalog of Urban SDK map samples, filters and sorts them by data source, and opens interactive GeoJSON visualizations in a modal. Map metadata, configuration, and layer data are loaded from the Urban API (or compatible sample endpoints).

## What it does

1. **Catalog** — Fetches a list of maps (label, description, preview image, data URLs, config URLs) and displays them as a responsive card grid.
2. **Filter & sort** — Multi-select filter by `subLabel` (data source) and sort by title or source name, entirely on the client.
3. **Map viewer** — Clicking a card opens a dialog that lazy-loads GeoJSON and map config, then renders an interactive Leaflet map with choropleth-style coloring, popups, and optional route-line rendering for GTFS shape data.

## Tech stack

| Layer         | Choice                                                                             |
| ------------- | ---------------------------------------------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org) (App Router)                                      |
| UI            | React 19, Tailwind CSS 4, [Base UI](https://base-ui.com) / shadcn-style primitives |
| Data fetching | TanStack React Query v5                                                            |
| Maps          | [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org)   |

## Project structure

```
app/
├── (routes)/          # App Router pages and layout
├── api/
│   ├── actions/       # Server-callable fetch functions (getMaps, getMapsData, …)
│   ├── fetchers/      # urbanApiFetch — server-side HTTP to Urban API
│   ├── hooks/         # React Query hooks (useMapsQuery, useMapsDataQuery, …)
│   └── models/        # Map, MapConfig, MapGeoJSON types
├── components/        # Shared UI (Button, Dialog, Command, Card, …)
├── features/maps/     # Maps feature: page, cards, dialog, Leaflet view, geojson utils
├── providers/         # QueryClient + ErrorBoundary
└── utils/             # Query keys, shared types, styles
```

Path aliases (`@features/*`, `@api-hooks/*`, `@actions/*`, etc.) keep imports stable as the app grows.

## Architecture decisions

### Server-side API access (`urbanApiFetch`)

All HTTP calls go through a `"use server"` fetcher that prefixes `URBAN_API_BASE_URL` and returns `{ data } | { error }` instead of throwing.

**Why:** Keeps the API base URL off the client, avoids CORS configuration for third-party hosts, and gives a single place to normalize errors.

**Tradeoff:** Every request hits the Next.js server. Adds latency versus a direct browser fetch and uses server bandwidth; acceptable for a BFF-style demo, less ideal for very high traffic or huge payloads without streaming.

### React Query for server-backed data

Hooks in `app/api/hooks` wrap actions with query keys, loading/error state, and optional `enabled` flags.

**Why:** Consistent async UX (spinners, retries), deduplication if multiple components request the same URL, and declarative cache invalidation.

**Tradeoff:** Extra client bundle and mental overhead versus `useEffect` + `fetch`. Catalog and per-map queries use different cache policies on purpose (longer-lived list vs ephemeral GeoJSON).

### Feature folder for maps

Maps UI, hooks usage, GeoJSON helpers, and sort/filter logic live under `app/features/maps/`.

**Why:** The rest of the app can stay thin (e.g. `app/(routes)/page.tsx` only renders `MapsPage`). New features can follow the same pattern without bloating `components/`.

**Tradeoff:** Some shared pieces (e.g. `ApiResponseWrapper`) still live in `components/`; strict feature isolation is not enforced everywhere.

### Leaflet instead of Mapbox GL / deck.gl

Rendering uses react-leaflet `GeoJSON`, circle markers for points, and Carto/ArcGIS tile URLs derived from `MapConfig.mapStyle.styleType`.

**Why:** Straightforward GeoJSON support, small integration surface, and alignment with sample configs that describe center/zoom/style rather than custom GL layers.

**Tradeoff:** Weaker performance and styling flexibility than WebGL stacks for massive datasets. Mitigations in code: `preferCanvas` when feature count > 500, and disabled hover styling on large layers.

### Filter and sort in memory (`useMapFilterAndSorter`)

Filtering by `subLabel` and sorting by label or source happen in `useMemo` over the catalog array.

**Why:** Simple and instant UX for demo-sized catalogs; no extra API parameters or pagination API required.

**Tradeoff:** Does not scale to thousands of maps without virtual scrolling, server-side filter/query params, or paginated list endpoints.

### App-level `ErrorBoundary`

Uncaught render errors show a fallback with reset; query failures still use per-query error UI.

**Why:** Prevents a single component crash from blanking the whole tree.

**Tradeoff:** Does not replace network/error handling inside queries or dialogs.

## Environment

Create `.env.local`:

```bash
URBAN_API_BASE_URL=https://cdn.urbansdk.com
```

## Getting started

Requires [pnpm](https://pnpm.io) (see `packageManager` in `package.json`).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build   # production build
pnpm start   # run production server
pnpm lint    # ESLint
```

## Key behaviors to know
