import { useEffect, useMemo, useState } from 'react'
import { FIXTURE_ARRIVALS, FIXTURE_TICKETS } from '../lib/host'
import type { KitchenTicket } from '../lib/types'
import {
  Screen,
  PageHeader,
  PlainCard,
  Pill,
  BackLink,
  GreenBanner,
  BoltIcon,
  ClockIcon,
  CoffeeIcon,
  FlameIcon,
  CheckIcon,
} from '../components/ui'

type View = 'kitchen' | 'arrivals'

/** Status pill colours for the kitchen queue. */
const STATUS: Record<
  KitchenTicket['status'],
  { label: string; bg: string; fg: string; border: string }
> = {
  queued: { label: 'I kø', bg: '#f4f1ee', fg: '#645c56', border: 'var(--kvil-card-line)' },
  firing: { label: 'På bålet', bg: '#fff4e5', fg: '#8a5a12', border: '#8a5a12' },
  ready: { label: 'Klar', bg: '#e8f5e9', fg: '#2e7d32', border: '#4caf50' },
  delivered: { label: 'Levert', bg: '#e8f5e9', fg: '#2e7d32', border: '#4caf50' },
}

/**
 * Vertskap (host) operations: the Kvil i bil kitchen queue sequenced by
 * predicted charge-complete time (Epic 4.1) and the arrivals list with each
 * member's pass tier + usual order so the host can prepare ahead (Epic 4.2).
 */
export function HostScreen() {
  const [view, setView] = useState<View>('kitchen')

  // A gentle live tick so the minute counters feel alive during the demo.
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 4000)
    return () => clearInterval(t)
  }, [])

  // Sequence tickets by charge-complete (soonest car first) — the core of 4.1.
  const tickets = useMemo(
    () => [...FIXTURE_TICKETS].sort((a, b) => a.chargeCompleteMin - b.chargeCompleteMin),
    [],
  )

  // Decrement the live minute counters, never below zero.
  const countdown = (min: number) => Math.max(0, min - elapsed)

  return (
    <Screen>
      <PageHeader
        eyebrow="Vertskap"
        title="Kjøkken & ankomst"
        sub="Bakeriet i Lom"
      />

      <div className="flex gap-2">
        <Pill
          icon={<FlameIcon color={view === 'kitchen' ? '#fff' : '#241e1a'} />}
          active={view === 'kitchen'}
          onClick={() => setView('kitchen')}
        >
          Kø ({tickets.length})
        </Pill>
        <Pill
          icon={<BoltIcon color={view === 'arrivals' ? '#fff' : '#241e1a'} />}
          active={view === 'arrivals'}
          onClick={() => setView('arrivals')}
        >
          Ankomst ({FIXTURE_ARRIVALS.length})
        </Pill>
      </div>

      {view === 'kitchen' ? (
        <KitchenQueue tickets={tickets} countdown={countdown} />
      ) : (
        <Arrivals countdown={countdown} />
      )}

      <BackLink to="/">Tilbake</BackLink>
    </Screen>
  )
}

// --- Kitchen queue (Epic 4.1) -----------------------------------------------

function KitchenQueue({
  tickets,
  countdown,
}: {
  tickets: KitchenTicket[]
  countdown: (min: number) => number
}) {
  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
        Sekvensert mot bil-ferdig
      </p>
      {tickets.map((t) => {
        const carDone = countdown(t.chargeCompleteMin)
        // When the kitchen should start to land the order ~on time.
        const fireIn = countdown(t.chargeCompleteMin - t.prepMin)
        const s = STATUS[t.status]
        const isReady = t.status === 'ready' || t.status === 'delivered'
        return (
          <PlainCard key={t.id}>
            <div className="flex gap-3">
              {/* Prominent bay badge for delivery. */}
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#171616] text-white">
                <span className="text-[10px] uppercase tracking-[0.15em] opacity-70">
                  Bay
                </span>
                <span className="font-display text-2xl font-bold leading-none">
                  {t.bay}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display text-base font-semibold text-[#2b2626]">
                      {t.memberName}
                    </p>
                    <p className="text-xs text-[var(--kvil-text-soft)]">{t.id}</p>
                  </div>
                  <span
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: s.bg, color: s.fg, borderColor: s.border }}
                  >
                    {t.status === 'firing' && <FlameIcon color={s.fg} />}
                    {isReady && <CheckIcon color={s.fg} />}
                    {s.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {t.items.map((it) => (
                    <span
                      key={it}
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--kvil-card-line)] bg-[#faf8f5] px-2.5 py-1 text-[11px] font-medium text-[#241e1a]"
                    >
                      <CoffeeIcon />
                      {it}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--kvil-text-soft)]">
                  <span className="inline-flex items-center gap-1">
                    <BoltIcon />
                    Bil ferdig om {carDone} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon />
                    Fyr om {fireIn} min
                  </span>
                </div>
              </div>
            </div>

            {isReady && (
              <div className="mt-3">
                <GreenBanner
                  title="Klar til levering"
                  body={`Lever til Bay ${t.bay} — ${t.memberName}.`}
                />
              </div>
            )}
          </PlainCard>
        )
      })}
    </section>
  )
}

// --- Arrivals (Epic 4.2) ----------------------------------------------------

function Arrivals({ countdown }: { countdown: (min: number) => number }) {
  // Soonest arrival first so the host preps in order.
  const arrivals = useMemo(
    () => [...FIXTURE_ARRIVALS].sort((a, b) => a.etaMin - b.etaMin),
    [],
  )
  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
        På veg inn
      </p>
      {arrivals.map((a) => {
        const premium = a.tier === 'Kvil Premium'
        return (
          <PlainCard key={a.memberName + a.vehicleModel}>
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold text-[#2b2626]">
                    {a.memberName}
                  </p>
                  <p className="text-xs text-[var(--kvil-text-soft)]">
                    {a.vehicleModel}
                  </p>
                </div>
                <span
                  className="inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                  style={
                    premium
                      ? { background: '#171616', color: '#fff', borderColor: 'transparent' }
                      : {
                          background: '#fff',
                          color: '#241e1a',
                          borderColor: 'var(--kvil-card-line)',
                        }
                  }
                >
                  {a.tier}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-[var(--kvil-text-soft)]">
                <ClockIcon />
                Om {countdown(a.etaMin)} min
              </div>

              <div className="flex items-start gap-1.5 rounded-xl border border-[var(--kvil-card-line)] bg-[#faf8f5] px-3 py-2">
                <CoffeeIcon />
                <span className="text-xs text-[#241e1a]">
                  <span className="text-[var(--kvil-text-soft)]">Det vanlege: </span>
                  {a.usual}
                </span>
              </div>
            </div>
          </PlainCard>
        )
      })}
    </section>
  )
}
