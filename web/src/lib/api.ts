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
}
