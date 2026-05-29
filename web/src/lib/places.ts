/**
 * The Kvil place catalogue — narrative places mapped onto real dataset stations.
 * This is the single source of truth shared by screens and fixtures.
 * See docs/implementation-plan.md §2.
 */
import type { KvilPlace } from './types'

export const PLACES: Record<string, KvilPlace> = {
  nebbenes: {
    id: 'nebbenes',
    name: 'Bakeriet på Nebbenes',
    stationId: 'CK-NO-010', // Circle K Lørenskog (motorway, 15 chargers, kitchen+seating)
    city: 'Lørenskog',
    region: 'Østlandet',
    host: 'Ingrid',
    signature: 'A real bakery with a bun worth the E6 detour',
    tagline: "Norway's busiest rest stop, reimagined",
    lat: 60.3225, // Nebbenes rest stop, E6 north of Oslo
    lng: 11.1772,
    baysFree: 6,
    baysTotal: 15,
    topCategories: ['Bakery', 'Coffee', 'Hot food'],
  },
  laerdal: {
    id: 'laerdal',
    name: 'Brygga i Lærdal',
    stationId: 'CK-NO-021', // Circle K Ålesund (Vestlandet, kitchen+seating)
    city: 'Ålesund',
    region: 'Vestlandet',
    host: 'Sander',
    signature: 'Local cider, smoked trout, apples',
    tagline: 'A fjord-side stop that tastes of the fjord',
    lat: 61.1006, // Lærdal, inner Sognefjord
    lng: 7.4806,
    baysFree: 4,
    baysTotal: 5,
    topCategories: ['Local food', 'Coffee', 'Cider'],
  },
  dombas: {
    id: 'dombas',
    name: 'Stova på Dombås',
    stationId: 'CK-NO-028', // Circle K Trysil (Innlandet, highway_destination)
    city: 'Trysil',
    region: 'Innlandet',
    host: 'Marit',
    signature: 'A mountain-cabin room for the Dovre crossing — fireplace and all',
    tagline: 'The pause that warms the crossing',
    lat: 62.0742, // Dombås, gateway to the Dovre crossing
    lng: 9.1281,
    baysFree: 3,
    baysTotal: 6,
    topCategories: ['Hot drinks', 'Bakery', 'Warm meals'],
  },
  lofoten: {
    id: 'lofoten',
    name: 'Kaia i Lofoten',
    stationId: 'CK-NO-022', // Circle K Bodø (Nord-Norge, coast)
    city: 'Bodø',
    region: 'Nord-Norge',
    host: 'Even',
    signature: 'Coffee, cod, and the light',
    tagline: 'Where the road meets the sea',
    lat: 68.2342, // Kaia, Lofoten (Svolvær)
    lng: 14.5641,
    baysFree: 2,
    baysTotal: 4,
    topCategories: ['Seafood', 'Coffee', 'Bakery'],
  },
}

export const PLACE_LIST: KvilPlace[] = Object.values(PLACES)
