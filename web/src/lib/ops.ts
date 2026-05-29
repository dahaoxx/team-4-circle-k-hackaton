/**
 * Ops-side demo fixtures: the network station list Ops can flag as Kvil places
 * (Epic 4.3), and headline KPIs for the dashboard (Epic 4.4) that complement
 * the economics endpoint.
 */
import type { OpsStation } from './types'

export const FIXTURE_OPS_STATIONS: OpsStation[] = [
  { stationId: 'CK-NO-010', name: 'Lørenskog (Nebbenes)', region: 'Østlandet', isKvil: true, signature: 'Eit ekte bakeri med ein bolle verd E6-svingen' },
  { stationId: 'CK-NO-021', name: 'Ålesund (Lærdal)', region: 'Vestlandet', isKvil: true, signature: 'Lokal sider, røykt aure, eple' },
  { stationId: 'CK-NO-028', name: 'Trysil (Dombås)', region: 'Innlandet', isKvil: true, signature: 'Fjellstove med peis' },
  { stationId: 'CK-NO-022', name: 'Bodø (Lofoten)', region: 'Nord-Norge', isKvil: true, signature: 'Kaffi, torsk og lyset' },
  { stationId: 'CK-NO-014', name: 'Hamar sentrum', region: 'Innlandet', isKvil: false, signature: '' },
  { stationId: 'CK-NO-031', name: 'Voss stasjon', region: 'Vestlandet', isKvil: false, signature: '' },
]

/** Headline KPIs for the Ops dashboard (Epic 4.4). */
export const OPS_KPIS = {
  extraPremiumUptakePct: 21, // share of active members on Extra Premium
  premiumUptakeDeltaPct: 4, // change vs last quarter
  kvilIBilConversionPct: 38, // plug-ins that convert to a Kvil i bil order
  avgDwellMinChosen: 41, // dwell on a chosen Kvil stop
  avgDwellMinForced: 17, // dwell on a forced short charge stop
}
