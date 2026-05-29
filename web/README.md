# Kvil — front-end

The **Kvil — ta deg ein kvil** mobile mock (Circle K hackathon, Team 4). A React SPA
(Vite + TypeScript + Tailwind v4) rendered inside a phone frame. See the concept brief and
`../docs/implementation-plan.md` for what each screen becomes.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

For live data, also run the proxy in another terminal:

```bash
dotnet run --project ../src/CircleK.ProxyApi   # http://localhost:5180
```

The dev server proxies `/api/*` → `http://localhost:5180` (see `vite.config.ts`). If the
proxy or a custom Kvil endpoint isn't available, the app **falls back to embedded fixtures**
so it always renders — each data-driven screen shows a small `data: live proxy / fixture
fallback` note.

## Scripts

| Command | What |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) + production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |

## Layout

```
src/
  main.tsx, App.tsx          # entry + router (BrowserRouter + Routes)
  index.css                  # Tailwind import + global styles
  brand/tokens.css           # Kvil chrome + per-place palettes (CSS variables)
  lib/
    types.ts                 # camelCase types mirroring the proxy + Kvil shapes
    api.ts                   # typed fetch client, proxy-with-fixtures-fallback
    fixtures.ts              # embedded offline fallback data
    places.ts                # Kvil place ↔ real station mapping (impl plan §2)
  components/                # PhoneFrame, BottomNav, KvilMark
  screens/                   # Route, PlugIn, Snogg, Place, Kvilpasset, DataPanel
```

Screens are functional **stubs** — shell, routing, brand tokens, and API wiring are live;
screen bodies are placeholders to be built out per `../docs/implementation-plan.md`.

## Config

`VITE_API_BASE` (see `.env.example`) — leave blank to use the dev proxy; set to an absolute
URL for a deployed build.
