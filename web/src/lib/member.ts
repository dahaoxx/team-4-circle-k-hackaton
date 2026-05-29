/**
 * The signed-in demo driver. Used for recognition, the "usual" order, and the
 * Snøgg charge-time prediction (battery + state of charge).
 */
import type { MemberProfile } from './types'

export const FIXTURE_MEMBER: MemberProfile = {
  memberId: 'EX-44218',
  name: 'Astrid',
  tier: 'Extra', // starts on the base program; upgrades to Extra Premium in-app
  vehicleModel: 'VW ID.4',
  batteryKwh: 77,
  socPct: 28,
  usual: {
    placeId: 'lom',
    itemId: 'lombolle',
    label: 'Lom-bolle + kaffi',
  },
}

/** Places already collected on the passport at the start of the demo. */
export const INITIAL_COLLECTED = ['lom', 'mjonoy']
