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
    signature: 'Eit ekte bakeri med ein bolle verd E6-svingen',
    tagline: 'Noregs travlaste raststad, tenkt på nytt',
    lat: 60.3225, // Nebbenes rest stop, E6 north of Oslo
    lng: 11.1772,
    baysFree: 6,
    baysTotal: 15,
    topCategories: ['Bakeri', 'Kaffi', 'Varmmat'],
    detourMin: 12,
    fastChargerKw: 350,
    estWaitMin: 4,
    amenities: { kitchen: true, fireplace: false, seating: true, wifi: true, carwash: true },
    photo: '/boller.png',
    menu: [
      { id: 'lombolle', name: 'Lom-bolle', priceNok: 39, sourcing: 'Bakt i dag', readyMin: 4, signature: true },
      { id: 'kanelsnurr', name: 'Kanelsnurr', priceNok: 42, sourcing: 'Surdeig, lokalt smør', readyMin: 5 },
      { id: 'kardemomme', name: 'Kardemommebolle', priceNok: 39, sourcing: 'Bakt i dag', readyMin: 4 },
    ],
  },
  laerdal: {
    id: 'laerdal',
    name: 'Brygga i Lærdal',
    stationId: 'CK-NO-021', // Circle K Ålesund (Vestlandet, kitchen+seating)
    city: 'Ålesund',
    region: 'Vestlandet',
    host: 'Sander',
    signature: 'Lokal sider, røykt aure, eple',
    tagline: 'Ein fjordstopp som smakar av fjorden',
    lat: 61.1006, // Lærdal, inner Sognefjord
    lng: 7.4806,
    baysFree: 4,
    baysTotal: 5,
    topCategories: ['Lokalmat', 'Kaffi', 'Sider'],
    detourMin: 40,
    fastChargerKw: 150,
    estWaitMin: 0,
    amenities: { kitchen: true, fireplace: false, seating: true, wifi: true, carwash: false },
    photo: '/boller.png',
    menu: [
      { id: 'aure', name: 'Røykt aure-smørbrød', priceNok: 89, sourcing: 'Røykt i Lærdal', readyMin: 6, signature: true },
      { id: 'sider', name: 'Lærdalseple-sider', priceNok: 59, sourcing: 'Pressa på garden', readyMin: 1 },
      { id: 'flatbrod', name: 'Flatbrød & brunost', priceNok: 49, sourcing: 'Bakt på staden', readyMin: 3 },
    ],
  },
  dombas: {
    id: 'dombas',
    name: 'Stova på Dombås',
    stationId: 'CK-NO-028', // Circle K Trysil (Innlandet, highway_destination)
    city: 'Trysil',
    region: 'Innlandet',
    host: 'Marit',
    signature: 'Eit fjellstove-rom for Dovre-kryssinga — med peis',
    tagline: 'Pausen som varmar kryssinga',
    lat: 62.0742, // Dombås, gateway to the Dovre crossing
    lng: 9.1281,
    baysFree: 3,
    baysTotal: 6,
    topCategories: ['Varm drikke', 'Bakeri', 'Varmmat'],
    detourMin: 25,
    fastChargerKw: 150,
    estWaitMin: 2,
    amenities: { kitchen: true, fireplace: true, seating: true, wifi: true, carwash: false },
    photo: '/boller.png',
    menu: [
      { id: 'fjellgrot', name: 'Fjellgrøt med rømme', priceNok: 79, sourcing: 'Havre frå Dovre', readyMin: 7, signature: true },
      { id: 'kakao', name: 'Varm kakao med krem', priceNok: 49, sourcing: 'Laga på staden', readyMin: 3 },
      { id: 'lapper', name: 'Lapper med tyttebær', priceNok: 55, sourcing: 'Tyttebær frå fjellet', readyMin: 5 },
    ],
  },
  lofoten: {
    id: 'lofoten',
    name: 'Kaia i Lofoten',
    stationId: 'CK-NO-022', // Circle K Bodø (Nord-Norge, coast)
    city: 'Bodø',
    region: 'Nord-Norge',
    host: 'Even',
    signature: 'Kaffi, torsk og lyset',
    tagline: 'Der vegen møter havet',
    lat: 68.2342, // Kaia, Lofoten (Svolvær)
    lng: 14.5641,
    baysFree: 2,
    baysTotal: 4,
    topCategories: ['Sjømat', 'Kaffi', 'Bakeri'],
    detourMin: 60,
    fastChargerKw: 50,
    estWaitMin: 0,
    amenities: { kitchen: true, fireplace: false, seating: true, wifi: false, carwash: false },
    photo: '/boller.png',
    menu: [
      { id: 'fiskekaker', name: 'Fiskekaker i lompe', priceNok: 85, sourcing: 'Torsk frå Lofoten', readyMin: 6, signature: true },
      { id: 'bolle', name: 'Kanelbolle', priceNok: 39, sourcing: 'Bakt i dag', readyMin: 4 },
      { id: 'torrfisk', name: 'Kaffi & tørrfisk-snack', priceNok: 45, sourcing: 'Hengt på Kaia', readyMin: 2 },
    ],
  },
}

export const PLACE_LIST: KvilPlace[] = Object.values(PLACES)

/** Look up a single curated menu item across all places. */
export function findMenuItem(placeId: string, itemId: string): import('./types').MenuItem | undefined {
  return PLACES[placeId]?.menu.find((m) => m.id === itemId)
}
