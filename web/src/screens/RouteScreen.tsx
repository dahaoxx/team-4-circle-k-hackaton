import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { KvilPlace } from '../lib/types'
import { KvilMark } from '../components/KvilMark'
import { KvilMap } from '../components/KvilMap'

/** Stub: surfaces a Kvil place ahead + the collection. To be built out per impl plan §4.2. */
export function RouteScreen() {
  const [places, setPlaces] = useState<KvilPlace[]>([])
  const [source, setSource] = useState<'live' | 'fixture'>('fixture')

  useEffect(() => {
    api.getPlaces().then((r) => {
      setPlaces(r.data)
      setSource(r.source)
    })
  }, [])

  const ahead = places[1] ?? places[0]

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
        </Link>
      )}

      <section className="flex flex-col gap-3">
        <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-muted)]">
          Kvil-stader
        </h3>
        {places.map((p) => (
          <Link
            key={p.id}
            to={`/place/${p.id}`}
            data-place={p.id}
            className="flex items-center justify-between rounded-xl border border-[var(--kvil-line)] bg-[var(--place-surface)] p-3"
          >
            <div>
              <p className="font-serif-kvil text-[var(--place-ink)]">{p.name}</p>
              <p className="text-xs text-[var(--kvil-muted)]">
                {p.city} · {p.region}
              </p>
            </div>
            <KvilMark />
          </Link>
        ))}
      </section>

      <p className="text-center text-[10px] text-[var(--kvil-muted)]">
        data: {source === 'live' ? 'live proxy' : 'fixture fallback'}
      </p>
    </div>
  )
}
