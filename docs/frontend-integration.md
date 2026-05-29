# Frontend Integration Guide — Circle K Proxy API

This is the guide for the **app/website** team. You integrate against **our .NET proxy
API** (`CircleK.ProxyApi`), *not* the raw Circle K backend. The proxy is the single place
where we add custom server-side logic, normalize the data, and handle CORS.

```
┌────────────┐      camelCase JSON      ┌────────────────┐   snake_case JSON   ┌──────────────────────┐
│  App /     │ ───────────────────────▶ │  CircleK.Proxy  │ ──────────────────▶ │  Circle K Hackathon   │
│  Website   │ ◀─────────────────────── │  API (.NET)     │ ◀────────────────── │  backend (Cloud Run)  │
└────────────┘                          └────────────────┘                     └──────────────────────┘
        you build this                  this repo (src/)                        upstream, see circle-k-api.md
```

**Why go through the proxy instead of calling Circle K directly?**
- **Custom logic** — aggregations/business endpoints live server-side (see `/api/insights/...`).
- **One integration point** — swap upstream URL, add auth/caching, without touching the frontend.
- **CORS handled** — the proxy sets CORS headers so browser calls just work.
- **Clean shape** — responses are normalized to **camelCase** (JS-friendly).

---

## 1. Running the proxy locally

```bash
cd src/CircleK.ProxyApi
dotnet run
```

| URL | What |
| --- | --- |
| `http://localhost:5180` | API base (HTTP profile) |
| `https://localhost:7173` | API base (HTTPS profile: `dotnet run --launch-profile https`) |
| `http://localhost:5180/swagger` | Swagger UI (interactive docs, Development only) |
| `http://localhost:5180/health` | Liveness check → `{"status":"ok"}` |

Point your frontend at the base URL, e.g. `const API = "http://localhost:5180";`.

## 2. Configuration

Set in `src/CircleK.ProxyApi/appsettings.json` (or via env vars with `__`):

| Key | Env var | Default | Purpose |
| --- | --- | --- | --- |
| `CircleK:BaseUrl` | `CircleK__BaseUrl` | the Cloud Run URL | Upstream backend |
| `CircleK:Cors:AllowedOrigins` | `CircleK__Cors__AllowedOrigins__0` | `[]` (allow any) | Lock CORS to your frontend origin(s) in prod, e.g. `["https://app.example.com"]` |

## 3. Conventions

- **JSON casing:** requests and responses use **camelCase** (`stationId`, `evChargers`,
  `hasCarwash`). The proxy translates to/from the upstream snake_case for you.
- **List envelope:** every list returns `{ total, limit, offset, data: [...] }`.
- **Pagination:** `?limit=` (1–1000, default 50) and `?offset=`.
- **Search:** `?q=` substring search across all fields.
- **Filtering:** any field as a query param, e.g. `?city=Oslo&manned=true`.
- **Partial update:** `PATCH` only sends the fields you include; the rest are untouched.
- **Errors:** upstream status codes are relayed faithfully (`400`, `404`, `409`); the
  proxy's own failures surface as `5x` ProblemDetails.

## 4. Endpoint reference

Each resource supports the full REST set: `GET` (list), `POST` (create),
`GET/PUT/PATCH/DELETE /{id}`.

| Resource | Route |
| --- | --- |
| Stations | `/api/stations` |
| Loyalty members | `/api/loyalty-members` |
| Charging sessions | `/api/charging-sessions` |
| Fuel transactions | `/api/fuel-transactions` |
| Store transactions | `/api/store-transactions` |
| Carwash visits | `/api/carwash-visits` |
| App events | `/api/app-events` |
| Employees | `/api/employees` |
| Weather observations | `/api/weather-observations` |

**Metadata & admin**

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/metadata` | Dataset metadata + entity counts |
| `GET` | `/api/strategic-context` | Hackathon strategic context |
| `GET` | `/api/admin/export` | Full dataset export (JSON) |
| `POST` | `/api/admin/reset` | Reset upstream data to seed |

**Custom logic (build more of these!)**

| Method | Route | Returns |
| --- | --- | --- |
| `GET` | `/api/insights/stations/{stationId}/charging-summary` | Per-station charging KPIs: `sessionCount`, `totalKwh`, `totalRevenueNok`, `avgSessionKwh`, `storeConversionRate`, `storeRevenueNok` |

> For the upstream field-level schema of each resource, see [`circle-k-api.md`](./circle-k-api.md).
> Our proxy returns the same fields in camelCase.

## 5. Code examples (TypeScript / fetch)

```ts
const API = "http://localhost:5180";

// List with pagination + filter
async function getOsloStations() {
  const res = await fetch(`${API}/api/stations?city=Oslo&limit=20`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const page = await res.json(); // { total, limit, offset, data }
  return page.data;
}

// Substring search
const r = await fetch(`${API}/api/loyalty-members?q=premium&limit=10`);

// Get one
const station = await (await fetch(`${API}/api/stations/CK-NO-001`)).json();

// Create
await fetch(`${API}/api/carwash-visits`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    visitId: "CW-9001", stationId: "CK-NO-001",
    washType: "premium", amountNok: 189, isSubscription: false,
  }),
});

// Partial update
await fetch(`${API}/api/stations/CK-NO-001`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ hasCarwash: false }),
});

// Delete
await fetch(`${API}/api/stations/CK-NO-001`, { method: "DELETE" }); // 204 on success

// Custom insights endpoint
const summary = await (
  await fetch(`${API}/api/insights/stations/CK-NO-001/charging-summary`)
).json();
```

### Suggested TypeScript types

```ts
export interface Page<T> { total: number; limit: number; offset: number; data: T[]; }

export interface Station {
  stationId: string; name: string; city: string; region: string; type: string;
  manned: boolean; lat: number; lng: number; fuelPumps: number;
  evChargers: Record<string, number>; // {"50kW":0,"150kW":4,"350kW":1,"total":5}
  hasCarwash: boolean; hasKitchen: boolean; hasExtraSeating: boolean; openedDate: string;
}
// ...mirror the other resources from circle-k-api.md (camelCase the field names).
```

## 6. Adding your own custom endpoint (backend team)

1. Add an action to the relevant resource controller in
   `src/CircleK.ProxyApi/Controllers/` (e.g. `StationsController`), **or** add a new
   method to `InsightsController` for cross-resource logic.
2. Use the injected `ICircleKClient` (`Client.ListAsync<T>`, `GetAsync<T>`,
   `CreateAsync`, …) to talk to upstream — see `InsightsController.cs` for the pattern.
3. Return a purpose-built record so the frontend gets exactly the shape it needs.

The frontend then calls your new route — no upstream knowledge required.
