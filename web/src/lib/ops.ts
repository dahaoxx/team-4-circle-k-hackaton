/**
 * Ops-side demo fixtures: the network station list Ops can flag as Kvil places
 * (Epic 4.3), and headline KPIs for the dashboard (Epic 4.4) that complement
 * the economics endpoint.
 */
import type { OpsStation } from './types'

export const FIXTURE_OPS_STATIONS: OpsStation[] = [
  { stationId: 'CK-NO-028', name: 'Lom (Bakeriet)', region: 'Innlandet', isKvil: true, signature: 'Boller fylt med vaniljekrem, toppa med sprø melis' },
  { stationId: 'CK-NO-010', name: 'Ringebu (Annis Pølsemakeri)', region: 'Innlandet', isKvil: true, signature: 'Lokalt spekt pølse frå Gudbrandsdalen' },
  { stationId: 'CK-NO-021', name: 'Vinje (Mjonøy)', region: 'Telemark', isKvil: true, signature: 'Rømmegraut og spekemat frå Vinje' },
  { stationId: 'CK-NO-022', name: 'Luster (Lustrabui)', region: 'Vestland', isKvil: true, signature: 'Røykt aure og eple frå fjorden' },
  { stationId: 'CK-NO-014', name: 'Hamar sentrum', region: 'Innlandet', isKvil: false, signature: '' },
  { stationId: 'CK-NO-009', name: 'Voss stasjon', region: 'Vestland', isKvil: false, signature: '' },
]

/** Headline KPIs for the Ops dashboard (Epic 4.4). */
export const OPS_KPIS = {
  extraPremiumUptakePct: 21, // share of active members on Extra Premium
  premiumUptakeDeltaPct: 4, // change vs last quarter
  kvilIBilConversionPct: 38, // plug-ins that convert to a Kvil i bil order
  avgDwellMinChosen: 41, // dwell on a chosen Kvil stop
  avgDwellMinForced: 17, // dwell on a forced short charge stop
}
