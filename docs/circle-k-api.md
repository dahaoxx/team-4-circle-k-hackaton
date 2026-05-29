# Circle K Hackathon API Reference

REST API over a synthetic **Circle K Norge** dataset (Umain OSL Hackathon — *Future of
Circle K*). Each deployed instance has its own **mutable** copy of the data — feel free to
create, update, and delete records. Restore the original seed with `POST /api/admin/reset`.

> Synthetic data only. No real customers or transactions. Macro figures and patterns are
> inspired by public information about Circle K Norway.

- **Base URL:** `https://circle-k-group-4-775886516859.europe-north2.run.app`
- **Swagger UI:** [`/docs/`](https://circle-k-group-4-775886516859.europe-north2.run.app/docs/)
- **OpenAPI spec:** [`/openapi.json`](https://circle-k-group-4-775886516859.europe-north2.run.app/openapi.json) — committed at [`docs/openapi.json`](./openapi.json)
- **Version:** 1.0.0 · **Currency:** NOK · **Language:** en
- **Health check:** `GET /health`

## Dataset size

| Entity | Count |
| --- | --- |
| stations | 30 |
| loyalty_members | 120 |
| charging_sessions | 600 |
| fuel_transactions | 400 |
| store_transactions | 741 |
| carwash_visits | 150 |
| app_events | 900 |
| employees | 179 |
| weather_observations | 200 |

## Conventions

**CRUD.** Every resource collection supports the standard REST set:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/{resource}` | List (paginated) |
| `POST` | `/api/{resource}` | Create |
| `GET` | `/api/{resource}/{id}` | Get one by id |
| `PUT` | `/api/{resource}/{id}` | Replace |
| `PATCH` | `/api/{resource}/{id}` | Partial update |
| `DELETE` | `/api/{resource}/{id}` | Delete |

**List query parameters** (all `GET /api/{resource}` endpoints):

| Param | Type | Default | Notes |
| --- | --- | --- | --- |
| `limit` | integer | `50` | Page size, 1–1000 |
| `offset` | integer | `0` | Number of records to skip |
| `q` | string | — | Substring search across all fields |
| *any top-level scalar field* | — | — | Exact-match filter, e.g. `?city=Oslo&manned=true` |

**List response envelope:**

```json
{ "total": 30, "limit": 50, "offset": 0, "data": [ /* records */ ] }
```

**Status codes:** `200` OK · `201` Created · `400` Bad Request · `404` Not Found ·
`409` Conflict.

## Resources

Resource paths use the snake_case names below, e.g. `GET /api/loyalty_members`.

### stations
`GET/POST /api/stations` · `GET/PUT/PATCH/DELETE /api/stations/{id}`

| Field | Type |
| --- | --- |
| `station_id` | string |
| `name` | string |
| `city` | string |
| `region` | string |
| `type` | string (e.g. `urban`) |
| `manned` | boolean |
| `lat` | number |
| `lng` | number |
| `fuel_pumps` | integer |
| `ev_chargers` | object — `{ "50kW", "150kW", "350kW", "total" }` (integers) |
| `has_carwash` | boolean |
| `has_kitchen` | boolean |
| `has_extra_seating` | boolean |
| `opened_date` | string (date, `YYYY-MM-DD`) |

### loyalty_members
`GET/POST /api/loyalty_members` · `GET/PUT/PATCH/DELETE /api/loyalty_members/{id}`

| Field | Type |
| --- | --- |
| `member_id` | string |
| `extra_member` | boolean |
| `joined_date` | string (date) |
| `tier` | string |
| `is_active` | boolean |
| `age_band` | string |
| `vehicle_type` | string |
| `vehicle_model` | string |
| `battery_kwh` | integer |
| `avg_visits_per_month` | integer |
| `lifetime_spent_nok` | integer |
| `preferred_station_id` | string |
| `opt_in_marketing` | boolean |
| `opt_in_personalisation` | boolean |
| `app_user` | boolean |

### charging_sessions
`GET/POST /api/charging_sessions` · `GET/PUT/PATCH/DELETE /api/charging_sessions/{id}`

| Field | Type |
| --- | --- |
| `session_id` | string |
| `station_id` | string |
| `member_id` | string |
| `started_at` | string (date-time) |
| `duration_min` | integer |
| `kwh_delivered` | number |
| `charger_max_kw` | integer |
| `avg_session_kw` | number |
| `price_per_kwh_nok` | number |
| `amount_nok` | number |
| `entered_store` | boolean |
| `store_spent_nok` | number |
| `payment_method` | string |
| `weekday` | string |
| `hour_of_day` | integer |

### fuel_transactions
`GET/POST /api/fuel_transactions` · `GET/PUT/PATCH/DELETE /api/fuel_transactions/{id}`

| Field | Type |
| --- | --- |
| `transaction_id` | string |
| `station_id` | string |
| `member_id` | string |
| `timestamp` | string (date-time) |
| `fuel_type` | string |
| `litres` | number |
| `price_per_litre_nok` | number |
| `amount_nok` | number |
| `payment_method` | string |
| `linked_carwash_purchase` | boolean |
| `linked_store_purchase` | boolean |

### store_transactions
`GET/POST /api/store_transactions` · `GET/PUT/PATCH/DELETE /api/store_transactions/{id}`

| Field | Type |
| --- | --- |
| `transaction_id` | string |
| `station_id` | string |
| `member_id` | string |
| `timestamp` | string (date-time) |
| `items` | array of `{ name: string, price_nok: integer, category: string }` |
| `total_nok` | integer |
| `payment_method` | string |
| `during_charging_session` | boolean |
| `hour_of_day` | integer |
| `weekday` | string |

### carwash_visits
`GET/POST /api/carwash_visits` · `GET/PUT/PATCH/DELETE /api/carwash_visits/{id}`

| Field | Type |
| --- | --- |
| `visit_id` | string |
| `station_id` | string |
| `member_id` | string |
| `timestamp` | string (date-time) |
| `wash_type` | string |
| `amount_nok` | integer |
| `is_subscription` | boolean |

### app_events
`GET/POST /api/app_events` · `GET/PUT/PATCH/DELETE /api/app_events/{id}`

| Field | Type |
| --- | --- |
| `event_id` | string |
| `member_id` | string |
| `timestamp` | string (date-time) |
| `event_type` | string |
| `session_duration_seconds` | integer |
| `platform` | string |

### employees
`GET/POST /api/employees` · `GET/PUT/PATCH/DELETE /api/employees/{id}`

| Field | Type |
| --- | --- |
| `employee_id` | string |
| `station_id` | string |
| `role` | string |
| `shift_pattern` | string |
| `tenure_months` | integer |
| `is_full_time` | boolean |
| `trained_barista` | boolean |
| `trained_kitchen` | boolean |

### weather_observations
`GET/POST /api/weather_observations` · `GET/PUT/PATCH/DELETE /api/weather_observations/{id}`

| Field | Type |
| --- | --- |
| `observation_id` | string |
| `station_id` | string |
| `date` | string (date) |
| `temp_c` | number |
| `precipitation_mm` | number |
| `snow` | boolean |
| `wind_ms` | number |
| `conditions` | string |

## Metadata & admin endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/metadata` | Dataset metadata (read-only) — name, purpose, entity counts |
| `GET` | `/api/strategic-context` | Strategic context block (read-only) |
| `GET` | `/api/admin/export` | Download the current state as JSON |
| `POST` | `/api/admin/reset` | Reset state from the seed dataset |
| `GET` | `/health` | Health check |

## Examples

```bash
BASE="https://circle-k-group-4-775886516859.europe-north2.run.app"

# List the first 2 stations
curl -s "$BASE/api/stations?limit=2"

# Filter + substring search
curl -s "$BASE/api/stations?city=Oslo&manned=true"
curl -s "$BASE/api/loyalty_members?q=premium&limit=10"

# Get one record by id
curl -s "$BASE/api/stations/CK-NO-001"

# Create a record
curl -s -X POST "$BASE/api/carwash_visits" \
  -H 'Content-Type: application/json' \
  -d '{"visit_id":"CW-9999","station_id":"CK-NO-001","wash_type":"premium","amount_nok":189,"is_subscription":false}'

# Partial update
curl -s -X PATCH "$BASE/api/stations/CK-NO-001" \
  -H 'Content-Type: application/json' \
  -d '{"has_carwash":false}'

# Restore the original seed data
curl -s -X POST "$BASE/api/admin/reset"
```

---

The machine-readable spec lives at [`docs/openapi.json`](./openapi.json). It can drive a
typed client generator (NSwag / Kiota / OpenAPI Generator) for this .NET workspace if
needed.
