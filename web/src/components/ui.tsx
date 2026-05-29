/**
 * Kvil UI kit — the shared design language from the Figma "Kvil – Circle K"
 * main page (warm cream canvas, soft AI-gradient cards, pill chips, the K mark).
 * Every screen composes from here so the whole app stays visually consistent.
 */
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

// --- Layout ------------------------------------------------------------------

/**
 * The page canvas. Default is the warm Kvil cream; pass a `place` id to theme
 * the page with that place's palette (data-place remaps the --place-* tokens).
 */
export function Screen({
  children,
  place,
  className = '',
}: {
  children: ReactNode
  place?: string
  className?: string
}) {
  return (
    <div
      data-place={place}
      className={`flex min-h-full flex-col gap-5 px-5 pb-8 pt-4 ${
        place ? 'bg-[var(--place-bg)]' : 'bg-[var(--kvil-paper)]'
      } ${className}`}
    >
      {children}
    </div>
  )
}

/** Small uppercase eyebrow label. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
      {children}
    </p>
  )
}

/** A screen header with eyebrow + title. */
export function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string
  title: string
  sub?: string
}) {
  return (
    <header className="flex flex-col gap-0.5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="font-display text-2xl font-semibold text-[#2b2626]">{title}</h1>
      {sub && <p className="text-sm text-[var(--kvil-text-soft)]">{sub}</p>}
    </header>
  )
}

// --- Cards -------------------------------------------------------------------

/** The soft gradient frame used by AI recommendation cards. */
export function AICard({
  children,
  className = '',
  glow = false,
}: {
  children: ReactNode
  className?: string
  glow?: boolean
}) {
  return (
    <div
      className={`w-full rounded-2xl border border-[var(--kvil-card-line)] bg-[var(--kvil-card-soft)] p-[3px] ${
        glow ? 'shadow-[var(--kvil-glow)]' : ''
      } ${className}`}
    >
      <div
        className="rounded-[14px] border border-[var(--kvil-card-line)] p-4"
        style={{ backgroundImage: 'var(--kvil-ai-gradient)' }}
      >
        {children}
      </div>
    </div>
  )
}

/** A plain white framed card. */
export function PlainCard({
  children,
  id,
  className = '',
}: {
  children: ReactNode
  id?: string
  className?: string
}) {
  return (
    <div
      id={id}
      className={`w-full scroll-mt-4 rounded-2xl border border-[var(--kvil-card-line)] bg-white p-[3px] ${className}`}
    >
      <div className="rounded-[14px] border border-[var(--kvil-card-line)] p-4">
        {children}
      </div>
    </div>
  )
}

// --- Controls ----------------------------------------------------------------

/** Pill chip with an optional leading icon. Can render as a button. */
export function Pill({
  icon,
  children,
  active = false,
  onClick,
  className = '',
}: {
  icon?: ReactNode
  children: ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}) {
  const base =
    'inline-flex shrink-0 items-center gap-1.5 rounded-full border py-1.5 pl-2 pr-3 text-xs font-semibold transition'
  const tone = active
    ? 'border-transparent bg-[#171616] text-white'
    : 'border-[var(--kvil-card-line)] bg-white text-[#241e1a]'
  const Comp = onClick ? 'button' : 'span'
  return (
    <Comp onClick={onClick} className={`${base} ${tone} ${className}`}>
      {icon}
      {children}
    </Comp>
  )
}

/** Full-width primary CTA. Renders a link when `to` is set, else a button. */
export function PrimaryButton({
  children,
  to,
  onClick,
  disabled = false,
  className = '',
}: {
  children: ReactNode
  to?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  const cls = `block rounded-full bg-[#171616] py-3 text-center text-sm font-semibold text-white transition active:scale-[0.99] disabled:opacity-40 ${className}`
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  )
}

/** Subtle back link. */
export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-center text-sm text-[var(--kvil-text-soft)]">
      ← {children}
    </Link>
  )
}

// --- Pieces ------------------------------------------------------------------

/** Small dark Circle K badge. */
export function KBadge({ size = 24 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-full bg-[#171616] font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.46 }}
    >
      K
    </span>
  )
}

/** Thin orange progress track. */
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
      <div
        className="h-full rounded-full bg-[var(--kvil-progress)] transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export type StampState = 'done' | 'active' | 'empty'

/** One passport / Bollepass stamp. */
export function Stamp({ name, state }: { name: string; state: StampState }) {
  const circle =
    state === 'done'
      ? 'bg-gradient-to-br from-[#ffd9b3] via-[#f7b27a] to-[#ee9e4d]'
      : state === 'active'
        ? 'border-2 border-[#4caf50] bg-[#eaf7eb]'
        : 'border border-[#e5e7eb] bg-transparent'
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${circle}`}>
        {state === 'done' && <KBadge size={18} />}
        {state === 'active' && <CheckIcon />}
      </div>
      <span
        className={`max-w-[3.5rem] truncate text-[11px] font-medium ${
          state === 'active' ? 'text-[#4caf50]' : 'text-[var(--kvil-text-soft)]'
        }`}
      >
        {name}
      </span>
    </div>
  )
}

/** Green status banner (charging / live). */
export function GreenBanner({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[#4caf50] bg-[#e8f5e9] p-3 text-[#2e7d32]">
      <p className="text-sm font-bold">{title}</p>
      <p className="text-xs leading-relaxed">{body}</p>
    </div>
  )
}

/** The small "eit Kvilested" Tier-2 endorser mark. */
export function KvilMark({ withParent = false }: { withParent?: boolean }) {
  return (
    <div className="flex flex-col items-center leading-tight">
      <span className="text-[9px] uppercase tracking-[0.22em] text-[var(--kvil-text-soft)]">
        eit
      </span>
      <span className="font-display text-sm font-semibold tracking-wide text-[#2b2626]">
        Kvilested
      </span>
      {withParent && (
        <span className="mt-0.5 text-[8px] uppercase tracking-[0.18em] text-[var(--kvil-text-soft)]">
          drift av Circle K
        </span>
      )}
    </div>
  )
}

// --- Icons -------------------------------------------------------------------

export function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function MoonIcon({ color = '#241e1a' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" fill={color} />
    </svg>
  )
}

export function SunIcon({ color = '#241e1a' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill={color} />
      <g stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
      </g>
    </svg>
  )
}

export function CheckIcon({ color = '#4caf50' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BoltIcon({ color = '#241e1a' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill={color} />
    </svg>
  )
}

export function ClockIcon({ color = '#241e1a' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function FlameIcon({ color = '#241e1a' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2c1 3-2 4-2 7a2 2 0 1 0 4 0c2 2 3 4 3 6a5 5 0 0 1-10 0c0-4 4-6 5-13Z" fill={color} />
    </svg>
  )
}

export function WifiIcon({ color = '#241e1a' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke={color} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M3 9a14 14 0 0 1 18 0M6 12.5a9 9 0 0 1 12 0" />
      </g>
      <circle cx="12" cy="17" r="1.5" fill={color} />
    </svg>
  )
}

export function CarwashIcon({ color = '#241e1a' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 16v-3l2-4h10l2 4v3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="17" r="1.5" fill={color} />
      <circle cx="16" cy="17" r="1.5" fill={color} />
    </svg>
  )
}

export function CoffeeIcon({ color = '#241e1a' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 9h2a2 2 0 0 1 0 4h-2" stroke={color} strokeWidth="2" />
    </svg>
  )
}

export function ChevronRight({ color = '#645c56' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 6 6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
