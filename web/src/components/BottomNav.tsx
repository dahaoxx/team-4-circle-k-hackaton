import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

const TABS: { to: string; label: string; icon: ReactNode; end: boolean }[] = [
  { to: '/', label: 'Vegen', icon: <RouteIcon />, end: true },
  { to: '/kvilpasset', label: 'Passet', icon: <PassIcon />, end: false },
  { to: '/host', label: 'Vert', icon: <HostIcon />, end: false },
]

export function BottomNav() {
  return (
    <nav className="grid grid-cols-3 border-t border-[var(--kvil-line)] bg-[var(--kvil-paper)]">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            [
              'flex flex-col items-center gap-1 py-2.5 text-xs transition-colors',
              isActive
                ? 'text-[#2b2626]'
                : 'text-[var(--kvil-text-soft)] hover:text-[#2b2626]',
            ].join(' ')
          }
        >
          {t.icon}
          <span className="font-display text-sm font-semibold">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

// --- Tab icons — inherit the NavLink text colour via currentColor -----------

/** Vegen — a winding road/route. */
function RouteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 21c-2 0-3-1-3-3s1-3 3-3h10c2 0 3-1 3-3s-1-3-3-3H8C6 9 5 8 5 6s1-3 3-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Passet — a membership pass / card. */
function PassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Vert — the host. */
function HostIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
