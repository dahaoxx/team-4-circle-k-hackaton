/**
 * Typed client for the CircleK proxy API.
 *
 * Each Kvil call tries the proxy first and falls back to an embedded fixture on
 * any failure (network error, non-2xx, or an endpoint that doesn't exist yet).
 * This keeps the SPA renderable before the backend KvilController is built and
 * when running fully offline.
 */
import type {
  ChargeEstimate,
  KvilPlace,
  KvilpassetEconomics,
  Page,
} from './types'
import {
  FIXTURE_CHARGE_ESTIMATE,
  FIXTURE_ECONOMICS,
  FIXTURE_PLACES,
} from './fixtures'

// Blank in dev → relative /api/... hits the Vite dev proxy. Set for deploys.
const BASE = import.meta.env.VITE_API_BASE ?? ''

// The live stations API. The Vite dev proxy isn't running for the map, so this
// call hits the deployed backend directly. Override via VITE_STATIONS_API_BASE.
const STATIONS_BASE =
  import.meta.env.VITE_STATIONS_API_BASE ??
  'https://circle-k-group-4-775886516859.europe-north2.run.app'

/** Minimal station shape the map needs. Kept local so types.ts stays untouched. */
export type StationPin = { id: string; name: string; lat: number; lng: number }

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`)
  return (await res.json()) as T
}

/** Try a live call; on any error, log and return the fallback. */
async function withFallback<T>(
  label: string,
  live: () => Promise<T>,
  fallback: T,
): Promise<{ data: T; source: 'live' | 'fixture' }> {
  try {
    return { data: await live(), source: 'live' }
  } catch (err) {
    console.warn(`[api] ${label} fell back to fixture:`, err)
    return { data: fallback, source: 'fixture' }
  }
}

export const api = {
  /** GET /api/kvil/places */
  getPlaces: () =>
    withFallback(
      'getPlaces',
      () => get<KvilPlace[]>('/api/kvil/places'),
      FIXTURE_PLACES,
    ),

  /** GET /api/kvil/snogg/charge-estimate */
  getChargeEstimate: (params: {
    stationId: string
    memberId?: string
    socPct?: number
  }) => {
    const qs = new URLSearchParams({ stationId: params.stationId })
    if (params.memberId) qs.set('memberId', params.memberId)
    if (params.socPct != null) qs.set('socPct', String(params.socPct))
    return withFallback(
      'getChargeEstimate',
      () => get<ChargeEstimate>(`/api/kvil/snogg/charge-estimate?${qs}`),
      FIXTURE_CHARGE_ESTIMATE,
    )
  },

  /** GET /api/kvil/kvilpasset/economics */
  getKvilpassetEconomics: () =>
    withFallback(
      'getKvilpassetEconomics',
      () => get<KvilpassetEconomics>('/api/kvil/kvilpasset/economics'),
      FIXTURE_ECONOMICS,
    ),

  /** Generic passthrough for any proxy collection, e.g. listResource<Station>('stations'). */
  listResource: <T>(resource: string, query = '') =>
    get<Page<T>>(`/api/${resource}${query}`),

  /**
   * Fetch every real Circle K station from the live API for the home map.
   *
   * The live endpoint is `GET /api/stations?limit&offset&q` returning a
   * `{ total, limit, offset, data }` envelope. (The `POST /api/stations` route
   * is a *create* op, not a list, so we use GET here.) Field names are
   * snake_case (`station_id`, `lat`, `lng`) — we normalise defensively, also
   * tolerating `id`/`latitude`/`longitude` variants. Returns `[]` on any
   * failure so the map still renders offline.
   */
  async getStations(): Promise<StationPin[]> {
    try {
      const res = await fetch(`${STATIONS_BASE}/api/stations?limit=1000&offset=0`, {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status} for /api/stations`)
      const body: unknown = await res.json()

      // Accept either a `{ data: [...] }` envelope or a bare array.
      const rows: any[] = Array.isArray(body)
        ? body
        : Array.isArray((body as any)?.data)
          ? (body as any).data
          : []

      return rows
        .map((s): StationPin => {
          const lat = Number(s?.lat ?? s?.latitude)
          const lng = Number(s?.lng ?? s?.lon ?? s?.longitude)
          return {
            id: String(s?.station_id ?? s?.stationId ?? s?.id ?? ''),
            name: String(s?.name ?? 'Circle K'),
            lat,
            lng,
          }
        })
        // Drop anything missing real coords (NaN, null, or 0/0).
        .filter(
          (p) =>
            Number.isFinite(p.lat) &&
            Number.isFinite(p.lng) &&
            p.lat !== 0 &&
            p.lng !== 0,
        )
    } catch (err) {
      console.warn('[api] getStations failed, returning []:', err)
      return []
    }
  },
}
