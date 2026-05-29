/**
 * Host-side demo fixtures: members arriving (Epic 4.2) and the Kvil i bil
 * kitchen queue sequenced by predicted charge-complete time (Epic 4.1).
 */
import type { HostArrival, KitchenTicket } from './types'

export const FIXTURE_ARRIVALS: HostArrival[] = [
  { memberName: 'Astrid', tier: 'Extra Premium', vehicleModel: 'VW ID.4', etaMin: 2, usual: 'Lom-bolle + kaffi' },
  { memberName: 'Jonas', tier: 'Extra Premium', vehicleModel: 'Tesla M3', etaMin: 6, usual: 'Kanelsnurr + cappuccino' },
  { memberName: 'Lene', tier: 'Extra', vehicleModel: 'Polestar 2', etaMin: 11, usual: 'Røykt aure-smørbrød' },
]

export const FIXTURE_TICKETS: KitchenTicket[] = [
  { id: 'T-204', memberName: 'Astrid', bay: 3, items: ['Lom-bolle', 'Kaffi'], chargeCompleteMin: 9, prepMin: 4, status: 'firing' },
  { id: 'T-205', memberName: 'Jonas', bay: 1, items: ['Kanelsnurr', 'Cappuccino'], chargeCompleteMin: 13, prepMin: 5, status: 'queued' },
  { id: 'T-206', memberName: 'Lene', bay: 5, items: ['Røykt aure-smørbrød'], chargeCompleteMin: 18, prepMin: 6, status: 'queued' },
]
