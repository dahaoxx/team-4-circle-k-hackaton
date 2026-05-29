import { Link } from 'react-router-dom'
import { PLACES } from '../lib/places'

/** Stub: the Snøgg flow — pre-order → kitchen timer → delivered to bay. To be built out per impl plan §4.2. */
export function SnoggScreen() {
  const place = PLACES.laerdal
  return (
    <div data-place={place.id} className="flex min-h-full flex-col gap-5 bg-[var(--place-bg)] p-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-muted)]">
          Snøgg · rett til bilen
        </p>
        <h1 className="font-serif-kvil text-2xl text-[var(--place-ink)]">{place.name}</h1>
      </header>

      <div className="rounded-2xl border border-dashed border-[var(--kvil-line)] bg-[var(--place-surface)] p-4 text-sm text-[var(--place-ink)]/70">
        <p className="font-medium text-[var(--place-ink)]">Stub — Snøgg flow</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          <li>Curated menu (signature + your usual)</li>
          <li>One-tap pre-order</li>
          <li>Kitchen timer, finishes ~2 min before the battery</li>
          <li>Delivered to bay 3 — ready before your car</li>
        </ol>
      </div>

      <Link
        to="/"
        className="mt-auto rounded-full bg-[var(--place-accent)] py-3 text-center font-medium text-white"
      >
        Ferdig
      </Link>
    </div>
  )
}
