import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { KvilPlace } from '../lib/types'
import { KvilMap } from '../components/KvilMap'
import { useKvil } from '../lib/state'
import {
  Screen,
  PageHeader,
  AICard,
  PlainCard,
  Pill,
  KBadge,
  ProgressBar,
  SearchIcon,
  BoltIcon,
  FlameIcon,
  CoffeeIcon,
  ChevronRight,
} from '../components/ui'

type FilterKey = 'fast' | 'food' | 'fireplace' | 'free'

const FILTERS: { key: FilterKey; label: string; icon: ReactNode }[] = [
  { key: 'fast', label: 'Hurtiglading', icon: <BoltIcon /> },
  { key: 'food', label: 'Mat', icon: <CoffeeIcon /> },
  { key: 'fireplace', label: 'Peis', icon: <FlameIcon /> },
  { key: 'free', label: 'Ledig no', icon: <KBadge size={14} /> },
]

function matches(place: KvilPlace, active: Set<FilterKey>): boolean {
  if (active.has('fast') && place.fastChargerKw < 150) return false
  if (active.has('food') && !place.amenities.kitchen) return false
  if (active.has('fireplace') && !place.amenities.fireplace) return false
  if (active.has('free') && place.baysFree < 1) return false
  return true
}

/** Home — discover Kvil places along the route (Epic 1.1, 1.2; honest availability 5.2). */
export function RouteScreen() {
  const { collected } = useKvil()
  const [places, setPlaces] = useState<KvilPlace[]>([])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<Set<FilterKey>>(new Set())

  useEffect(() => {
    api.getPlaces().then((r) => setPlaces(r.data))
  }, [])

  const ahead = places.find((p) => p.id === 'laerdal') ?? places[0]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return places.filter(
      (p) =>
        matches(p, active) &&
        (!q || p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)),
    )
  }, [places, query, active])

  const toggle = (key: FilterKey) =>
    setActive((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const total = places.length || 4
  const progress = Math.round((collected.length / total) * 100)

  return (
    <Screen>
      <PageHeader eyebrow="På vegen" title="Ta deg ein kvil" sub="Vel kvar du stoppar — med vilje" />

      {/* Search */}
      <label className="flex w-full items-center gap-2 rounded-2xl border border-[var(--kvil-card-line)] bg-white px-4 py-3 text-[var(--kvil-text-soft)] shadow-[var(--kvil-glow)]">
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søk etter et sted å kvile..."
          className="w-full bg-transparent text-sm text-[#171616] outline-none placeholder:text-[var(--kvil-text-soft)]"
        />
      </label>

      {/* Map of Kvil places */}
      <KvilMap places={places} />

      {/* Filters (Epic 1.2) */}
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {FILTERS.map((f) => (
          <Pill key={f.key} icon={f.icon} active={active.has(f.key)} onClick={() => toggle(f.key)}>
            {f.label}
          </Pill>
        ))}
      </div>

      {/* Recommended place ahead (Epic 1.1) */}
      {ahead && (
        <Link to={`/place/${ahead.id}`} className="block">
          <AICard glow>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <KBadge />
                <span className="font-display text-base font-semibold text-[#2b2626]">
                  Anbefalt stopp
                </span>
                <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#241e1a]">
                  {ahead.detourMin} min fram
                </span>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-[#2b2626]">{ahead.name}</h2>
                <p className="text-sm text-[var(--kvil-text-soft)]">{ahead.signature}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Pill icon={<BoltIcon />}>{ahead.fastChargerKw} kW</Pill>
                <Pill>
                  {ahead.baysFree}/{ahead.baysTotal} ledige
                </Pill>
                <Pill>
                  {ahead.estWaitMin === 0 ? 'Ingen kø' : `~${ahead.estWaitMin} min kø`}
                </Pill>
              </div>
            </div>
          </AICard>
        </Link>
      )}

      {/* The collection (Epic 1.1 → 1.3) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
            Kvil-stader
          </h3>
          <span className="text-xs text-[var(--kvil-text-soft)]">{filtered.length} stader</span>
        </div>

        {filtered.map((p) => (
          <Link key={p.id} to={`/place/${p.id}`}>
            <PlainCard>
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-display font-semibold text-[#2b2626]">{p.name}</p>
                    <KBadge size={16} />
                  </div>
                  <p className="text-xs text-[var(--kvil-text-soft)]">
                    {p.city} · {p.region}
                  </p>
                  <p className="mt-1 truncate text-xs text-[var(--kvil-text-soft)]">{p.signature}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-[#eaf7eb] px-2 py-0.5 text-[11px] font-semibold text-[#2e7d32]">
                    {p.baysFree} ledige
                  </span>
                  <ChevronRight />
                </div>
              </div>
            </PlainCard>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-[var(--kvil-text-soft)]">
            Ingen stader passar filteret.
          </p>
        )}
      </section>

      {/* Bollepass teaser (Epic 3.3) */}
      <Link to="/kvilpasset">
        <PlainCard id="bollepass">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KBadge size={20} />
                <span className="font-display font-semibold text-[#2b2626]">Kvilpasset</span>
              </div>
              <ChevronRight />
            </div>
            <p className="text-sm text-[var(--kvil-text-soft)]">
              {collected.length} av {total} stader samla — fullfør passet for ein gratis ladeøkt
            </p>
            <ProgressBar value={progress} />
          </div>
        </PlainCard>
      </Link>
    </Screen>
  )
}
