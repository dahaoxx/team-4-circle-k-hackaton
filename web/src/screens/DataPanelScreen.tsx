import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { KvilpassetEconomics } from '../lib/types'

const nok = (n: number) =>
  new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 }).format(n)

/** Stub: the data panel — premium spend lift + modelled Kvilpasset revenue. */
export function DataPanelScreen() {
  const [econ, setEcon] = useState<KvilpassetEconomics | null>(null)
  const [source, setSource] = useState<'live' | 'fixture'>('fixture')

  useEffect(() => {
    api.getKvilpassetEconomics().then((r) => {
      setEcon(r.data)
      setSource(r.source)
    })
  }, [])

  if (!econ) return <div className="p-5 text-[var(--kvil-muted)]">Lastar…</div>

  return (
    <div className="flex flex-col gap-5 p-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-muted)]">
          Forretningsmodell
        </p>
        <h1 className="font-serif-kvil text-2xl text-[var(--kvil-ink)]">
          Kvifor Kvil tener meir
        </h1>
      </header>

      <div className="rounded-2xl border border-[var(--kvil-line)] bg-white p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-muted)]">
          Premium spend-lift
        </p>
        <p className="font-serif-kvil text-4xl text-[var(--kvil-accent)]">
          +{econ.spendLiftPct}%
        </p>
        <p className="text-sm text-[var(--kvil-muted)]">
          {nok(econ.premiumAvgSpendNok)} vs {nok(econ.baseAvgSpendNok)} NOK / år
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Vask-abonnement" value={`${econ.carwashSubscriptionSharePct}%`} />
        <Stat label="Premium-segment" value={nok(econ.premiumSegmentSize)} />
      </div>

      <div className="rounded-2xl border border-[var(--kvil-line)] bg-white p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-muted)]">
          Modellert Kvilpasset-inntekt / år
        </p>
        <p className="font-serif-kvil text-2xl text-[var(--kvil-ink)]">
          {nok(econ.modelledAnnualRevenueNok.expected)} NOK
        </p>
        <p className="text-sm text-[var(--kvil-muted)]">
          {nok(econ.modelledAnnualRevenueNok.low)} – {nok(econ.modelledAnnualRevenueNok.high)} NOK
          · {nok(econ.assumedMonthlyPriceNok)} NOK/mnd
        </p>
      </div>

      <p className="text-center text-[10px] text-[var(--kvil-muted)]">
        data: {source === 'live' ? 'live proxy' : 'fixture fallback'}
      </p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--kvil-line)] bg-white p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-muted)]">{label}</p>
      <p className="font-serif-kvil text-2xl text-[var(--kvil-ink)]">{value}</p>
    </div>
  )
}
