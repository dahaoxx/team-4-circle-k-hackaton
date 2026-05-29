import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Vegen', sub: 'Route', end: true },
  { to: '/kvilpasset', label: 'Passet', sub: 'Pass', end: false },
  { to: '/host', label: 'Vert', sub: 'Host', end: false },
  { to: '/data', label: 'Data', sub: 'Insight', end: false },
]

export function BottomNav() {
  return (
    <nav className="grid grid-cols-4 border-t border-[var(--kvil-line)] bg-[var(--kvil-paper)]">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            [
              'flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors',
              isActive
                ? 'text-[#2b2626]'
                : 'text-[var(--kvil-text-soft)] hover:text-[#2b2626]',
            ].join(' ')
          }
        >
          <span className="font-display text-sm font-semibold">{t.label}</span>
          <span className="text-[9px] uppercase tracking-[0.18em]">{t.sub}</span>
        </NavLink>
      ))}
    </nav>
  )
}
