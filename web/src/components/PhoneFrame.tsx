import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

/**
 * The device shell that everything renders inside — the "mobile mock" frame.
 * Holds a faux status bar, the scrollable screen area, and the bottom nav.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[44px] border-[10px] border-black bg-[var(--kvil-paper)] shadow-2xl">
        {/* notch */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-6 w-36 -translate-x-1/2 rounded-b-2xl bg-black" />

        {/* status bar */}
        <div className="flex items-center justify-between px-7 pt-3 pb-1 text-xs font-medium text-[var(--kvil-ink)]">
          <span>09:41</span>
          <span className="font-display text-sm font-semibold tracking-wide">Kvil</span>
          <span>100%</span>
        </div>

        {/* screen */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        <BottomNav />
      </div>
    </div>
  )
}
