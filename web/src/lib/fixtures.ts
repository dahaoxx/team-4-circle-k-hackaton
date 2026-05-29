/**
 * Embedded fallback data. The API layer returns these when the proxy is
 * unreachable or the custom Kvil endpoints don't exist yet, so the SPA always
 * renders (demo-proof offline).
 */
import type { ChargeEstimate, KvilpassetEconomics } from './types'
import { PLACE_LIST } from './places'

export const FIXTURE_PLACES = PLACE_LIST

export const FIXTURE_CHARGE_ESTIMATE: ChargeEstimate = {
  stationId: 'CK-NO-028',
  stationName: 'Bakeriet i Lom',
  minutes: 17,
  fromSoc: 28,
  toSoc: 80,
  kwhToAdd: 40.0,
  chargerKw: 150,
  weather: 'Snø · −6 °C',
  derateApplied: true,
  coldPenaltyMin: 3,
}

export const FIXTURE_ECONOMICS: KvilpassetEconomics = {
  premiumAvgSpendNok: 1840,
  baseAvgSpendNok: 1120,
  spendLiftPct: 64,
  carwashSubscriptionSharePct: 38,
  premiumSegmentSize: 18500,
  assumedMonthlyPriceNok: 149,
  modelledAnnualRevenueNok: {
    low: 19_900_000,
    expected: 27_600_000,
    high: 33_100_000,
  },
}
