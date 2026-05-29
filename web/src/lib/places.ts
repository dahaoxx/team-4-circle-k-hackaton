/**
 * The Kvil place catalogue — the v2 Tier-3 places (see
 * `docs/Kvil — ta deg ein kvil v2.md`): real Norwegian destinations, each
 * mapped onto a dataset station so the stats stay genuine.
 * This is the single source of truth shared by screens and fixtures.
 */
import type { KvilPlace } from './types'

export const PLACES: Record<string, KvilPlace> = {
  lom: {
    id: 'lom',
    name: 'Bakeriet i Lom',
    stationId: 'CK-NO-028', // Innlandet / Gudbrandsdalen station
    city: 'Lom',
    region: 'Innlandet',
    host: 'Marit',
    signature: 'Boller fylt med vaniljekrem, toppa med sprø melis',
    tagline: 'Originalen — bakeriet folk køyrer av for',
    lat: 61.8389, // Lom, Gudbrandsdalen
    lng: 8.5669,
    baysFree: 5,
    baysTotal: 6,
    topCategories: ['Bakeri', 'Kaffi', 'Boller'],
    detourMin: 35,
    fastChargerKw: 150,
    estWaitMin: 2,
    amenities: { kitchen: true, fireplace: false, seating: true, wifi: true, carwash: true },
    photo: '/boller.png',
    menu: [
      { id: 'lombolle', name: 'Lom-bolle', priceNok: 39, sourcing: 'Bakt i Lom i dag', readyMin: 4, signature: true },
      { id: 'skulebolle', name: 'Skulebolle', priceNok: 42, sourcing: 'Vaniljekrem & melis', readyMin: 4 },
      { id: 'kanelsnurr', name: 'Kanelsnurr', priceNok: 42, sourcing: 'Surdeig, lokalt smør', readyMin: 5 },
    ],
  },
  ringebu: {
    id: 'ringebu',
    name: 'Annis Pølsemakeri på Ringebu',
    stationId: 'CK-NO-010', // E6 motorway station, kitchen + many chargers
    city: 'Ringebu',
    region: 'Innlandet',
    host: 'Anni',
    signature: 'Lokalt spekt pølse frå Gudbrandsdalen',
    tagline: 'Pølsa som er grunnen til at du stoppar',
    lat: 61.5283, // Ringebu, E6 Gudbrandsdalen
    lng: 10.1389,
    baysFree: 8,
    baysTotal: 15,
    topCategories: ['Pølser', 'Spekemat', 'Kaffi'],
    detourMin: 8,
    fastChargerKw: 350,
    estWaitMin: 4,
    amenities: { kitchen: true, fireplace: false, seating: true, wifi: true, carwash: true },
    photo: '/boller.png',
    menu: [
      { id: 'gudbrandsdalspolse', name: 'Gudbrandsdalspølse', priceNok: 79, sourcing: 'Lokalt spekt i Ringebu', readyMin: 5, signature: true },
      { id: 'polselompe', name: 'Pølse i lompe', priceNok: 59, sourcing: 'Heimelaga lompe', readyMin: 4 },
      { id: 'fenalar', name: 'Fenalår-snabben', priceNok: 89, sourcing: 'Frå Gudbrandsdalen', readyMin: 3 },
    ],
  },
  mjonoy: {
    id: 'mjonoy',
    name: 'Mjonøy i Vinje',
    stationId: 'CK-NO-021', // E134 corridor station
    city: 'Vinje',
    region: 'Telemark',
    host: 'Targjei',
    signature: 'Rømmegraut og spekemat frå Vinje',
    tagline: 'Tradisjon ved E134, mellom to Circle K',
    lat: 59.5667, // Vinje, Telemark (E134)
    lng: 7.9833,
    baysFree: 3,
    baysTotal: 5,
    topCategories: ['Tradmat', 'Rømmegraut', 'Kaffi'],
    detourMin: 20,
    fastChargerKw: 150,
    estWaitMin: 0,
    amenities: { kitchen: true, fireplace: true, seating: true, wifi: true, carwash: false },
    photo: '/boller.png',
    menu: [
      { id: 'rommegraut', name: 'Rømmegraut med spekemat', priceNok: 99, sourcing: 'Rømme frå Vinje', readyMin: 8, signature: true },
      { id: 'tjukkmjolk', name: 'Tjukkmjølk & flatbrød', priceNok: 55, sourcing: 'Frå garden', readyMin: 3 },
      { id: 'vaffel', name: 'Vaffel med brunost', priceNok: 49, sourcing: 'Lokal brunost', readyMin: 4 },
    ],
  },
  lustrabui: {
    id: 'lustrabui',
    name: 'Lustrabui i Luster',
    stationId: 'CK-NO-022', // Vestland / fjord station
    city: 'Luster',
    region: 'Vestland',
    host: 'Sigrid',
    signature: 'Røykt aure og eple frå fjorden',
    tagline: 'Djupt inne i Sognefjorden',
    lat: 61.4236, // Luster, inner Sognefjord
    lng: 7.4136,
    baysFree: 2,
    baysTotal: 4,
    topCategories: ['Lokalmat', 'Fjordmat', 'Kaffi'],
    detourMin: 55,
    fastChargerKw: 50,
    estWaitMin: 0,
    amenities: { kitchen: true, fireplace: true, seating: true, wifi: false, carwash: false },
    photo: '/boller.png',
    menu: [
      { id: 'fjordsmorbrod', name: 'Fjordsmørbrød med røykt aure', priceNok: 95, sourcing: 'Røykt i Luster', readyMin: 6, signature: true },
      { id: 'lefse', name: 'Lefse med rømme', priceNok: 49, sourcing: 'Bakt på staden', readyMin: 3 },
      { id: 'eplemost', name: 'Eplemost frå Sogn', priceNok: 45, sourcing: 'Pressa i fjorden', readyMin: 1 },
    ],
  },
}

export const PLACE_LIST: KvilPlace[] = Object.values(PLACES)

/** Look up a single curated menu item across all places. */
export function findMenuItem(placeId: string, itemId: string): import('./types').MenuItem | undefined {
  return PLACES[placeId]?.menu.find((m) => m.id === itemId)
}
