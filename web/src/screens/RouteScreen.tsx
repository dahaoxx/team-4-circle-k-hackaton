import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { KvilPlace } from '../lib/types'
import { KvilMark } from '../components/KvilMark'
import { KvilMap } from '../components/KvilMap'

/** Stub: surfaces a Kvil place ahead + the collection. To be built out per impl plan §4.2. */
export function RouteScreen() {
  const progress = Math.round((PASS.collected / PASS.total) * 100)

  return (
    <div className="flex flex-col gap-5 p-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-muted)]">
          På vegen
        </p>
        <h1 className="font-serif-kvil text-2xl text-[var(--kvil-ink)]">
          Ta deg ein kvil
        </h1>
      </header>

      <KvilMap places={places} />

      {ahead && (
        <Link
          to="/plug-in"
          data-place={ahead.id}
          className="block rounded-2xl border border-[var(--kvil-line)] bg-[var(--place-surface)] p-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[var(--kvil-muted)]">Eit Kvil-sted, 40 min fram</p>
              <h2 className="font-serif-kvil text-xl text-[var(--place-ink)]">
                {ahead.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--place-ink)]/80">{ahead.signature}</p>
            </div>
            <span
              className="rounded-full px-2 py-1 text-[10px] font-medium text-white"
              style={{ background: 'var(--place-accent)' }}
            >
              {ahead.baysFree} bays free
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--kvil-text-strong)]">
            {RECOMMENDED.body}
          </p>
        </div>
      </AICard>

      {/* Quick intent chips */}
      <div className="flex w-full gap-2">
        {QUICK_INTENTS.map((q) => (
          <Pill key={q.label} icon={q.icon}>
            {q.label}
          </Pill>
        ))}
      </div>

      {/* Featured bun stop */}
      <AICard>
        <div className="flex flex-col gap-3">
          <img
            src={FEATURE.image}
            alt={FEATURE.title}
            className="h-40 w-full rounded-xl object-cover"
          />
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-base font-semibold text-[#2b2626]">
              {FEATURE.title}
            </h3>
            <Pill icon={<SunIcon />}>{FEATURE.pill}</Pill>
          </div>
          <p className="text-sm leading-relaxed text-[var(--kvil-text-strong)]">
            {FEATURE.body}
          </p>
        </div>
      </AICard>

      {/* Bollepass loyalty card */}
      <PlainCard id="bollepass">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Pill icon={<SunIcon />}>{PASS.pill}</Pill>
            <p className="text-sm leading-relaxed text-[var(--kvil-text-strong)]">
              {PASS.blurb}
            </p>
          </div>

          {/* Progress */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[var(--kvil-text-soft)]">
              {PASS.collected} av {PASS.total} stempel samlet
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
              <div
                className="h-full rounded-full bg-[var(--kvil-progress)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stamps */}
          <div className="flex justify-between">
            {PASS.stamps.map((s) => (
              <Stamp key={s.name} name={s.name} state={s.state} />
            ))}
          </div>

          {/* Live charging banner */}
          <div className="flex flex-col gap-1 rounded-xl border border-[#4caf50] bg-[#e8f5e9] p-3 text-[#2e7d32]">
            <p className="text-sm font-bold">{PASS.banner.title}</p>
            <p className="text-xs leading-relaxed">{PASS.banner.body}</p>
          </div>
        </div>
      </PlainCard>
    </div>
  )
}

// --- Building blocks ---------------------------------------------------------

/** The soft gradient frame used by AI recommendation cards. */
function AICard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`w-full rounded-2xl border border-[var(--kvil-card-line)] bg-[var(--kvil-card-soft)] p-[3px] ${className}`}
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

/** A plain white framed card (Bollepass). */
function PlainCard({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div
      id={id}
      className="w-full scroll-mt-4 rounded-2xl border border-[var(--kvil-card-line)] bg-white p-[3px]"
    >
      <div className="rounded-[14px] border border-[var(--kvil-card-line)] p-4">
        {children}
      </div>
    </div>
  )
}

/** Pill chip with a leading icon. */
function Pill({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--kvil-card-line)] bg-white py-1.5 pl-2 pr-3 text-xs font-semibold text-[#241e1a]">
      {icon}
      {children}
    </span>
  )
}

/** Small dark Circle K badge. */
function KBadge() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#171616] text-xs font-bold text-white">
      K
    </span>
  )
}

/** One Bollepass stamp: collected (peach), active (green ring), or empty. */
function Stamp({ name, state }: { name: string; state: StampState }) {
  const circle =
    state === 'done'
      ? 'bg-gradient-to-br from-[#ffd9b3] via-[#f7b27a] to-[#ee9e4d]'
      : state === 'active'
        ? 'border-2 border-[#4caf50] bg-[#eaf7eb]'
        : 'border border-[#e5e7eb] bg-transparent'

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${circle}`}>
        {state === 'active' && <CheckIcon />}
      </div>
      <span
        className={`text-[11px] font-medium ${
          state === 'active' ? 'text-[#4caf50]' : 'text-[var(--kvil-text-soft)]'
        }`}
      >
        {name}
      </span>
    </div>
  )
}

// --- Icons -------------------------------------------------------------------

/** Kvil map-pin: a teardrop with a gradient ring and a K, over a soft glow. */
function MapPin() {
  return (
    <div className="relative flex justify-center pt-2">
      <div className="absolute top-3 h-10 w-10 rounded-full bg-[#ffa499]/40 blur-xl" />
      <svg width="52" height="64" viewBox="0 0 52 64" fill="none" className="relative">
        <defs>
          <linearGradient id="pinRing" x1="0" y1="0" x2="52" y2="64">
            <stop offset="0%" stopColor="#ffa499" />
            <stop offset="50%" stopColor="#fccb57" />
            <stop offset="100%" stopColor="#fdf3fe" />
          </linearGradient>
        </defs>
        <path
          d="M26 3C13.85 3 4 12.85 4 25c0 15.4 22 35 22 35s22-19.6 22-35C48 12.85 38.15 3 26 3Z"
          fill="white"
          stroke="url(#pinRing)"
          strokeWidth="3"
        />
        <text
          x="26"
          y="33"
          textAnchor="middle"
          className="font-display"
          fontSize="22"
          fontWeight="700"
          fill="#1c1a17"
        >
          K
        </text>
      </svg>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        fill="#241e1a"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="#241e1a" />
      <g stroke="#241e1a" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
      </g>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.5 4.5L19 7"
        stroke="#4caf50"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
