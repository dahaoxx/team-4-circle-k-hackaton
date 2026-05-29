import { Link, useParams } from 'react-router-dom'
import { PLACES } from '../lib/places'
import { KvilMark } from '../components/KvilMark'

/** Stub: a per-place themed page. Distinct palette via data-place. To be built out per impl plan §4.2. */
export function PlaceScreen() {
  const { placeId } = useParams()
  const place = (placeId && PLACES[placeId]) || PLACES.nebbenes

  return (
    <div data-place={place.id} className="flex min-h-full flex-col bg-[var(--place-bg)]">
      <div
        className="flex h-44 flex-col justify-end p-5 text-white"
        style={{ background: 'var(--place-accent)' }}
      >
        <p className="text-xs uppercase tracking-[0.2em] opacity-80">{place.tagline}</p>
        <h1 className="font-serif-kvil text-3xl">{place.name}</h1>
        <p className="text-sm opacity-90">
          {place.city} · {place.region}
        </p>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--kvil-muted)]">Vert</p>
            <p className="font-serif-kvil text-lg text-[var(--place-ink)]">{place.host}</p>
          </div>
          <KvilMark withParent />
        </div>

        <div className="rounded-2xl bg-[var(--place-surface)] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-muted)]">
            Signatur
          </p>
          <p className="mt-1 text-[var(--place-ink)]">{place.signature}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {place.topCategories.map((c) => (
              <span
                key={c}
                className="rounded-full bg-[var(--place-soft)] px-3 py-1 text-xs text-[var(--place-ink)]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <Link
          to="/plug-in"
          className="rounded-full py-3 text-center font-medium text-white"
          style={{ background: 'var(--place-accent)' }}
        >
          Plugg inn her
        </Link>
        <Link to="/" className="text-center text-sm text-[var(--kvil-muted)]">
          ← Tilbake til vegen
        </Link>
      </div>
    </div>
  )
}
