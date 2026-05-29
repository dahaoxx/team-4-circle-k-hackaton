# Team 4 — Circle K Hackathon

A .NET **proxy API** that sits between our frontend (app/website) and the Circle K
Hackathon backend. It integrates every upstream endpoint, normalizes the data, handles
CORS, and is where we add custom server-side business logic.

```
App / Website  ──▶  CircleK.ProxyApi (.NET)  ──▶  Circle K backend (Cloud Run)
```

## Quick start

```bash
dotnet run --project src/CircleK.ProxyApi
# → http://localhost:5180   (Swagger UI: http://localhost:5180/swagger)
```

## Layout

| Path | What |
| --- | --- |
| `src/CircleK.ProxyApi/` | The proxy API (ASP.NET Core, .NET 10) |
| `src/CircleK.ProxyApi/Models/` | Typed records for all 9 resources |
| `src/CircleK.ProxyApi/Services/` | `ICircleKClient` — typed gateway to the upstream API |
| `src/CircleK.ProxyApi/Controllers/` | Per-resource proxy controllers + `InsightsController` (custom logic) |
| `docs/frontend-integration.md` | **How the frontend integrates with this proxy** (start here for UI work) |
| `docs/circle-k-api.md` | Upstream Circle K API reference (fields per resource) |
| `docs/openapi.json` | Raw upstream OpenAPI spec |

## Docs

- **Building the frontend?** → [`docs/frontend-integration.md`](docs/frontend-integration.md)
- **Need upstream field details?** → [`docs/circle-k-api.md`](docs/circle-k-api.md)

## Configuration

`src/CircleK.ProxyApi/appsettings.json`:
- `CircleK:BaseUrl` — upstream backend URL.
- `CircleK:Cors:AllowedOrigins` — lock to your frontend origin(s) in prod (empty = allow any, for dev).
