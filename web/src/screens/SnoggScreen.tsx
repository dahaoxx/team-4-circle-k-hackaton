import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PLACES } from '../lib/places'
import { useKvil } from '../lib/state'
import {
  Screen,
  PageHeader,
  PlainCard,
  PrimaryButton,
  BackLink,
  ProgressBar,
  GreenBanner,
  KBadge,
  ClockIcon,
  CheckIcon,
} from '../components/ui'

const BAY = 3
type Phase = 'menu' | 'cooking' | 'done'

/** Kvil i bil — pre-order → kitchen timer → delivered to bay (Epic 2.3); priced up front (5.1). */
export function SnoggScreen() {
  const [params] = useSearchParams()
  const { member, placeOrder } = useKvil()
  const place = PLACES[params.get('place') ?? ''] ?? PLACES.lom

  // Pre-select the member's usual on a reorder deep-link.
  const reorderItem = params.get('reorder') ? params.get('item') : null
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(reorderItem ? [reorderItem] : place.menu.filter((m) => m.signature).map((m) => m.id)),
  )
  const [phase, setPhase] = useState<Phase>('menu')
  const [progress, setProgress] = useState(0)

  const chosen = place.menu.filter((m) => selected.has(m.id))
  const total = chosen.reduce((s, m) => s + m.priceNok, 0)
  const maxReady = chosen.reduce((s, m) => Math.max(s, m.readyMin), 0)

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  // Accelerated "kitchen timer": fills over ~10s, fires to finish before the car.
  useEffect(() => {
    if (phase !== 'cooking') return
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(id)
          return 100
        }
        return p + 4
      })
    }, 400)
    return () => window.clearInterval(id)
  }, [phase])

  // When the kitchen finishes, mark delivered + record the order once.
  useEffect(() => {
    if (phase === 'cooking' && progress >= 100) {
      placeOrder({
        placeId: place.id,
        items: chosen.map((m) => m.name),
        totalNok: total,
        bay: BAY,
        pointsEarned: Math.round(total),
      })
      const t = window.setTimeout(() => setPhase('done'), 1400)
      return () => window.clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, progress])

  const status = useMemo(() => {
    if (progress < 25) return 'Bestilling motteke'
    if (progress < 70) return 'Kjøkkenet fyrar'
    if (progress < 100) return 'Snart klar'
    return `Levert til bay ${BAY}`
  }, [progress])

  // --- Receipt ---------------------------------------------------------------
  if (phase === 'done') {
    return (
      <Screen place={place.id}>
        <PageHeader eyebrow={`Kvil i bil · ${place.name}`} title="Køyr vidare — full på alle vis" />
        <PlainCard>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f5e9]">
                <CheckIcon />
              </span>
              <p className="font-display font-semibold text-[#2b2626]">Levert til bay {BAY}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-[var(--kvil-card-line)] pt-3">
              {chosen.map((m) => (
                <div key={m.id} className="flex justify-between text-sm">
                  <span className="text-[#2b2626]">{m.name}</span>
                  <span className="text-[var(--kvil-text-soft)]">{m.priceNok} kr</span>
                </div>
              ))}
              <div className="mt-1 flex justify-between border-t border-[var(--kvil-card-line)] pt-2 font-semibold text-[#2b2626]">
                <span>Totalt</span>
                <span>{total} kr</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[var(--place-soft)] px-3 py-2 text-sm text-[var(--place-ink)]">
              <KBadge size={18} /> +{Math.round(total)} Extra-poeng · stempel samla
            </div>
          </div>
        </PlainCard>

        <PrimaryButton
          className="!bg-[var(--place-accent)]"
          onClick={() => {
            setPhase('menu')
            setProgress(0)
          }}
        >
          Bestill på nytt
        </PrimaryButton>
        <PrimaryButton to="/kvilpasset">Sjå passet</PrimaryButton>
        <BackLink to="/">Ferdig</BackLink>
      </Screen>
    )
  }

  // --- Kitchen timer ---------------------------------------------------------
  if (phase === 'cooking') {
    return (
      <Screen place={place.id}>
        <PageHeader eyebrow={`Kvil i bil · ${place.name}`} title={status} />
        <PlainCard>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--kvil-text-soft)]">
                Timar slik at maten er klar ~2 min før bilen din
              </p>
              <span className="font-display text-lg font-semibold tabular-nums text-[#2b2626]">
                {progress}%
              </span>
            </div>
            <ProgressBar value={progress} />
            <ol className="flex flex-col gap-2 text-sm">
              <Step done={progress >= 1} label="Bestilling motteke" />
              <Step done={progress >= 25} label="Kjøkkenet fyrar (timar til ladinga)" />
              <Step done={progress >= 70} label="Pakkast for bilen" />
              <Step done={progress >= 100} label={`Levert til bay ${BAY} av ${place.host}`} />
            </ol>
          </div>
        </PlainCard>
        {progress >= 100 && (
          <GreenBanner
            title={`Klar ved bay ${BAY}`}
            body={`${place.host} kjem ut med bestillinga di no.`}
          />
        )}
      </Screen>
    )
  }

  // --- Menu ------------------------------------------------------------------
  return (
    <Screen place={place.id}>
      <PageHeader
        eyebrow={`Kvil i bil · ${place.name}`}
        title="Bestill til bilen"
        sub="Ein kort, kuratert meny — signaturen og det vanlege ditt"
      />

      <div className="flex flex-col gap-2">
        {place.menu.map((m) => {
          const isSel = selected.has(m.id)
          const isUsual = member.usual.placeId === place.id && member.usual.itemId === m.id
          return (
            <button key={m.id} onClick={() => toggle(m.id)} className="text-left">
              <PlainCard className={isSel ? 'ring-2 ring-[var(--place-accent)]' : ''}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display font-semibold text-[#2b2626]">{m.name}</p>
                      {m.signature && (
                        <span className="rounded-full bg-[#171616] px-2 py-0.5 text-[10px] font-semibold text-white">
                          signatur
                        </span>
                      )}
                      {isUsual && (
                        <span className="rounded-full bg-[var(--place-accent)] px-2 py-0.5 text-[10px] font-semibold text-white">
                          det vanlege
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--kvil-text-soft)]">{m.sourcing}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[var(--kvil-text-soft)]">
                      <ClockIcon /> klar om ~{m.readyMin} min
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="font-display font-semibold text-[#2b2626]">{m.priceNok} kr</span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        isSel
                          ? 'border-transparent bg-[var(--place-accent)] text-white'
                          : 'border-[var(--kvil-card-line)]'
                      }`}
                    >
                      {isSel ? '✓' : ''}
                    </span>
                  </div>
                </div>
              </PlainCard>
            </button>
          )
        })}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-center justify-between px-1 text-sm">
          <span className="text-[var(--kvil-text-soft)]">
            {chosen.length} vare{chosen.length === 1 ? '' : 'r'} · klar om ~{maxReady} min
          </span>
          <span className="font-display text-lg font-semibold text-[#2b2626]">{total} kr</span>
        </div>
        <PrimaryButton
          className="!bg-[var(--place-accent)]"
          disabled={chosen.length === 0}
          onClick={() => {
            setProgress(0)
            setPhase('cooking')
          }}
        >
          Bestill til bilen · {total} kr
        </PrimaryButton>
        <BackLink to={`/plug-in?place=${place.id}`}>Tilbake</BackLink>
      </div>
    </Screen>
  )
}

function Step({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          done ? 'bg-[#e8f5e9]' : 'border border-[var(--kvil-card-line)]'
        }`}
      >
        {done && <CheckIcon />}
      </span>
      <span className={done ? 'text-[#2b2626]' : 'text-[var(--kvil-text-soft)]'}>{label}</span>
    </li>
  )
}
