# Kvil — Implementation Plan

> Prototype plan for the **Kvil — ta deg ein kvil** concept (see
> [`Kvil — ta deg ein kvil ...md`](./Kvil%20—%20ta%20deg%20ein%20kvil%2036f1f15509d88191b9d4d76e66f46b66.md)).
> Goal: a demoable, brand-rich mobile mock backed by real dataset-driven numbers,
> buildable in roughly the brief's "two-hour prototype" window.

## 1. What we're building

A **single-file, brand-rich mobile mock** (`web/index.html`) inside a phone frame, plus a
small number of **custom proxy endpoints** so two things are real, not faked:

1. the **Snøgg charge-time window** ("you've got 14 minutes at Brygga"), and
2. the **data panel** (premium-member spend lift + modelled Kvilpasset revenue).

Everything else (place pages, passport, menus) is brand/narrative and can be static, but
reads from the same proxy where it adds credibility. The mock embeds **fallback fixtures**
so the demo never depends on a live network.

```
web/index.html  ──fetch──▶  CircleK.ProxyApi  ──▶  Circle K dataset (30 stations, etc.)
   (mobile mock)            new /api/kvil/* endpoints
        └── embedded fixtures (used if the proxy is unreachable)
```

**Architecture decision (assumption):** front-end is a single self-contained HTML file
(inline CSS + vanilla JS, no build step) — matches the brief and is the fastest path to a
polished demo. It is served **through the proxy from `wwwroot/`** so it's same-origin (no
CORS friction) and the whole thing runs from one `dotnet run`. If the team prefers React,
swap Phase 2 for a Vite app; the backend plan is unchanged.

## 2. Mapping Kvil's places onto real stations

The brief's places are fictional; the dataset has 30 real stations. We map each narrative
place to the best-fitting real station so all stats are genuine:

| Kvil place | Real station | Why |
| --- | --- | --- |
| **Bakeriet på Nebbenes** | `CK-NO-010` Lørenskog (motorway, 15 chargers, kitchen+seating) | Busiest E6-style rest-stop analogue |
| **Brygga i Lærdal** | `CK-NO-021` Ålesund (Vestlandet, kitchen+seating) | Fjord/Vestlandet, coastal food story |
| **Stova på Dombås** | `CK-NO-028` Trysil (Innlandet, `highway_destination`) | Mountain-cabin / Dovre-crossing vibe |
| **Kaia i Lofoten** *(stretch / 4th)* | `CK-NO-022` Bodø (Nord-Norge, coast) | "Coffee, cod, and the light" |

These IDs are the only place-specific config the front-end and endpoints need.

## 3. Backend — new `KvilController` (`/api/kvil`)

Follow the existing `InsightsController` pattern exactly: inject `ICircleKClient`, page
through upstream lists, return a purpose-built record (nested records in the controller,
camelCase out). Add **`Controllers/KvilController.cs`**.

