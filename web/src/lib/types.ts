/**
 * TypeScript shapes mirroring the CircleK proxy API (camelCase output).
 *
 * The first group mirrors the upstream resource records
 * (src/CircleK.ProxyApi/Models/*.cs). The second group mirrors the planned
 * custom KvilController endpoints (see docs/implementation-plan.md §3) — these
 * don't exist on the backend yet, which is why the API layer falls back to
 * fixtures.
 */

/** List envelope returned by every collection endpoint. */
export interface Page<T> {
  total: number
  limit: number
  offset: number
  data: T[]
}

export interface Station {
  stationId: string
  name: string
  city: string
  region: string
  type: string
  manned: boolean
  lat: number
  lng: number
  fuelPumps: number
  evChargers: Record<string, number> // { "50kW", "150kW", "350kW", "total" }
  hasCarwash: boolean
  hasKitchen: boolean
  hasExtraSeating: boolean
  openedDate: string
}

export interface LoyaltyMember {
  memberId: string
  extraMember: boolean
  joinedDate: string
  tier: string
  isActive: boolean
  ageBand: string
  vehicleType: string
  vehicleModel: string
  batteryKwh: number
  avgVisitsPerMonth: number
  lifetimeSpentNok: number
  preferredStationId: string
  optInMarketing: boolean
  optInPersonalisation: boolean
  appUser: boolean
}

// --- Kvil concept shapes (custom endpoints, see impl plan §3) ----------------

/** One curated Kvil place, enriched from a real station. */
export interface KvilPlace {
  id: string // slug, e.g. "laerdal"
  name: string // "Brygga i Lærdal"
  stationId: string // mapped real station
  city: string
  region: string
  host: string // the named host
  signature: string // local signature line
  tagline: string // short evocative line
  baysFree: number
  baysTotal: number
  topCategories: string[] // from store_transactions
}

/** The Snøgg charge-time window. */
export interface ChargeEstimate {
  stationId: string
  stationName: string
  minutes: number
  fromSoc: number
  toSoc: number
  kwhToAdd: number
  chargerKw: number
  weather: string
  derateApplied: boolean
}

/** Kvilpasset economics for the data panel. */
export interface KvilpassetEconomics {
  premiumAvgSpendNok: number
  baseAvgSpendNok: number
  spendLiftPct: number
  carwashSubscriptionSharePct: number
  premiumSegmentSize: number
  assumedMonthlyPriceNok: number
  modelledAnnualRevenueNok: { low: number; expected: number; high: number }
}
