import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import type { ChargeEstimate } from '../lib/types'
import { PLACES } from '../lib/places'

/** Stub: the plug-in moment — Kvil (stay) / Snøgg (to the car) toggle + live charge window. */
export function PlugInScreen() {
  const navigate = useNavigate()
  const place = PLACES.laerdal
  const [mode, setMode] = useState<'kvil' | 'snogg'>('snogg')
  const [estimate, setEstimate] = useState<ChargeEstimate | null>(null)

  useEffect(() => {
    api
      .getChargeEstimate({ stationId: place.stationId, socPct: 28 })
      .then((r) => setEstimate(r.data))
  }, [place.stationId])

  return (
    <div data-place={place.id} className="flex min-h-full flex-col gap-5 bg-[var(--place-bg)] p-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-muted)]">
          Plugga inn · {place.name}
        </p>
        <h1 className="font-serif-kvil text-2xl text-[var(--place-ink)]">
          {estimate ? `Du har ${estimate.minutes} minutt` : 'Reknar ut ladetid…'}
        </h1>
        {estimate && (
          <p className="text-sm text-[var(--place-ink)]/70">
            {estimate.fromSoc}% → {estimate.toSoc}% · {estimate.chargerKw} kW ·{' '}
            {estimate.weather}
          </p>
        )}
      </header>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode('kvil')}
          className={[
            'rounded-2xl border p-4 text-left transition',
            mode === 'kvil'
              ? 'border-transparent text-white'
              : 'border-[var(--kvil-line)] bg-[var(--place-surface)] text-[var(--place-ink)]',
          ].join(' ')}
          style={mode === 'kvil' ? { background: 'var(--place-accent)' } : undefined}
        >
          <p className="font-serif-kvil text-lg">Kvil</p>
          <p className="text-xs opacity-80">Bli verande — ta pausen</p>
        </button>
        <button
          onClick={() => setMode('snogg')}
          className={[
            'rounded-2xl border p-4 text-left transition',
            mode === 'snogg'
              ? 'border-transparent text-white'
              : 'border-[var(--kvil-line)] bg-[var(--place-surface)] text-[var(--place-ink)]',
          ].join(' ')}
          style={mode === 'snogg' ? { background: 'var(--place-accent)' } : undefined}
        >
          <p className="font-serif-kvil text-lg">Snøgg</p>
          <p className="text-xs opacity-80">Rett til bilen</p>
        </button>
      </div>

      <button
        onClick={() => navigate(mode === 'snogg' ? '/snogg' : `/place/${place.id}`)}
        className="mt-auto rounded-full bg-[var(--place-accent)] py-3 font-medium text-white"
      >
        {mode === 'snogg' ? 'Bestill til bilen' : 'Sjå Kvil-stedet'}
      </button>
    </div>
  )
}