### 3.1 `GET /api/kvil/places`
Returns the curated Kvil places, each enriched from real data:
- station core (name, city, region, `evChargers.total`, kitchen/seating) via `GetAsync<Station>`,
- **top store categories** for that station from `store_transactions` (drives the "local
  signature" — e.g. bakery/cider/coffee),
- a synthesized **bays-free** number for the route card.

Powers the route card + the three place pages.

### 3.2 `GET /api/kvil/snogg/charge-estimate?stationId=&memberId=&socPct=`
The hero number. Computes the Snøgg window:
- energy needed = `batteryKwh * (targetSoc − socPct)/100` (target default 80%),
- effective power = `min(station bestChargerKw, vehicle accept)` with a taper above ~80% SoC,
- **cold-weather derate** from latest `weather_observations` for the station
  (e.g. `tempC < 0 → ×0.8`, snow → further penalty),
- `minutes = energy / effectiveAvgKw * 60`.

Returns `{ stationName, minutes, fromSoc, toSoc, kwhToAdd, chargerKw, weather, derateApplied }`.
`memberId` resolves `batteryKwh`/`vehicleModel` from `loyalty_members`; falls back to a
default EV profile if omitted. Keep the model **explainable** — the demo should be able to
show "why 14 minutes."

### 3.3 `GET /api/kvil/kvilpasset/economics`
The data panel. Cross-resource aggregation:
- **Spend lift:** compare premium/top-tier members vs the rest using
  `loyalty_members.lifetimeSpentNok` and store-conversion of charging stops
  (`charging_sessions.enteredStore` + `storeSpentNok`).
- **Recurring-revenue proof:** `carwash_visits.isSubscription` share → Norwegians already
  pay for subscriptions.
- **Modelled Kvilpasset revenue:** premium-segment size × assumed monthly price ×
  retention; return low/expected/high.

Returns a compact record the panel renders directly (no client-side crunching).

> All three reuse `client.ListAsync<T>` with paging, exactly like
> `InsightsController.ChargingSummary`. No upstream/model changes required — the existing
> `Station`, `LoyaltyMember`, `ChargingSession`, `StoreTransaction`, `CarwashVisit`,
> `WeatherObservation` records already cover every field used.

### 3.4 Serve the mock
In `Program.cs`: add `app.UseDefaultFiles()` + `app.UseStaticFiles()` and drop the mock in
`wwwroot/index.html`, so `http://localhost:5180/` opens the prototype. (Two lines; keeps
one-command run.)

## 4. Front-end — `web/index.html` (→ `wwwroot/`)

### 4.1 Brand system (shared chrome)
- **Name/voice:** *Kvil*, tagline *"Ta deg ein kvil"*; Nynorsk microcopy throughout.
- **Type:** a warm serif for headings + a clean sans for UI.
- **Chrome:** neutral Kvil shell (status bar, bottom nav) + the small **"eit Kvil-sted"**
  endorser mark and tiny **"drift av Circle K"** line — the Tier-1/2/3 hierarchy made visual.
- **Per-place palettes** so each place "is itself": fjord blue-green (Lærdal), warm
  wood/amber (Dombås), bakery cream (Nebbenes), cold coastal light (Lofoten). Unified only
  by the Kvil mark.
- Phone frame + simple hash-router between screens.

### 4.2 Screens (build order = demo order)
1. **Route / home** — map-ish hero with the Kvil-sted card ahead:
   *"Eit Kvil-sted, 40 min fram. Brygga i Lærdal — local cider, smoked trout, 6 fast bays free."*
   (place + bays from `/api/kvil/places`).
2. **Plug-in moment** *(hero)* — the **Kvil (stay) / Snøgg (to the car)** toggle appears on
   plug-in; live **charge-time window** from `/api/kvil/snogg/charge-estimate`.
3. **Snøgg flow** — curated menu (signature + "your usual") → one-tap pre-order → **kitchen
   timer** counting down to ~2 min before the battery → *"Delivered to bay 3, ready before
   your car."* → receipt + points.
4. **Place pages ×3** (Nebbenes / Lærdal / Dombås) — each its own look, host, local
   signature; unified by the small *eit Kvil-sted* mark.
5. **Kvilpasset + passport** — join flow, places-collected stamp screen, premium perks.
6. **Data panel** — premium spend lift + modelled Kvilpasset revenue from
   `/api/kvil/kvilpasset/economics`; one or two simple bar/number viz.

### 4.3 Data layer
A tiny `api()` helper: try the proxy, fall back to embedded `FIXTURES` on any error so the
mock is demo-proof offline. One `PLACES` config object holds the station-ID mapping from §2.

## 5. Build phases & sequencing

| Phase | Output | Priority |
| --- | --- | --- |
| **0. Scaffold** | `wwwroot` static serving + empty `KvilController` + phone-frame shell | must |
| **1. Backend Kvil endpoints** | `/places`, `/snogg/charge-estimate`, `/kvilpasset/economics` | must |
| **2. Brand shell + nav** | palettes, type, bottom nav, *eit Kvil-sted* mark | must |
| **3. Hero flow** | route card → plug-in toggle → **Snøgg** order → kitchen timer → delivered | **must (do first after scaffold)** |
| **4. Three place pages** | distinct themes + local signatures | should |
| **5. Kvilpasset + passport** | join + collected stamps + perks | should |
| **6. Data panel** | wired to economics endpoint | should |
| **7. Polish** | fixtures fallback, copy pass, demo script | should |

**If time is short:** Phases 0→1(charge-estimate only)→2→3 are the demo. The plug-in →
Snøgg → "delivered to your bay" sequence is the moment that sells the concept; build it
end-to-end before breadth.

## 6. Rubric mapping (what each piece scores)

- **Concept strength** — the Kvil mark + Tier-1/2/3 hierarchy rendered in the chrome.
- **User journey** — route card → arrive → hosted → passport stamp → leave, all walkable.
- **Technical execution** — three real place pages + working Snøgg charge prediction + live
  economics, one `dotnet run`.
- **Strategic relevance** — dwell-as-asset, foodservice premium, loyalty (Kvilpasset),
  employee-as-host all visible.
- **Use of data** — places, signatures, charge window, and Pass economics are all derived
  from the dataset via the new endpoints.

## 7. Risks & mitigations

- **Two-hour budget** → hero flow first (§5); breadth is optional.
- **Live-data variance / offline demo** → embedded fixtures fallback in the `api()` helper.
- **Single-file getting unwieldy** → keep sections clearly commented; acceptable for a mock.
- **Charge model realism** → keep it explainable, not perfect; show the inputs.

## 8. File checklist

- `src/CircleK.ProxyApi/Controllers/KvilController.cs` *(new)*
- `src/CircleK.ProxyApi/Program.cs` *(+2 lines: default/static files)*
- `src/CircleK.ProxyApi/wwwroot/index.html` *(the mock; authored in `web/` if preferred)*
- `docs/implementation-plan.md` *(this file)*

---
*Kvil — ta deg ein kvil.*
