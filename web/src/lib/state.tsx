/**
 * App-wide Kvil state — the thin glue that makes the demo feel alive:
 * membership tier (join/upgrade), the passport of collected places, and the
 * last Snøgg order (for the receipt + one-tap reorder). In-memory only.
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { MemberProfile } from './types'
import { FIXTURE_MEMBER, INITIAL_COLLECTED } from './member'

export interface PlacedOrder {
  placeId: string
  items: string[]
  totalNok: number
  bay: number
  pointsEarned: number
}

interface KvilState {
  member: MemberProfile
  isPremium: boolean
  collected: string[]
  lastOrder: PlacedOrder | null
  upgradeToPremium: () => void
  collectPlace: (placeId: string) => void
  placeOrder: (order: PlacedOrder) => void
}

const KvilContext = createContext<KvilState | null>(null)

export function KvilProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<MemberProfile>(FIXTURE_MEMBER)
  const [collected, setCollected] = useState<string[]>(INITIAL_COLLECTED)
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null)

  const upgradeToPremium = useCallback(() => {
    setMember((m) => ({ ...m, tier: 'Kvil Premium' }))
  }, [])

  const collectPlace = useCallback((placeId: string) => {
    setCollected((c) => (c.includes(placeId) ? c : [...c, placeId]))
  }, [])

  const placeOrder = useCallback((order: PlacedOrder) => {
    setLastOrder(order)
    setCollected((c) => (c.includes(order.placeId) ? c : [...c, order.placeId]))
  }, [])

  const value = useMemo<KvilState>(
    () => ({
      member,
      isPremium: member.tier === 'Kvil Premium',
      collected,
      lastOrder,
      upgradeToPremium,
      collectPlace,
      placeOrder,
    }),
    [member, collected, lastOrder, upgradeToPremium, collectPlace, placeOrder],
  )

  return <KvilContext.Provider value={value}>{children}</KvilContext.Provider>
}

export function useKvil(): KvilState {
  const ctx = useContext(KvilContext)
  if (!ctx) throw new Error('useKvil must be used within <KvilProvider>')
  return ctx
}
