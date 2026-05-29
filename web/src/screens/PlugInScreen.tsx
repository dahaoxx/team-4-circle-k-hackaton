import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { ChargeEstimate } from '../lib/types'
import { PLACES } from '../lib/places'
import { useKvil } from '../lib/state'
import { useCountdown, fmtClock } from '../lib/useCountdown'
import { PlainCard, PrimaryButton, BackLink, BoltIcon, MoonIcon, SunIcon } from '../components/ui'

/** The plug-in moment — charge-time prediction (Epic 2.1) + Kvil/Snøgg toggle (2.2). */
export function PlugInScreen() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { member } = useKvil()
  const place = PLACES[params.get('place') ?? ''] ?? PLACES.laerdal

  const [mode, setMode] = useState<'kvil' | 'snogg'>('snogg')
  const [estimate, setEstimate] = useState<ChargeEstimate | null>(null)

  useEffect(() => {
    api
      .getChargeEstimate({ stationId: place.stationId, memberId: member.memberId, socPct: member.socPct })
      .then((r) => setEstimate({ ...r.data, stationName: place.name }))
  }, [place.stationId, place.name, member.memberId, member.socPct])

  const remaining = useCountdown(estimate ? estimate.minutes * 60 : null)

  return (
    <div data-place={place.id} className="flex min-h-full flex-col gap-5 bg-[var(--place-bg)] px-5 pb-8 pt-4">
      <header className="flex flex-col gap-0.5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
          Plugga inn · {place.name}
        </p>
        <h1 className="font-display text-2xl font-semibold text-[var(--place-ink)]">
          {estimate ? `Du har ${estimate.minutes} minutt` : 'Reknar ut ladetid…'}
        </h1>
      </header>

      {/* Live charge window */}
      <PlainCard>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
              Ferdig om
            </p>
            <p className="font-display text-4xl font-semibold tabular-nums text-[#2b2626]">
              {estimate ? fmtClock(remaining) : '–:--'}
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf7eb]">
            <BoltIcon color="#2e7d32" />
          </div>
        </div>

        {estimate && (
          <div className="mt-3 flex flex-col gap-2 border-t border-[var(--kvil-card-line)] pt-3">
            <Row label="Lading" value={`${estimate.fromSoc}% → ${estimate.toSoc}% · ${estimate.kwhToAdd} kWh`} />
            <Row label="Ladar" value={`${estimate.chargerKw} kW · ${member.vehicleModel}`} />
            <Row label="Vêr" value={estimate.weather} />
            {estimate.derateApplied && estimate.coldPenaltyMin ? (
              <p className="rounded-lg bg-[#fff4e5] px-3 py-2 text-xs text-[#8a5a12]">
                +{estimate.coldPenaltyMin} min for kulde — kaldt batteri ladar saktare ved{' '}
                {estimate.weather}
              </p>
            ) : null}
            <p className="text-[11px] text-[var(--kvil-text-soft)]">
              Rekna ut frå bilbatteri, ladar-effekt, ladenivå og vêr.
            </p>
          </div>
        )}
      </PlainCard>

      {/* Mode toggle (Epic 2.2) */}
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
          Korleis vil du kvile?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <ModeButton
            active={mode === 'kvil'}
            onClick={() => setMode('kvil')}
            icon={<SunIcon color={mode === 'kvil' ? '#fff' : '#241e1a'} />}
            title="Kvil"
            sub="Bli verande — ta pausen"
          />
          <ModeButton
            active={mode === 'snogg'}
            onClick={() => setMode('snogg')}
            icon={<MoonIcon color={mode === 'snogg' ? '#fff' : '#241e1a'} />}
            title="Kvil i bil"
            sub="Rett til bilen"
          />
        </div>
      </div>

      <PrimaryButton
        className="mt-auto !bg-[var(--place-accent)]"
        onClick={() => navigate(mode === 'snogg' ? `/snogg?place=${place.id}` : `/stay?place=${place.id}`)}
      >
        {mode === 'snogg' ? 'Bestill til bilen' : 'Sjå kva pausen kan vere'}
      </PrimaryButton>
      <BackLink to={`/place/${place.id}`}>Tilbake</BackLink>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--kvil-text-soft)]">{label}</span>
      <span className="text-right font-medium text-[#2b2626]">{value}</span>
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  icon,
  title,
  sub,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  title: string
  sub: string
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex flex-col gap-1 rounded-2xl border p-4 text-left transition',
        active
          ? 'border-transparent text-white'
          : 'border-[var(--kvil-card-line)] bg-white text-[#2b2626]',
      ].join(' ')}
      style={active ? { background: 'var(--place-accent)' } : undefined}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10">
        {icon}
      </span>
      <span className="font-display text-lg font-semibold">{title}</span>
      <span className="text-xs opacity-80">{sub}</span>
    </button>
  )
}
