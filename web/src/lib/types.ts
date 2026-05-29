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

/** A short, curated Kvil menu item (drives Snøgg pre-order + trust pricing). */
export interface MenuItem {
  id: string
  name: string
  priceNok: number
  sourcing: string // "Bakt i Lom i dag" — the craft/of-this-place line
  readyMin: number // minutes to prepare
  signature?: boolean // the place's hero product
}

/** Real station amenities used for discovery filters (Epic 1.2). */
export interface PlaceAmenities {
  kitchen: boolean
  fireplace: boolean
  seating: boolean
  wifi: boolean
  carwash: boolean
}

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
  lat: number // narrative map position
  lng: number // narrative map position
  baysFree: number
  baysTotal: number
  topCategories: string[] // from store_transactions
  detourMin: number // "40 min fram"
  fastChargerKw: number // best charger output
  estWaitMin: number // honest queue estimate (Epic 5.2)
  amenities: PlaceAmenities
  photo: string // hero image
  menu: MenuItem[]
}

// --- Member / host / ops shapes (demo fixtures) ------------------------------

/** The signed-in driver's profile (recognition, usual order, battery). */
export interface MemberProfile {
  memberId: string
  name: string
  tier: 'Extra' | 'Extra Premium'
  vehicleModel: string
  batteryKwh: number
  socPct: number
  usual: { placeId: string; itemId: string; label: string }
}

/** An arriving member shown to the host (Epic 4.2). */
export interface HostArrival {
  memberName: string
  tier: string
  vehicleModel: string
  etaMin: number
  usual: string
}

/** A Kvil i bil kitchen ticket sequenced by charge-complete time (Epic 4.1). */
export interface KitchenTicket {
  id: string
  memberName: string
  bay: number
  items: string[]
  chargeCompleteMin: number // minutes until the car is done
  prepMin: number // how long the kitchen needs
  status: 'queued' | 'firing' | 'ready' | 'delivered'
}

/** A station Ops can designate as a Kvil place (Epic 4.3). */
export interface OpsStation {
  stationId: string
  name: string
  region: string
  isKvil: boolean
  signature: string
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
  coldPenaltyMin?: number // extra minutes from the cold-weather derate (Epic 2.1)
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
