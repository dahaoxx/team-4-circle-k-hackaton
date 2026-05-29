import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Vegen', sub: 'Route', end: true },
  { to: '/kvilpasset', label: 'Kvilpasset', sub: 'Pass', end: false },
  { to: '/data', label: 'Data', sub: 'Insight', end: false },
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
              'flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors',
              isActive
                ? 'text-[var(--kvil-accent)]'
                : 'text-[var(--kvil-muted)] hover:text-[var(--kvil-ink)]',
            ].join(' ')
          }
        >
          <span className="font-serif-kvil text-sm">{t.label}</span>
          <span className="text-[9px] uppercase tracking-[0.18em]">{t.sub}</span>
        </NavLink>
      ))}
    </nav>
  )
}
